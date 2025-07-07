import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import User from "@/models/User";
import Favourite from "@/models/Favourite";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extractPDFText } from "@/lib/pdf-parse"
import { redis } from '@/lib/redis';
// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

//Redis Key

function getCacheKey(branch, semester) {
    return `notes:${branch || 'all'}:${semester || 'all'}`;
}

// Connect to MongoDB if not already connected
async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Ensure db connection
        await connectToDB();

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const branch = formData.get('branch');
        const semester = formData.get('semester');
        const subject = formData.get('subject');
        const file = formData.get('file');

        if (!file || !title) {
            return new Response(JSON.stringify({ error: "Title and file are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        console.log(file, 'file');
        let extractedText = null;
        let hasTextExtraction = false;

        // Only extract text for PDFs (fast operation - usually < 1 second)
        if (file.type === 'application/pdf') {
            console.log('Extracting text from PDF...');
            const fileBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(fileBuffer);

            extractedText = await extractPDFText(buffer);
            hasTextExtraction = !!extractedText;

            // Truncate text for storage (first 15k characters)
            if (extractedText && extractedText.length > 15000) {
                extractedText = extractedText.substring(0, 15000);
            }
        }

        // Generate unique file key for S3
        const fileKey = `notes/${user._id}/${Date.now()}-${file.name}`;

        // Create pre-signed URL for upload
        const uploadUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                ContentType: file.type,
            }),
            { expiresIn: 60 * 5 } // 5 minutes
        );

        // Upload file to S3 using the pre-signed URL
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file to S3');
        }

        // Save note metadata to MongoDB
        const note = await Note.create({
            title,
            description,
            fileKey, // Store S3 key instead of URL
            createdBy: user._id,
            branch,
            semester,
            subject,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            extractedText,
            hasTextExtraction,
        });

        return new Response(JSON.stringify({ success: true, note }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        await connectToDB();

        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let filter = {};
        let cacheKey = ''
        if (user.onBoard) {
            const branch = user.branch;
            const semester = user.semester;
            if (semester === 1 || semester === 2) {
                filter = {
                    semester: semester
                };
            } else {
                filter = {
                    branch: branch,
                    semester: semester
                };
            }

            cacheKey = getCacheKey(branch, semester);
        }

        const cached = await redis.get(cacheKey);
        let notes = []
        if (cached) {
            // return new Response(JSON.stringify({ notes: cached }), {
            //     status: 200,
            //     headers: { 'Content-Type': 'application/json' }
            // });
            notes = cached
            console.log('cached', typeof cached)
        } else {
            notes = await Note.find(filter).populate('createdBy', 'name email').lean();
            console.log('notes', typeof notes)
            await redis.set(cacheKey, JSON.stringify(notes), { ex: 60 * 60 });
        }
        let favouriteNoteIds = [];
        const favoriteNotes = await Favourite.find({
            user: user._id,
            note: { $in: notes.map(n => n._id) }
        }).select('note').lean();
        favouriteNoteIds = favoriteNotes.map(fav => fav.note.toString());
        // Generate download URLs for each note
        const notesWithUrls = await Promise.all(notes?.map(async (note) => {
            // const downloadUrl = await getSignedUrl(
            //     s3Client,
            //     new GetObjectCommand({
            //         Bucket: process.env.AWS_BUCKET_NAME,
            //         Key: note.fileKey,
            //     }),
            //     { expiresIn: 60 * 60 } // 1 hour
            // );
            console.log('note', typeof note)
            return {
                ...note,
                // downloadUrl,
                isFavourite: favouriteNoteIds?.includes(note._id.toString()) || false
            };
        }));

        return new Response(JSON.stringify({ notes: notesWithUrls }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectToDB();

        const { id } = await req.json();
        if (!id) {
            return new Response(JSON.stringify({ error: "Note ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const note = await Note.findOne({ _id: id, createdBy: user._id });
        if (!note) {
            return new Response(JSON.stringify({ error: "Note not found or not owned by user" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Delete file from S3
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: note.fileKey,
            })
        );

        // Delete note from MongoDB
        await Note.deleteOne({ _id: id });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
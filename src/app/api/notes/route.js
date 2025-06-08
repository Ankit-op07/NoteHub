import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import User from "@/models/User";
import Favourite from "@/models/Favourite";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

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

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { searchParams } = new URL(req.url);
        const branch = searchParams.get("branch");
        const semester = searchParams.get("semester");
        const subject = searchParams.get("subject");

        const filter = {};
        if (branch && branch !== "null" && branch !== "undefined") {
            filter.branch = branch;
        }

        if (semester && semester !== "null" && semester !== "undefined") {
            filter.semester = parseInt(semester);
        }

        if (subject && subject !== "null" && subject !== "undefined") {
            filter.subject = subject;
        }

        const notes = await Note.find(filter).populate('createdBy', 'name email');

        let favouriteNoteIds = [];
        const favoriteNotes = await Favourite.find({
            user: user._id,
            note: { $in: notes.map(n => n._id) }
        }).select('note').lean();
        console.log(favoriteNotes);

        favouriteNoteIds = favoriteNotes.map(fav => fav.note.toString());
        // Generate download URLs for each note
        const notesWithUrls = await Promise.all(notes.map(async (note) => {
            const downloadUrl = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: note.fileKey,
                }),
                { expiresIn: 60 * 60 } // 1 hour
            );

            return {
                ...note.toObject(),
                downloadUrl,
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
                Bucket: process.env.AWS_S3_BUCKET_NAME,
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
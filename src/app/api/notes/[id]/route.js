import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "User Not Found" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        await connectToDB();
        const { id } = await params
        const noteId = id
        const note = await Note.findById(noteId).populate('createdBy');
        if (!note) return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
        const downloadUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: note.fileKey,
            }),
            { expiresIn: 60 * 60 } // 1 hour
        );

        const noteWithUrl = {
            ...note.toObject(),
            downloadUrl
        }
        return new Response(JSON.stringify({ note: noteWithUrl, success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}
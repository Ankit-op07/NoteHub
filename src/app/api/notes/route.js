import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new Response("Unauthorized", { status: 401 });

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const { title, description, fileUrl, branch, semester, subject } = await req.json();

        const user = await User.findOne({ email: session.user.email });
        if (!user) return new Response("User not found", { status: 404 });

        const note = await Note.create({
            title,
            description,
            fileUrl,
            createdBy: user._id,
            branch,
            semester,
            subject
        });

        return Response.json({ success: true, note });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function GET(req) {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const { searchParams } = new URL(req.url);
        const branch = searchParams.get("branch");
        const semester = searchParams.get("semester");
        const subject = searchParams.get("subject");

        const filter = {};
        if (branch) filter.branch = branch;
        if (semester) filter.semester = parseInt(semester);
        if (subject) filter.subject = subject;

        const notes = await Note.find(filter).populate("uploadedBy", "name email");

        return Response.json({ notes });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

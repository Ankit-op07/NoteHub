import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import { generateSummary } from "@/lib/ai/summary"
import mongoose from "mongoose";


async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "User Not Found" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        console.log('api called to summary')
        await connectToDB();
        console.log('connected to mongo')
        const { id } = await params
        const noteId = id
        const note = await Note.findById(noteId);
        // console.log('note', note)
        if (!note) return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
        // Return cached summary if exists
        if (note.summary) {
            return new Response(JSON.stringify({ summary: note.summary }), { status: 200 });
        }
        // Generate and save summary
        const summary = await generateSummary(note.extractedText);
        await Note.updateOne({ _id: noteId }, { summary });

        return new Response(JSON.stringify({ summary }), { status: 200 });
    } catch (error) {
        console.error('Error in summary generation:', error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}
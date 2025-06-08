// app/api/notes/[id]/view/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Note from "@/models/Note";
import dbConnect from "@/lib/dbConnect";

export async function POST(req, context) {
    try {
        await dbConnect();
        const { params } = context;
        const { id } = params;

        // Optional: Prevent duplicate views from same user
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const update = { $inc: { views: 1 } };

        await Note.findByIdAndUpdate(id, update);

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
// app/api/Favourites/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Favourite from "@/models/Favourite";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/dbConnect";

async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        await connectToDB();
        const userId = session.user.id
        const Favourites = await Favourite.find({ user: userId }).populate('note');
        return NextResponse.json({ Favourites }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

        await connectToDB();
        const { noteId } = await req.json()

        if (!noteId) {
            return new Response(JSON.stringify({ error: "Note ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const FavouriteNote = await Favourite.create({
            user: session.user.id,
            note: noteId
        });

        return new Response(JSON.stringify({ success: true, FavouriteNote }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return new Response(JSON.stringify({ error: "Note already Favourited" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
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
        const { noteId } = await req.json();

        if (!noteId) {
            return new Response(JSON.stringify({ error: "Note ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await Favourite.findOneAndDelete({
            user: session.user.id,
            note: noteId
        });

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
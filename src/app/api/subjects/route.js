import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Subject from '@/models/Subject'; // Adjust the import path as needed

async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.code || !body.branch || !body.semester) {
            return NextResponse.json(
                { error: 'Missing required fields (name, code, branch, semester)' },
                { status: 400 }
            );
        }
        await connectToDB();
        // Create new subject
        const newSubject = new Subject({
            name: body.name,
            code: body.code,
            branch: body.branch,
            semester: body.semester,
            credits: body.credits || null,
            description: body.description || null
        });

        const savedSubject = await newSubject.save();

        return NextResponse.json(savedSubject, { status: 201 });

    } catch (error) {
        // Handle duplicate key error (unique constraint violation)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Subject with this branch, semester, and code combination already exists' },
                { status: 409 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            { error: error.message || 'Failed to create subject' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const branch = searchParams.get('branch');
        const semester = searchParams.get('semester');

        let query = {};
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);

        const subjects = await Subject.find(query);

        return NextResponse.json(subjects);

    } catch (error) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch subjects' },
            { status: 500 }
        );
    }
}
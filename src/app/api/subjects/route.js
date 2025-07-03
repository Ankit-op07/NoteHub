import { NextResponse } from 'next/server';
import mongoose from "mongoose";
import Subject from '@/models/Subject';
import { redis } from '@/lib/redis';

const CACHE_TTL_SECONDS = 6000; // 1 Hour

async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}
function getCacheKey(branch, semester) {
    return `subjects:${branch || 'all'}:${semester || 'all'}`;
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const branch = url.searchParams.get('branch');
        const semester = url.searchParams.get('semester');

        const cacheKey = getCacheKey(branch, semester);

        // Try cache first
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log('Cache hit', cached);
            return NextResponse.json(cached);
        }

        await connectToDB();

        const query = {};
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);

        const subjects = await Subject.find(query).lean();

        // Save to cache
        await redis.set(cacheKey, JSON.stringify(subjects), { ex: CACHE_TTL_SECONDS });

        return NextResponse.json(subjects);
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Failed to fetch subjects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.name || !body.code || !body.branch || !body.semester) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        await connectToDB();

        const newSubject = new Subject({
            name: body.name,
            code: body.code,
            branch: body.branch,
            semester: body.semester,
            credits: body.credits || null,
            description: body.description || null,
        });

        const savedSubject = await newSubject.save();

        // Invalidate related cache
        await redis.del(getCacheKey(body.branch, body.semester));
        await redis.del(getCacheKey(null, null)); // all:all key

        return NextResponse.json(savedSubject, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Duplicate subject exists' }, { status: 409 });
        }

        return NextResponse.json({ error: error.message || 'Failed to create subject' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from "@/models/User";
import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';

// Validation schema matching the frontend
const studentSchema = z.object({
    studentId: z.string()
        .min(6, "Student ID must be at least 6 characters")
        .max(12, "Student ID must be at most 12 characters"),
    branch: z.enum(["cse", "ece", "mech", "civil", "eee"]),
    semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
});

export async function POST(request) {
    try {
        // 1. Connect to MongoDB
        await dbConnect();

        // 2. Authenticate the user
        const session = await getServerSession(authOptions);
        console.log('session', session)
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 3. Validate the request body
        const body = await request.json();
        const validation = studentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors
                },
                { status: 400 }
            );
        }

        const { studentId, branch, semester } = validation.data;

        // 4. Check if student ID already exists
        // const existingStudent = await Student.findOne({ studentId });
        // if (existingStudent) {
        //     return NextResponse.json(
        //         { error: "Student ID already exists" },
        //         { status: 409 }
        //     );
        // }

        // 5. Check if user already has a student profile
        // const existingUserProfile = await User.findOne({ user: session.user.id });
        // if (existingUserProfile) {
        //     return NextResponse.json(
        //         { error: "You already have a student profile" },
        //         { status: 409 }
        //     );
        // }
        // 6. Create the student record
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { studentId, branch, semester: parseInt(semester) },
            { new: true }
        );
        // 7. Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Student profile created successfully",
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('[STUDENT_API_ERROR]', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
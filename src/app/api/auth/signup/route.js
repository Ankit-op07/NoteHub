import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours   

    // Create new user (password hashing is handled in the User model)
    const newUser = await User.create({ name, email, password, verificationToken, verificationTokenExpires });
    // await sendVerificationEmail(email, verificationToken);
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
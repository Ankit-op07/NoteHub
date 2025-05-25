import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  
  const { token } = await req.json();
  
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 400 }
    );
  }

  user.verified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return NextResponse.json(
    { message: 'Email verified successfully! You can now login.' },
    { status: 200 }
  );
}
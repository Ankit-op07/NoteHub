import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();
  
  const { token, password } = await req.json();
  
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Password reset token is invalid or has expired' },
      { status: 400 }
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json(
    { message: 'Password reset successfully! You can now login with your new password.' },
    { status: 200 }
  );
}
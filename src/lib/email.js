import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: "8d99bd70038740", // From your Mailtrap inbox
    pass: "AnkitMailtrap@07"  // From your Mailtrap inbox
  }
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: '"CollegeBro" <noreply@yourapp.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `Click <a href="${verificationUrl}">here</a> to verify your email.`
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `Click <a href="${resetUrl}">here</a> to reset your password.`
  });
};
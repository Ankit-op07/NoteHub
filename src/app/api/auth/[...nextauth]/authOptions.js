import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { toNamespacedPath } from "path";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Connect to MongoDB if not already connected
                if (mongoose.connection.readyState === 0) {
                    await mongoose.connect(process.env.MONGODB_URI);
                }

                // Find user by email
                const user = await User.findOne({ email: credentials.email }).select('+password');;
                if (!user) throw new Error("No user found with this email");

                //     if (!user.verified) {
                //     throw new Error('Please verify your email before logging in');
                // }
                // Verify password
                const isOnboarded = user.studentId ? true : false;
                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (!isValid) throw new Error("Invalid password");

                return { id: user._id, name: user.name, email: user.email, isOnboarded: isOnboarded };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Connect to MongoDB if needed
                if (mongoose.connection.readyState === 0) {
                    await mongoose.connect(process.env.MONGODB_URI);
                }

                // Check if the user already exists
                let existingUser = await User.findOne({ email: user.email });

                // If not, create a new user
                if (!existingUser) {
                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        profilePicUrl: user.image,
                        provide: 'google',
                    });
                }

                token.id = existingUser._id;
                token.isOnboarded = existingUser.onBoard
                token.role = existingUser.role
                token.branch = existingUser.branch || null
                token.semester = existingUser.semester || null
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
                session.user.isOnboarded = token.isOnboarded;
                session.user.role = token.role
                session.user.branch = token.branch
                session.user.semester = token.semester
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
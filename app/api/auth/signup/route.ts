import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, phone, fullName, role, kycId, gender, country } = body;

        if (!email || !password || !phone || !role || !fullName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();

        // Validate role
        const validRoles = ["EMPLOYER", "EMPLOYEE"];
        if (!validRoles.includes(role.toUpperCase())) {
            return NextResponse.json({ error: "Invalid role provided" }, { status: 400 });
        }

        // Check duplicates
        const existingEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        const existingPhone = await prisma.user.findUnique({ where: { phone } });

        if (existingEmail) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }
        if (existingPhone) {
            return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Generate OTP for verification
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Create user
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashed,
                phone,
                fullName,
                gender: gender || null,
                country: country || null,
                kycId: kycId || null,
                role: role.toUpperCase(),
                otp,
                otpExpires,
                isVerified: false,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                otp: true,
            },
        });

        // Log OTP for now
        console.log(`[SIGNUP] OTP for ${user.email}: ${otp} (expires ${otpExpires.toISOString()})`);

        return NextResponse.json({
            success: true,
            message: "Signup successful. Please verify your OTP.",
            email: user.email,
        });
    } catch (err: any) {
        console.error("[SIGNUP_ERROR]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

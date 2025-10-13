// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export async function GET(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
        if (!token) return NextResponse.json({ authenticated: false });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, role: true, fullName: true } });
        if (!user) return NextResponse.json({ authenticated: false });

        return NextResponse.json({ authenticated: true, user });
    } catch (err: any) {
        return NextResponse.json({ authenticated: false });
    }
}

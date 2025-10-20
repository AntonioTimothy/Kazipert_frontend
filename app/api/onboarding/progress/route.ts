// app/api/onboarding/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;
        const documentType = formData.get('documentType') as string;

        if (!file || !userId || !documentType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', userId);
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const filename = `${documentType}_${timestamp}${fileExtension}`;
        const filepath = path.join(uploadsDir, filename);

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        const fileUrl = `/uploads/${userId}/${filename}`;

        // Update database
        const updateData: any = {};
        switch (documentType) {
            case 'profilePicture':
                updateData.profilePicture = fileUrl;
                break;
            case 'idDocumentFront':
                updateData.idDocumentFront = fileUrl;
                break;
            case 'idDocumentBack':
                updateData.idDocumentBack = fileUrl;
                break;
            case 'passport':
                updateData.passportDocument = fileUrl;
                break;
            case 'kra':
                updateData.kraDocument = fileUrl;
                break;
            case 'goodConduct':
                updateData.goodConductUrl = fileUrl;
                break;
            case 'medical':
                updateData.medicalDocument = fileUrl;
                break;
        }

        const kyc = await prisma.kycDetails.upsert({
            where: { userId },
            update: updateData,
            create: {
                userId,
                ...updateData
            }
        });

        return NextResponse.json({
            success: true,
            fileUrl,
            documentType
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
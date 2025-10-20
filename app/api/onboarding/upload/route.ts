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

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', userId);
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const filename = `${documentType}_${timestamp}${fileExtension}`;
        const filepath = path.join(uploadsDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Save file URL to database (relative to public folder)
        const fileUrl = `/uploads/${userId}/${filename}`;

        // Update KYC details with document URL
        const updateData: any = {};
        switch (documentType) {
            case 'idDocument':
                updateData.idDocumentUrl = fileUrl;
                break;
            case 'passport':
                updateData.passportDocumentUrl = fileUrl;
                break;
            case 'kra':
                updateData.kraDocumentUrl = fileUrl;
                break;
            case 'goodConduct':
                updateData.goodConductUrl = fileUrl;
                break;
            case 'education':
                updateData.educationCertUrl = fileUrl;
                break;
            case 'work':
                updateData.workCertUrl = fileUrl;
                break;
            case 'medical':
                updateData.medicalDocumentUrl = fileUrl;
                break;
        }

        // Update or create KYC record
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
            documentType,
            message: 'File uploaded successfully'
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed: ' + error.message
        }, { status: 500 });
    }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
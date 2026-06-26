import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadResumeSubmission } from '../../../backend/resumeService';

export const runtime = 'nodejs';

function getSafeUploadErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'An internal server error occurred while processing your upload.';
  }

  if (
    error.message.includes('Google Drive service account env vars') ||
    error.message.includes('GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL') ||
    error.message.includes('invalid_grant') ||
    error.message.includes('invalid_request') ||
    error.message.includes('File not found') ||
    error.message.includes('insufficient') ||
    error.message.includes('storage quota') ||
    error.message.includes('storageQuotaExceeded')
  ) {
    return error.message;
  }

  return process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred while processing your upload.'
    : error.message;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string | null;
    const resume = formData.get('resume') as File | null;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume file is required.' }, { status: 400 });
    }

    // File validation: extension
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const fileExtension = path.extname(resume.name).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' 
      }, { status: 400 });
    }

    // File validation: size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (resume.size > maxSize) {
      return NextResponse.json({ 
        error: 'File is too large. Maximum allowed size is 10MB.' 
      }, { status: 400 });
    }

    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadedResume = await uploadResumeSubmission({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message ? message.trim() : '',
      originalFileName: resume.name,
      mimeType: resume.type,
      fileBuffer: buffer,
    });

    return NextResponse.json({
      success: true,
      message: 'Submission successfully uploaded to Google Drive!',
      data: {
        id: uploadedResume.submissionId,
        name: name.trim(),
        email: email.trim(),
        fileName: resume.name,
        savedFileName: uploadedResume.savedFileName,
        driveFileId: uploadedResume.driveFileId,
        driveFolderName: uploadedResume.driveFolderName,
      }
    });

  } catch (error: any) {
    console.error('Error handling resume upload API request:', error);

    return NextResponse.json({ 
      error: getSafeUploadErrorMessage(error),
    }, { status: 500 });
  }
}

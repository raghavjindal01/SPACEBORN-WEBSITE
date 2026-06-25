import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

    // Setup uploads directory path in workspace root
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate safe unique filename
    const timestamp = Date.now();
    const cleanOriginalName = resume.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const savedFileName = `${timestamp}_${cleanOriginalName}`;
    const filePath = path.join(uploadsDir, savedFileName);

    // Save the file
    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Append entry to local submissions.json (mock database)
    const submissionsPath = path.join(uploadsDir, 'submissions.json');
    let submissions = [];
    
    try {
      const existingData = await fs.readFile(submissionsPath, 'utf8');
      submissions = JSON.parse(existingData);
      if (!Array.isArray(submissions)) {
        submissions = [];
      }
    } catch (error) {
      // submissions.json doesn't exist yet, proceed with empty array
    }

    const submissionId = `sub_${timestamp}`;
    const newSubmission = {
      id: submissionId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message ? message.trim() : '',
      resumeFileName: resume.name,
      savedFileName: savedFileName,
      timestamp: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    await fs.writeFile(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Submission successfully received!',
      data: {
        id: submissionId,
        name: newSubmission.name,
        email: newSubmission.email,
        fileName: newSubmission.resumeFileName,
      }
    });

  } catch (error: any) {
    console.error('Error handling resume upload API request:', error);
    return NextResponse.json({ 
      error: 'An internal server error occurred while processing your upload.' 
    }, { status: 500 });
  }
}

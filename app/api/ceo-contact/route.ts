import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const message = formData.get('message') as string | null;

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

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Setup uploads directory path in workspace root
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Append entry to local ceo_messages.json
    const messagesPath = path.join(uploadsDir, 'ceo_messages.json');
    let messages = [];

    try {
      const existingData = await fs.readFile(messagesPath, 'utf8');
      messages = JSON.parse(existingData);
      if (!Array.isArray(messages)) {
        messages = [];
      }
    } catch (error) {
      // ceo_messages.json doesn't exist yet, proceed with empty array
    }

    const messageId = `msg_${Date.now()}`;
    const newMessage = {
      id: messageId,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to the CEO.',
      data: {
        id: messageId,
        name: newMessage.name,
      }
    });

  } catch (error: any) {
    console.error('Error handling CEO contact request:', error);
    return NextResponse.json({
      error: 'An internal server error occurred while processing your message.'
    }, { status: 500 });
  }
}

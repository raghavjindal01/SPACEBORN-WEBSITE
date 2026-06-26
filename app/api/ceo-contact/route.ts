import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type CeoMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT || '587');
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('SMTP_PORT must be a valid port number.');
  }
  return port;
}

function getMailTransporter() {
  const host = getRequiredEnv('SMTP_HOST');
  const port = getSmtpPort();
  const user = getRequiredEnv('SMTP_USER');
  const pass = getRequiredEnv('SMTP_PASS');
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function saveLocalCopy(message: CeoMessage) {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const messagesPath = path.join(uploadsDir, 'ceo_messages.json');
  let messages: CeoMessage[] = [];

  try {
    const existingData = await fs.readFile(messagesPath, 'utf8');
    const parsed = JSON.parse(existingData);
    if (Array.isArray(parsed)) {
      messages = parsed;
    }
  } catch (error) {
    // The archive file is created on the first successful CEO contact message.
  }

  messages.push(message);
  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), 'utf8');
}

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

    const messageId = `msg_${Date.now()}`;
    const newMessage = {
      id: messageId,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const ceoEmail = getRequiredEnv('CEO_EMAIL');
    const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || getRequiredEnv('SMTP_USER');
    const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Spaceborn Website';
    const transporter = getMailTransporter();
    const escapedName = escapeHtml(newMessage.name);
    const escapedEmail = escapeHtml(newMessage.email);
    const escapedMessage = escapeHtml(newMessage.message).replace(/\n/g, '<br />');

    await transporter.sendMail({
      from: `"${fromName.replace(/"/g, '\\"')}" <${fromEmail}>`,
      to: ceoEmail,
      replyTo: newMessage.email,
      subject: `New CEO contact message from ${newMessage.name}`,
      text: [
        'New CEO contact message',
        '',
        `Name: ${newMessage.name}`,
        `Email: ${newMessage.email}`,
        `Submitted: ${newMessage.timestamp}`,
        '',
        newMessage.message,
      ].join('\n'),
      html: `
        <h2>New CEO contact message</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Submitted:</strong> ${newMessage.timestamp}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      `,
    });

    await saveLocalCopy(newMessage);

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
      error: process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred while sending your message.'
        : error.message || 'An internal server error occurred while sending your message.'
    }, { status: 500 });
  }
}

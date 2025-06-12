import { NextResponse } from 'next/server';
import { sendNotification } from '@/lib/notification-service';

export async function POST(request: Request) {
  try {
    const { userId, message, type, link } = await request.json();
    if (!userId || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendNotification({ userId, message, type, link });
    return NextResponse.json({ message: 'Notification request processed', result }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
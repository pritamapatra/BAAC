import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizSubmissions } from '@/drizzle/schema';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { quizId, score } = await request.json();

    if (typeof quizId !== 'number' || typeof score !== 'number') {
      return NextResponse.json({ message: 'Invalid quizId or score.' }, { status: 400 });
    }

    await db.insert(quizSubmissions).values({
      userId: userId,
      quizId: quizId,
      score: score,
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Quiz submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit quiz.' }, { status: 500 });
  }
}
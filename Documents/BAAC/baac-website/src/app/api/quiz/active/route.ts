import { NextResponse } from 'next/server';
import { getCurrentActiveQuiz } from '@/lib/quiz-service';

export async function GET() {
  try {
    const activeQuiz = await getCurrentActiveQuiz();
    if (activeQuiz) {
      return NextResponse.json(activeQuiz, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No active quiz found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching active quiz:', error);
    return NextResponse.json({ message: 'Failed to fetch active quiz.' }, { status: 500 });
  }
}
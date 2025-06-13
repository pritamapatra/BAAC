import { NextResponse } from 'next/server';
import { resetWeeklyQuiz } from '@/lib/quiz-service';

export async function POST() {
  try {
    const result = await resetWeeklyQuiz();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error resetting weekly quiz:', error);
    return NextResponse.json({ success: false, message: 'Failed to reset weekly quiz.' }, { status: 500 });
  }
}
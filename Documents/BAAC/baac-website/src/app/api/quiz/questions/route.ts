import { NextResponse } from 'next/server';
import { getQuestionsByQuizId, getCurrentActiveQuiz } from '@/lib/quiz-service';

export async function GET() {
  try {
    const activeQuiz = await getCurrentActiveQuiz();
    if (!activeQuiz) {
      return NextResponse.json({ message: 'No active quiz found.' }, { status: 404 });
    }
    const questions = await getQuestionsByQuizId(activeQuiz.id);
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ message: 'Failed to fetch quiz questions.' }, { status: 500 });
  }
}
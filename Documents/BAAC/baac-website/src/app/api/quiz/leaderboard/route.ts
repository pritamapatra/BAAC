import { NextResponse } from 'next/server';
import { getQuizLeaderboard, getCurrentActiveQuiz } from '@/lib/quiz-service';

export async function GET() {
  try {
    const activeQuiz = await getCurrentActiveQuiz();
    if (!activeQuiz) {
      return NextResponse.json({ message: 'No active quiz found.' }, { status: 404 });
    }
    const leaderboard = await getQuizLeaderboard(activeQuiz.id);
    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    return NextResponse.json({ message: 'Failed to fetch quiz leaderboard.' }, { status: 500 });
  }
}
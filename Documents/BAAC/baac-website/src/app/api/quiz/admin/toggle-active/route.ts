import { NextResponse } from 'next/server';
import { updateQuiz } from '@/lib/quiz-service';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/user-service';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || !user.isAdmin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { quizId, isActive } = await request.json();

    if (typeof quizId !== 'number' || typeof isActive !== 'boolean') {
      return NextResponse.json({ message: 'Invalid quizId or isActive.' }, { status: 400 });
    }

    const updatedQuiz = await updateQuiz(quizId, { isActive });

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error('Error toggling quiz active status:', error);
    return NextResponse.json({ message: 'Failed to toggle quiz active status.' }, { status: 500 });
  }
}
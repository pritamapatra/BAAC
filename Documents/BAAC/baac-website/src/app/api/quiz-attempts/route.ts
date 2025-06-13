import { db } from '@/drizzle/db';
import { quizAttempts, users } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.select({
      id: quizAttempts.id,
      userId: quizAttempts.userId,
      score: quizAttempts.score,
      attemptedAt: quizAttempts.attemptedAt,
      username: users.username,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(quizAttempts.userId, users.id))
    .orderBy(desc(quizAttempts.score))
    .limit(100);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
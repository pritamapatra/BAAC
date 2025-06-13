import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.select({
      id: users.id,
      clerkId: users.clerkId,
      username: users.username,
      email: users.email,
      isAdmin: users.isAdmin,
      sewaPoints: users.sewaPoints,
    })
    .from(users)
    .orderBy(desc(users.sewaPoints))
    .limit(100);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sewa points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getUserByClerkId } from '@/lib/user-service';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { clerkId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { clerkId } = params;
    const user = await getUserByClerkId(clerkId);

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Only allow fetching own user data or if the requester is an admin
    const requester = await getUserByClerkId(userId);
    if (requester?.isAdmin || userId === clerkId) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Failed to fetch user data.' }, { status: 500 });
  }
}
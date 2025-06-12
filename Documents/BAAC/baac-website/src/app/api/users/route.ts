import { NextResponse } from 'next/server';
import { createUser, getUserByClerkId, setAdminStatus } from '@/lib/user-service';

export async function POST(request: Request) {
  try {
    const { clerkId, username, email } = await request.json();
    if (!clerkId || !username || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await getUserByClerkId(clerkId);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', user: existingUser }, { status: 200 });
    }

    const newUser = await createUser(clerkId, username, email);
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { clerkId, isAdmin } = await request.json();
    if (!clerkId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await setAdminStatus(clerkId, isAdmin);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User admin status updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user admin status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
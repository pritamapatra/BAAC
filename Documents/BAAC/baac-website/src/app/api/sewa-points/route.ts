import { NextResponse } from 'next/server';
import { addSewaPoints, getSewaPointsByUserId, getTotalSewaPointsByUserId, getLeaderboard } from '@/lib/sewa-points-service';

export async function POST(request: Request) {
  try {
    const { userId, points, activity } = await request.json();
    if (!userId || !points || !activity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newSewaPoints = await addSewaPoints(userId, points, activity);
    return NextResponse.json({ message: 'Sewa points added successfully', sewaPoints: newSewaPoints }, { status: 201 });
  } catch (error) {
    console.error('Error adding sewa points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (type === 'leaderboard') {
      const leaderboard = await getLeaderboard();
      return NextResponse.json({ leaderboard }, { status: 200 });
    } else if (userId) {
      if (type === 'total') {
        const totalPoints = await getTotalSewaPointsByUserId(userId);
        return NextResponse.json({ totalPoints }, { status: 200 });
      } else {
        const sewaPoints = await getSewaPointsByUserId(userId);
        return NextResponse.json({ sewaPoints }, { status: 200 });
      }
    }

    return NextResponse.json({ error: 'Missing userId or invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching sewa points/leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
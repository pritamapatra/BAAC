import { db } from './db';
import { sewaPoints } from '../drizzle/schema';
import { eq, sum } from 'drizzle-orm';

export async function addSewaPoints(userId: string, points: number, activity: string) {
  const [newSewaPoints] = await db.insert(sewaPoints).values({
    userId,
    points,
    activity,
  }).returning();
  return newSewaPoints;
}

export async function getSewaPointsByUserId(userId: string) {
  return db.select().from(sewaPoints).where(eq(sewaPoints.userId, userId));
}

export async function getTotalSewaPointsByUserId(userId: string) {
  const result = await db.select({
    totalPoints: sum(sewaPoints.points),
  }).from(sewaPoints).where(eq(sewaPoints.userId, userId));

  return result[0]?.totalPoints || 0;
}

export async function getLeaderboard() {
  return db.select({
    userId: sewaPoints.userId,
    totalPoints: sum(sewaPoints.points),
  }).from(sewaPoints).groupBy(sewaPoints.userId).orderBy(sum(sewaPoints.points).desc());
}
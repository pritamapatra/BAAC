import { db } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function createUser(clerkId: string, username: string, email: string) {
  const [newUser] = await db.insert(users).values({
    clerkId,
    username,
    email,
  }).returning();
  return newUser;
}

export async function getUserByClerkId(clerkId: string) {
  const user = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user.length > 0 ? user[0] : null;
}

export async function setAdminStatus(clerkId: string, isAdmin: boolean) {
  const [updatedUser] = await db.update(users).set({
    isAdmin: isAdmin,
    updatedAt: new Date(),
  }).where(eq(users.clerkId, clerkId)).returning();
  return updatedUser;
}
import { db } from './db';
import { eventImages } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function addEventImage(eventId: number, imageUrl: string) {
  const [newEventImage] = await db.insert(eventImages).values({
    eventId,
    imageUrl,
  }).returning();
  return newEventImage;
}

export async function getEventImagesByEventId(eventId: number) {
  return db.select().from(eventImages).where(eq(eventImages.eventId, eventId));
}

export async function deleteEventImage(id: number) {
  const [deletedImage] = await db.delete(eventImages).where(eq(eventImages.id, id)).returning();
  return deletedImage;
}
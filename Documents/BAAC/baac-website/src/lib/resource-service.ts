import { db } from './db';
import { resources } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function createResource(title: string, description: string, fileUrl: string) {
  const [newResource] = await db.insert(resources).values({
    title,
    description,
    fileUrl,
  }).returning();
  return newResource;
}

export async function getResourceById(id: number) {
  const resource = await db.select().from(resources).where(eq(resources.id, id));
  return resource.length > 0 ? resource[0] : null;
}

export async function getAllResources() {
  return db.select().from(resources);
}

export async function updateResource(id: number, data: { title?: string, description?: string, fileUrl?: string }) {
  const [updatedResource] = await db.update(resources).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(resources.id, id)).returning();
  return updatedResource;
}

export async function deleteResource(id: number) {
  const [deletedResource] = await db.delete(resources).where(eq(resources.id, id)).returning();
  return deletedResource;
}
import { db } from './db';
import { events, eventRegistrations, attendances } from '../drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function createEvent(title: string, description: string, startTime: Date, endTime: Date, attendanceStartTime?: Date, attendanceEndTime?: Date, qrCode?: string) {
  const [newEvent] = await db.insert(events).values({
    title,
    description,
    startTime,
    endTime,
    attendanceStartTime,
    attendanceEndTime,
    qrCode,
  }).returning();
  return newEvent;
}

export async function getEventById(id: number) {
  const event = await db.select().from(events).where(eq(events.id, id));
  return event.length > 0 ? event[0] : null;
}

export async function getAllEvents() {
  return db.select().from(events);
}

export async function updateEvent(id: number, data: { title?: string, description?: string, startTime?: Date, endTime?: Date, attendanceStartTime?: Date, attendanceEndTime?: Date, qrCode?: string }) {
  const [updatedEvent] = await db.update(events).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(events.id, id)).returning();
  return updatedEvent;
}

export async function deleteEvent(id: number) {
  const [deletedEvent] = await db.delete(events).where(eq(events.id, id)).returning();
  return deletedEvent;
}

export async function registerForEvent(userId: string, eventId: number, isVolunteer: boolean) {
  const [newRegistration] = await db.insert(eventRegistrations).values({
    userId,
    eventId,
    isVolunteer,
  }).returning();
  return newRegistration;
}

export async function getEventRegistrations(eventId: number) {
  return db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
}

export async function markAttendance(userId: string, eventId: number) {
  const [newAttendance] = await db.insert(attendances).values({
    userId,
    eventId,
  }).returning();
  return newAttendance;
}

export async function getEventAttendances(eventId: number) {
  return db.select().from(attendances).where(eq(attendances.eventId, eventId));
}

export async function getAttendanceStatus(userId: string, eventId: number) {
  const attendance = await db.select().from(attendances).where(and(eq(attendances.userId, userId), eq(attendances.eventId, eventId)));
  return attendance.length > 0;
}
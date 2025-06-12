import { NextResponse } from 'next/server';
import { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent, registerForEvent, markAttendance } from '@/lib/event-service';

export async function POST(request: Request) {
  try {
    const { title, description, startTime, endTime, attendanceStartTime, attendanceEndTime, qrCode } = await request.json();
    if (!title || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newEvent = await createEvent(title, description, new Date(startTime), new Date(endTime), attendanceStartTime ? new Date(attendanceStartTime) : undefined, attendanceEndTime ? new Date(attendanceEndTime) : undefined, qrCode);
    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const event = await getEventById(parseInt(id as string));
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({ event }, { status: 200 });
    }

    const events = await getAllEvents();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, data } = await request.json();
    if (!id || !data) {
      return NextResponse.json({ error: 'Missing ID or data' }, { status: 400 });
    }
    const updatedEvent = await updateEvent(parseInt(id as string), data);
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event updated successfully', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }
    const deletedEvent = await deleteEvent(parseInt(id as string));
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { eventId, userId, isVolunteer, type } = await request.json();
    if (!eventId || !userId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'register') {
      const registration = await registerForEvent(userId, parseInt(eventId as string), isVolunteer || false);
      return NextResponse.json({ message: 'Registered for event successfully', registration }, { status: 201 });
    } else if (type === 'attendance') {
      const attendance = await markAttendance(userId, parseInt(eventId as string));
      return NextResponse.json({ message: 'Attendance marked successfully', attendance }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
  } catch (error) {
    console.error('Error performing event operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
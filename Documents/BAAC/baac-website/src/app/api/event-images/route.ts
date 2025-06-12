import { NextResponse } from 'next/server';
import { addEventImage, getEventImagesByEventId, deleteEventImage } from '@/lib/event-image-service';

export async function POST(request: Request) {
  try {
    const { eventId, imageUrl } = await request.json();
    if (!eventId || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newEventImage = await addEventImage(parseInt(eventId as string), imageUrl);
    return NextResponse.json({ message: 'Event image added successfully', eventImage: newEventImage }, { status: 201 });
  } catch (error) {
    console.error('Error adding event image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }

    const eventImages = await getEventImagesByEventId(parseInt(eventId as string));
    return NextResponse.json({ eventImages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
    }
    const deletedImage = await deleteEventImage(parseInt(id as string));
    if (!deletedImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
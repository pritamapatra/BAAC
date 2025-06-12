import { NextResponse } from 'next/server';
import { createResource, getResourceById, getAllResources, updateResource, deleteResource } from '@/lib/resource-service';

export async function POST(request: Request) {
  try {
    const { title, description, fileUrl } = await request.json();
    if (!title || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newResource = await createResource(title, description, fileUrl);
    return NextResponse.json({ message: 'Resource created successfully', resource: newResource }, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const resource = await getResourceById(parseInt(id as string));
      if (!resource) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
      }
      return NextResponse.json({ resource }, { status: 200 });
    }

    const resources = await getAllResources();
    return NextResponse.json({ resources }, { status: 200 });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, data } = await request.json();
    if (!id || !data) {
      return NextResponse.json({ error: 'Missing ID or data' }, { status: 400 });
    }
    const updatedResource = await updateResource(parseInt(id as string), data);
    if (!updatedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Resource updated successfully', resource: updatedResource }, { status: 200 });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing resource ID' }, { status: 400 });
    }
    const deletedResource = await deleteResource(parseInt(id as string));
    if (!deletedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
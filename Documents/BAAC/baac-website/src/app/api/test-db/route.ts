import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Attempt to fetch the current time from the database
    const result = await sql`SELECT NOW();`;
    console.log('Database connection successful:', result);
    return new Response(JSON.stringify({ message: 'Database connection successful!', timestamp: result[0].now }), { status: 200 });
  } catch (error) {
    console.error('Database connection failed:', error);
    return new Response(JSON.stringify({ message: 'Database connection failed', error: error.message }), { status: 500 });
  }
}
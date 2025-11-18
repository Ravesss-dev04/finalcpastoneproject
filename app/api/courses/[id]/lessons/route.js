import { db } from '@/config/db';
import { lessonsTable } from '@/config/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.course_id, id))
      .orderBy(asc(lessonsTable.order_index));

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params; // Add await here
    const { title, content, video_url, order_index } = await request.json();

    const newLesson = await db
      .insert(lessonsTable)
      .values({
        course_id: id,
        title,
        content,
        video_url,
        order_index: order_index || 0
      })
      .returning();

    return NextResponse.json(newLesson[0], { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
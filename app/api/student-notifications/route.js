import { db } from '@/config/db';
import { studentNotificationsTable, enrollmentsTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET student's notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const notifications = await db
      .select()
      .from(studentNotificationsTable)
      .where(eq(studentNotificationsTable.student_id, studentId))
      .orderBy(studentNotificationsTable.created_at)
      .limit(50); // Limit to recent 50 notifications

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching student notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new notification (for teachers)
export async function POST(request) {
  try {
    const { course_id, course_title, teacher_name, lesson_title, type = 'new_lesson' } = await request.json();

    // Get all enrolled students for this course
    const enrolledStudents = await db
      .select({
        student_id: enrollmentsTable.student_id,
        student_name: enrollmentsTable.student_name
      })
      .from(enrollmentsTable)
      .where(eq(enrollmentsTable.course_id, course_id));

    console.log(`📢 Notifying ${enrolledStudents.length} students about new lesson`);

    // Create notifications for each student
    const notificationPromises = enrolledStudents.map(student =>
      db.insert(studentNotificationsTable).values({
        student_id: student.student_id,
        course_id: course_id,
        teacher_name: teacher_name,
        message: `added a new lesson "${lesson_title}" in ${course_title}`,
        type: type,
        is_read: false
      }).returning()
    );

    await Promise.all(notificationPromises);

    return NextResponse.json({ 
      message: `Notifications sent to ${enrolledStudents.length} students` 
    });

  } catch (error) {
    console.error('Error creating student notifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH mark notification as read
export async function PATCH(request) {
  try {
    const { notificationId, studentId } = await request.json();
    
    if (!notificationId || !studentId) {
      return NextResponse.json({ error: 'Notification ID and Student ID required' }, { status: 400 });
    }

    const updatedNotification = await db
      .update(studentNotificationsTable)
      .set({ is_read: true })
      .where(eq(studentNotificationsTable.id, notificationId))
      .where(eq(studentNotificationsTable.student_id, studentId))
      .returning();

    if (updatedNotification.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(updatedNotification[0]);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
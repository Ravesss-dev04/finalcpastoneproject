import { db } from '@/config/db';
import { studentProgressTable, enrollmentsTable, lessonsTable } from '@/config/schema'; // ADD lessonsTable here
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { course_id, lesson_id, quiz_id, assignment_id, completed, score } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if progress record already exists
    const existingProgress = await db
      .select()
      .from(studentProgressTable)
      .where(
        and(
          eq(studentProgressTable.student_id, userId),
          eq(studentProgressTable.course_id, course_id),
          lesson_id ? eq(studentProgressTable.lesson_id, lesson_id) : undefined,
          quiz_id ? eq(studentProgressTable.quiz_id, quiz_id) : undefined,
          assignment_id ? eq(studentProgressTable.assignment_id, assignment_id) : undefined
        )
      )
      .then(rows => rows[0]);

    let result;

    if (existingProgress) {
      // Update existing progress
      result = await db
        .update(studentProgressTable)
        .set({
          completed: completed !== undefined ? completed : existingProgress.completed,
          score: score !== undefined ? score : existingProgress.score,
          submitted_at: new Date()
        })
        .where(eq(studentProgressTable.id, existingProgress.id))
        .returning();
    } else {
      // Create new progress record
      result = await db
        .insert(studentProgressTable)
        .values({
          student_id: userId,
          course_id,
          lesson_id,
          quiz_id,
          assignment_id,
          completed: completed || false,
          score,
          submitted_at: new Date()
        })
        .returning();
    }

    // Update enrollment progress ONLY if it's a new completion
    if (lesson_id && completed && !existingProgress?.completed) {
      await updateEnrollmentProgress(userId, course_id);
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function updateEnrollmentProgress(studentId, courseId) {
  try {
    // Calculate overall progress
    const progressRecords = await db
      .select()
      .from(studentProgressTable)
      .where(
        and(
          eq(studentProgressTable.student_id, studentId),
          eq(studentProgressTable.course_id, courseId),
          eq(studentProgressTable.completed, true)
        )
      );

    const totalItems = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.course_id, courseId))
      .then(rows => rows.length);

    const completedItems = progressRecords.filter(record => record.lesson_id && record.completed).length;

    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Update enrollment progress
    await db
      .update(enrollmentsTable)
      .set({
        progress,
        last_accessed: new Date()
      })
      .where(
        and(
          eq(enrollmentsTable.student_id, studentId),
          eq(enrollmentsTable.course_id, courseId)
        )
      );

    console.log(`📊 Updated progress for student ${studentId}: ${progress}%`);

  } catch (error) {
    console.error('Error updating enrollment progress:', error);
  }
}
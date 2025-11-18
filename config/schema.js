
import { boolean, integer, json, pgTable, varchar, text,timestamp,jsonb,serial} from "drizzle-orm/pg-core";



export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  clerk_id: varchar("clerk_id", {length: 255}).notNull(),
  role: text("role").notNull().default("student"),

})



export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default('admin'),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  assigned_teacher_id: varchar("assigned_teacher_id", { length: 255 }), // Optional
  image_url: varchar("image_url", { length: 500 }).default("/default-course.png"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});



export const courseNotificationsTable = pgTable("course_notifications", {
  id: serial("id").primaryKey(),
  teacher_email: varchar("teacher_email", { length: 255 }).notNull(),
  course_id: integer("course_id").references(() => coursesTable.id),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("course_invitation"),
  status: varchar("status", { length: 50 }).default("unread"),
  created_at: timestamp("created_at").defaultNow(),
});


export const courseRequestsTable = pgTable("course_requests", {
  id: serial("id").primaryKey(),
  course_id: integer("course_id").references(() => coursesTable.id),
  teacher_name: varchar("teacher_name", { length: 255 }).notNull(),
  teacher_email: varchar("teacher_email", { length: 255 }).notNull(),
  course_title: varchar("course_title", { length: 255 }).notNull(),
  course_category: varchar("course_category", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});



export const teachersTable = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  course_title: varchar("course_title", { length: 255 }),
  total_courses: integer("total_courses").default(0),
  status: varchar("status", { length: 50 }).default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});



export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  student_id: varchar("student_id", { length: 255 }).notNull(),
  student_name: varchar("student_name", { length: 255 }).notNull(),
  student_email: varchar("student_email", { length: 255 }).notNull(),
  course_id: integer("course_id").references(() => coursesTable.id),
  course_title: varchar("course_title", { length: 255 }).notNull(),
  teacher_name: varchar("teacher_name", { length: 255 }),
  teacher_email: varchar("teacher_email", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  progress: integer("progress").default(0),
  last_accessed: timestamp("last_accessed"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Add these to your existing schema

export const lessonsTable = pgTable('lessons', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  video_url: varchar('video_url', { length: 500 }),
  order_index: integer('order_index').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const quizzesTable = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  questions: jsonb('questions'), // Store quiz questions as JSON
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const assignmentsTable = pgTable('assignments', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  deadline: timestamp('deadline'),
  max_score: integer('max_score').default(100),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const announcementsTable = pgTable('announcements', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').notNull().references(() => coursesTable.id),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Student progress tracking
export const studentProgressTable = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  student_id: varchar('student_id', { length: 255 }).notNull(),
  course_id: integer('course_id').notNull(),
  lesson_id: integer('lesson_id'),
  quiz_id: integer('quiz_id'),
  assignment_id: integer('assignment_id'),
  completed: boolean('completed').default(false),
  score: integer('score'),
  submitted_at: timestamp('submitted_at'),
  created_at: timestamp('created_at').defaultNow(),
});
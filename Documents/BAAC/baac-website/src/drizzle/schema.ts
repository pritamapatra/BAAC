import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 256 }).unique().notNull(),
  username: varchar('username', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  allowNotifications: boolean('allow_notifications').default(false).notNull(),
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}));

export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.clerkId).notNull(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  isVolunteer: boolean('is_volunteer').default(false).notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
});

export const attendances = pgTable('attendances', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.clerkId).notNull(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  attendedAt: timestamp('attended_at').defaultNow().notNull(),
});

export const sewaPoints = pgTable('sewa_points', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.clerkId).notNull(),
  points: integer('points').notNull(),
  activity: varchar('activity', { length: 256 }).notNull(),
  awardedAt: timestamp('awarded_at').defaultNow().notNull(),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const qnaQuestions = pgTable('qna_questions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.clerkId).notNull(),
  questionText: text('question_text').notNull(),
  askedAt: timestamp('asked_at').defaultNow().notNull(),
});

export const qnaAnswers = pgTable('qna_answers', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => qnaQuestions.id).notNull(),
  adminId: varchar('admin_id', { length: 256 }).references(() => users.clerkId).notNull(), // Assuming admin is also a user
  answerText: text('answer_text').notNull(),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  attendanceStartTime: timestamp('attendance_start_time'),
  attendanceEndTime: timestamp('attendance_end_time'),
  qrCode: text('qr_code'), // Optional QR code auto-generated
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventImages = pgTable('event_images', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  imageUrl: text('image_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  questionText: text('question_text').notNull(),
  options: text('options').notNull(), // Store as JSON string or array of strings
  correctAnswer: varchar('correct_answer', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const quizSubmissions = pgTable('quiz_submissions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).references(() => users.clerkId).notNull(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  score: integer('score').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

import { relations } from 'drizzle-orm';

export const userRelations = relations(users, ({ many }) => ({
  quizSubmissions: many(quizSubmissions),
  eventRegistrations: many(eventRegistrations),
  attendances: many(attendances),
  sewaPoints: many(sewaPoints),
  qnaQuestions: many(qnaQuestions),
}));

export const quizRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  quizSubmissions: many(quizSubmissions),
}));

export const questionRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizSubmissionRelations = relations(quizSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [quizSubmissions.userId],
    references: [users.clerkId],
  }),
  quiz: one(quizzes, {
    fields: [quizSubmissions.quizId],
    references: [quizzes.id],
  }),
}));

export const eventRelations = relations(events, ({ many }) => ({
  eventRegistrations: many(eventRegistrations),
  attendances: many(attendances),
  eventImages: many(eventImages),
}));

export const eventRegistrationRelations = relations(eventRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.clerkId],
  }),
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
}));

export const attendanceRelations = relations(attendances, ({ one }) => ({
  user: one(users, {
    fields: [attendances.userId],
    references: [users.clerkId],
  }),
  event: one(events, {
    fields: [attendances.eventId],
    references: [events.id],
  }),
}));

export const sewaPointRelations = relations(sewaPoints, ({ one }) => ({
  user: one(users, {
    fields: [sewaPoints.userId],
    references: [users.clerkId],
  }),
}));

export const eventImageRelations = relations(eventImages, ({ one }) => ({
  event: one(events, {
    fields: [eventImages.eventId],
    references: [events.id],
  }),
}));

export const qnaQuestionRelations = relations(qnaQuestions, ({ many, one }) => ({
  user: one(users, {
    fields: [qnaQuestions.userId],
    references: [users.clerkId],
  }),
  answers: many(qnaAnswers),
}));

export const qnaAnswerRelations = relations(qnaAnswers, ({ one }) => ({
  question: one(qnaQuestions, {
    fields: [qnaAnswers.questionId],
    references: [qnaQuestions.id],
  }),
  admin: one(users, {
    fields: [qnaAnswers.adminId],
    references: [users.clerkId],
  }),
});
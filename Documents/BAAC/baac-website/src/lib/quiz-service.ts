import { db } from './db';
import { quizzes, questions } from '../drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function createQuiz(title: string, description: string, startDate: Date, endDate: Date) {
  const [newQuiz] = await db.insert(quizzes).values({
    title,
    description,
    startDate,
    endDate,
  }).returning();
  return newQuiz;
}

export async function getQuizById(id: number) {
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, id));
  return quiz.length > 0 ? quiz[0] : null;
}

export async function updateQuiz(id: number, data: { title?: string, description?: string, startDate?: Date, endDate?: Date, isActive?: boolean }) {
  const [updatedQuiz] = await db.update(quizzes).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(quizzes.id, id)).returning();
  return updatedQuiz;
}

export async function addQuestionToQuiz(quizId: number, questionText: string, options: string[], correctAnswer: string) {
  const [newQuestion] = await db.insert(questions).values({
    quizId,
    questionText,
    options: JSON.stringify(options), // Store options as JSON string
    correctAnswer,
  }).returning();
  return newQuestion;
}

export async function getQuestionsByQuizId(quizId: number) {
  return db.select().from(questions).where(eq(questions.quizId, quizId));
}

export async function updateQuestion(id: number, data: { questionText?: string, options?: string[], correctAnswer?: string }) {
  const [updatedQuestion] = await db.update(questions).set({
    ...data,
    options: data.options ? JSON.stringify(data.options) : undefined,
    updatedAt: new Date(),
  }).where(eq(questions.id, id)).returning();
  return updatedQuestion;
}

export async function deleteQuestion(id: number) {
  const [deletedQuestion] = await db.delete(questions).where(eq(questions.id, id)).returning();
  return deletedQuestion;
}

export async function getCurrentActiveQuiz() {
  const now = new Date();
  const quiz = await db.select().from(quizzes).where(and(eq(quizzes.isActive, true), gte(quizzes.startDate, now), lte(quizzes.endDate, now)));
  return quiz.length > 0 ? quiz[0] : null;
}
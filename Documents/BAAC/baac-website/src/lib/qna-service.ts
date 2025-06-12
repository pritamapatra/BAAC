import { db } from './db';
import { qnaQuestions, qnaAnswers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function createQuestion(userId: string, questionText: string) {
  const [newQuestion] = await db.insert(qnaQuestions).values({
    userId,
    questionText,
  }).returning();
  return newQuestion;
}

export async function getQuestionById(id: number) {
  const question = await db.select().from(qnaQuestions).where(eq(qnaQuestions.id, id));
  return question.length > 0 ? question[0] : null;
}

export async function getAllQuestions() {
  return db.select().from(qnaQuestions);
}

export async function answerQuestion(questionId: number, adminId: string, answerText: string) {
  const [newAnswer] = await db.insert(qnaAnswers).values({
    questionId,
    adminId,
    answerText,
  }).returning();
  return newAnswer;
}

export async function getAnswersByQuestionId(questionId: number) {
  return db.select().from(qnaAnswers).where(eq(qnaAnswers.questionId, questionId));
}
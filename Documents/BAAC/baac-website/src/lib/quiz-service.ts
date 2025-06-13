import { db } from './db';
import { quizzes, questions, quizSubmissions, users } from '../drizzle/schema';
import { eq, and, gte, lte, desc, asc } from 'drizzle-orm';

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
  const quiz = await db.select().from(quizzes).where(and(eq(quizzes.isActive, true), lte(quizzes.startDate, now), gte(quizzes.endDate, now)));
  return quiz.length > 0 ? quiz[0] : null;
}

export async function getQuizLeaderboard(quizId: number) {
  const leaderboard = await db.select({
    userId: quizSubmissions.userId,
    score: quizSubmissions.score,
    submittedAt: quizSubmissions.submittedAt,
    username: users.username, // Assuming users table is joined for username
  })
  .from(quizSubmissions)
  .leftJoin(users, eq(quizSubmissions.userId, users.clerkId))
  .where(eq(quizSubmissions.quizId, quizId))
  .orderBy(desc(quizSubmissions.score), asc(quizSubmissions.submittedAt));

  // Group by userId to get the highest score for each user
  const userScores: { [key: string]: { score: number, submittedAt: Date, username: string } } = {};
  leaderboard.forEach(submission => {
    if (!userScores[submission.userId] || submission.score > userScores[submission.userId].score) {
      userScores[submission.userId] = { score: submission.score, submittedAt: submission.submittedAt, username: submission.username };
    } else if (submission.score === userScores[submission.userId].score && submission.submittedAt < userScores[submission.userId].submittedAt) {
      // If scores are equal, keep the earlier submission
      userScores[submission.userId] = { score: submission.score, submittedAt: submission.submittedAt, username: submission.username };
    }
  });

  // Convert back to array and sort for final leaderboard
  const finalLeaderboard = Object.keys(userScores).map(userId => ({
    userId,
    score: userScores[userId].score,
    submittedAt: userScores[userId].submittedAt,
    username: userScores[userId].username,
  }));

  finalLeaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    } else {
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    }
  });

  return finalLeaderboard;
}

export async function resetWeeklyQuiz() {
  // Deactivate current active quiz
  const currentActiveQuiz = await getCurrentActiveQuiz();
  if (currentActiveQuiz) {
    await updateQuiz(currentActiveQuiz.id, { isActive: false });
  }

  // Logic to create a new quiz or activate the next one
  // For now, let's assume a new quiz needs to be created manually or via admin panel
  // In a real-world scenario, this might involve fetching predefined quizzes or generating new ones
  console.log('Weekly quiz reset initiated. Previous quiz deactivated.');
  return { success: true, message: 'Weekly quiz reset initiated.' };
}
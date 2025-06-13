import { db } from '@/drizzle/db';
import { eq, desc } from 'drizzle-orm';
import { users, quizAttempts } from '@/drizzle/schema';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuizAttempt {
  id: number;
  userId: number;
  score: number;
  attemptedAt: string;
  user: { username: string };
}

export default function QuizLeaderboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.isAdmin);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (isAdmin) {
        try {
          const result = await db.select({
            id: quizAttempts.id,
            userId: quizAttempts.userId,
            score: quizAttempts.score,
            attemptedAt: quizAttempts.attemptedAt,
            username: users.username,
          })
          .from(quizAttempts)
          .innerJoin(users, eq(quizAttempts.userId, users.id))
          .orderBy(desc(quizAttempts.score))
          .limit(100);

          setLeaderboard(result as QuizAttempt[]);
        } catch (error) {
          console.error('Error fetching quiz leaderboard:', error);
        }
      }
    }

    fetchLeaderboard();
  }, [isAdmin]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  if (!isAdmin) {
    return <div className="container mx-auto p-4 text-red-500">Access Denied: You are not an administrator.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quiz Leaderboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Rank</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Username</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Score</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Attempted At</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((attempt, index) => (
              <tr key={attempt.id}>
                <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                <td className="py-2 px-4 border-b border-gray-200">{attempt.username}</td>
                <td className="py-2 px-4 border-b border-gray-200">{attempt.score}</td>
                <td className="py-2 px-4 border-b border-gray-200">{new Date(attempt.attemptedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
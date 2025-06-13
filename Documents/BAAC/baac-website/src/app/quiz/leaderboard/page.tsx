'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  submittedAt: string;
}

export default function QuizLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/quiz/leaderboard');
        if (res.ok) {
          const data: LeaderboardEntry[] = await res.json();
          setLeaderboard(data);
        } else {
          const errorData = await res.json();
          setError(errorData.message || 'Failed to fetch leaderboard.');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quiz Leaderboard</h1>
      {leaderboard.length === 0 ? (
        <p>No submissions yet. Be the first to take the quiz!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Score</th>
                <th className="py-3 px-4 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {leaderboard.map((entry, index) => (
                <tr key={entry.userId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{entry.username}</td>
                  <td className="py-3 px-4">{entry.score}</td>
                  <td className="py-3 px-4">{new Date(entry.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
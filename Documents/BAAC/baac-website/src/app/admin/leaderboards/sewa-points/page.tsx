import { db } from '@/drizzle/db';
import { desc } from 'drizzle-orm';
import { users } from '@/drizzle/schema';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  clerkId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  sewaPoints: number;
}

export default function SewaPointsLeaderboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

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
            id: users.id,
            clerkId: users.clerkId,
            username: users.username,
            email: users.email,
            isAdmin: users.isAdmin,
            sewaPoints: users.sewaPoints,
          })
          .from(users)
          .orderBy(desc(users.sewaPoints))
          .limit(100);

          setLeaderboard(result as User[]);
        } catch (error) {
          console.error('Error fetching sewa points leaderboard:', error);
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
      <h1 className="text-3xl font-bold mb-6">Sewa Points Leaderboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Rank</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Username</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Sewa Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.sewaPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  clerkId: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function AdminDashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${user.id}`);
        if (response.ok) {
          const userData: User = await response.json();
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

  if (loading) {
    return <div className="container mx-auto p-4">Loading admin panel...</div>;
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Quizzes</h2>
          <ul>
            <li><a href="/admin/quizzes/add" className="text-blue-600 hover:underline">Add/Update Questions</a></li>
            <li><a href="/admin/quizzes/manage" className="text-blue-600 hover:underline">Start/Stop Quiz</a></li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
          <ul>
            <li><a href="/admin/events/add" className="text-blue-600 hover:underline">Add/Edit/Delete Event</a></li>
            <li><a href="/admin/events/attendance" className="text-blue-600 hover:underline">Manage Attendance</a></li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manage Content</h2>
          <ul>
            <li><a href="/admin/resources/upload" className="text-blue-600 hover:underline">Upload Spiritual PDFs</a></li>
            <li><a href="/admin/images/upload" className="text-blue-600 hover:underline">Upload Event Images</a></li>
            <li><a href="/admin/qna/manage" className="text-blue-600 hover:underline">Manage Public Q&A</a></li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <ul>
            <li><a href="/admin/settings/jagannath-image" className="text-blue-600 hover:underline">Upload Jagannath Image</a></li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">View Leaderboards</h2>
          <ul>
            <li><a href="/admin/leaderboards/quiz" className="text-blue-600 hover:underline">Quiz Leaderboard</a></li>
            <li><a href="/admin/leaderboards/sewa-points" className="text-blue-600 hover:underline">Sewa Points Leaderboard</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
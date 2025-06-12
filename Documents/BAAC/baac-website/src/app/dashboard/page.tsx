import { UserButton } from "@clerk/nextjs";
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome } from 'react-icons/fa';
import { useEffect } from "react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const events = [
    "Event 1: Date (Placeholder)",
    "Event 2: Date (Placeholder)",
    "Event 3: Date (Placeholder)",
  ];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="relative flex flex-col items-center justify-center py-2 bg-white">
        <Link href="/" className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
        <FaHome size={24} />
      </Link>
      <h1 className="text-4xl font-bold mt-16 mb-8 text-gray-800">Welcome, Pritam!</h1>
      
      
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
          <p className="text-lg mb-2"><strong>Username:</strong> {user?.username}</p>
          <p className="text-lg mb-2"><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
          {user?.phoneNumbers && user.phoneNumbers.length > 0 && (
            <p className="text-lg mb-2"><strong>Phone Number:</strong> {user.phoneNumbers[0].phoneNumber}</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Attended Events</h2>
          <ul className="list-disc list-inside mb-8">
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-8 w-full mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-sm md:text-base">Email: info@baac.org</p>
            <p className="text-sm md:text-base">Phone: +1234567890</p>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-facebook-f"></i></Link>
              <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-twitter"></i></Link>
              <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-instagram"></i></Link>
              <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-youtube"></i></Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Location</h3>
            <p className="text-sm md:text-base">Bhakti Vedanta Academy,</p>
            <p className="text-sm md:text-base">Spiritual Lane, Holy Town,</p>
            <p className="text-sm md:text-base">Country XYZ</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-sm md:text-base">&copy; 2023 BAAC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
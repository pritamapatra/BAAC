"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        <div className={`${isMenuOpen ? 'hidden' : 'flex'} items-center`}>
          <Image src="/baac-logo.png" alt="BAAC Logo" width={50} height={50} className="mr-2" />
          <span className="text-xl font-bold text-gray-800">BAAC</span>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
            {isMenuOpen ? null : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
        <nav className={`${isMenuOpen ? 'block absolute top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center' : 'hidden'} md:block w-full md:w-auto`}>
          {isMenuOpen && (
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-gray-600 focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}

          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 items-center text-xl md:text-base">
            <li><Link href="/#home" className="text-gray-600 hover:text-orange-500">Home</Link></li>
            <li><Link href="/#spiritual-videos" className="text-gray-600 hover:text-orange-500">Spiritual Videos</Link></li>
            <li><Link href="/#resources" className="text-gray-600 hover:text-orange-500">Resources</Link></li>
            <li><Link href="/#events" className="text-gray-600 hover:text-orange-500">Events</Link></li>
            <li><Link href="/#qna" className="text-gray-600 hover:text-gray-900 transition duration-300">Q&A</Link></li>
            <li><Link href="/#contact" className="text-gray-600 hover:text-orange-500">Contact</Link></li>
            <li className="py-2">
              <SignedIn>
                <Link href="/dashboard" className="text-gray-600 hover:text-orange-500">
                  Dashboard
                </Link>
              </SignedIn>
            </li>
            <li className="py-2">
              <SignedIn>
                <Link href="/admin" className="text-gray-600 hover:text-orange-500">
                  Admin Dashboard
                </Link>
              </SignedIn>
            </li>
            <li className="py-2">
              <SignedIn>
                <Link href="/quiz" className="text-gray-600 hover:text-orange-500">
                  Weekly Quiz
                </Link>
              </SignedIn>
            </li>
            <li className="py-2">
              <SignedIn>
                <Link href="/quiz/leaderboard" className="text-gray-600 hover:text-orange-500">
                  Quiz Leaderboard
                </Link>
              </SignedIn>
            </li>
            <li className="py-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300">
                    Sign In / Sign Up
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
}
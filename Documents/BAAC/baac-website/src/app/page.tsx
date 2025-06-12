"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [sectionsVisible, setSectionsVisible] = useState({
    spiritual: false,
    resources: false,
    events: false,
    map: false
  });
  const [heroContentVisible, setHeroContentVisible] = useState(false);

  const spiritualRef = useRef(null);
  const resourcesRef = useRef(null);
  const eventsRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setHeroContentVisible(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setSectionsVisible(prev => ({
            ...prev,
            [entry.target.dataset.section]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    [spiritualRef, resourcesRef, eventsRef, mapRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center bg-cover bg-center pt-20" style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`bg-orange-500 bg-opacity-75 p-6 md:p-10 rounded-lg max-w-full mx-2 mt-96 transition-all duration-500 ease-out ${
            heroContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <h1 className="text-5xl md:text-5xl font-bold text-white mb-2 md:mb-4">Hare Krishna!!</h1>
            <h1 className="text-3xl md:text-5xl text-white mb-2 md:mb-4">Welcome to BhaktiVedanta Academy for Art & Culture, Manipal</h1>
            <p className="text-base md:text-xl text-white mb-4 md:mb-8 pb-5">Event details...</p>
          </div>
        </div>
      </section>

      {/* Spiritual Videos Section */}
      <section 
        ref={spiritualRef}
        data-section="spiritual"
        className={`py-10 md:py-16 bg-gray-100 transition-all duration-500 ease-out ${
          sectionsVisible.spiritual ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Spiritual Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/video-thumb-1.jpg" alt="Divine Discourse on Bhagavad Gita" width={400} height={225} className="w-full h-auto object-cover" />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Divine Discourse on Bhagavad Gita</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/video-thumb-2.jpg" alt="Meditation for Inner Peace" width={400} height={225} className="w-full h-auto object-cover" />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Meditation for Inner Peace</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/video-thumb-3.jpg" alt="Cultural Dance Performance" width={400} height={225} className="w-full h-auto object-cover" />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Cultural Dance Performance</h3>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link href="#" className="bg-orange-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-orange-600 transition duration-300">
              For more videos, visit our YouTube page
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section
        ref={resourcesRef}
        data-section="resources"
        className={`py-10 md:py-16 bg-gray-100 transition-all duration-500 ease-out ${
          sectionsVisible.resources ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Resources</h2>
          <div className="space-y-3 md:space-y-4">
            <p className="text-gray-700 text-base md:text-lg">The Essence of Bhakti Yoga - <Link href="#" className="text-blue-600 hover:underline">Download PDF</Link></p>
            <p className="text-gray-700 text-base md:text-lg">Understanding Vedic Philosophy - <Link href="#" className="text-blue-600 hover:underline">Download PDF</Link></p>
            <p className="text-gray-700 text-base md:text-lg">Spiritual Practices for Daily Life - <Link href="#" className="text-blue-600 hover:underline">Download PDF</Link></p>
          </div>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section
        ref={eventsRef}
        data-section="events"
        className={`py-10 md:py-16 bg-gray-100 transition-all duration-500 ease-out ${
          sectionsVisible.events ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Events Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/event-1.jpg" alt="Event 1" width={400} height={225} className="w-full h-auto object-cover" />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/event-2.jpg" alt="Event 2" width={400} height={225} className="w-full h-auto object-cover" />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src="/event-3.jpg" alt="Event 3" width={400} height={225} className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Map & Navigation Section */}
      <section
        ref={mapRef}
        data-section="map"
        className={`py-10 md:py-16 bg-gray-100 transition-all duration-500 ease-out ${
          sectionsVisible.map ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Map & Navigation</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            <Image src="/map-placeholder.jpg" alt="Map" width={400} height={250} className="rounded-lg shadow-md w-full md:w-auto" />
            <Link href="#" className="bg-orange-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-orange-600 transition duration-300">
              Navigate to BAAC
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer id="contact" />
    </div>
  );
}

// Removed the Sign Up button with black background

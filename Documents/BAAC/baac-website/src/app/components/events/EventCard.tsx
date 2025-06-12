import React from 'react';
import Image from 'next/image';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    imageUrl?: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <Image
          src={event.imageUrl}
          alt={event.name}
          width={400}
          height={225}
          className="w-full h-auto object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
        <p className="text-gray-600 text-sm mb-1">Date: {event.date}</p>
        <p className="text-gray-600 text-sm mb-1">Time: {event.time}</p>
        <p className="text-gray-600 text-sm mb-2">Location: {event.location}</p>
        <p className="text-gray-700 text-base">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
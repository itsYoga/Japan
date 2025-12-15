import React, { useState } from 'react';
import { RetroCard } from './RetroCard';
import { Member } from '../types';

export const MemberView: React.FC = () => {
  // Mock Members Data
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', email: 'alice@example.com', phone: '0912-345-678', lastLocation: 'Kyoto Station', lastSeen: '10 mins ago' },
    { id: '2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', email: 'bob@example.com', phone: '0922-333-444', lastLocation: 'Kiyomizu-dera', lastSeen: '1 hour ago' },
    { id: '3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', email: 'charlie@example.com', phone: '0933-444-555', lastLocation: 'Hotel', lastSeen: '2 hours ago' },
    { id: '4', name: 'Dave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave', email: 'dave@example.com', phone: '0911-222-333' },
    { id: '5', name: 'Eve', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve', email: 'eve@example.com', phone: '0955-666-777' },
    { id: '6', name: 'Frank', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank', email: 'frank@example.com', phone: '0966-777-888' },
    { id: '7', name: 'Grace', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', email: 'grace@example.com', phone: '0977-888-999' },
  ]);

  const handleCheckIn = () => {
    // In a real app, use navigator.geolocation and save to Firestore
    alert("📍 Checked in at Current Location! (Simulated)");
    // Update current user (mock)
    const newMembers = [...members];
    newMembers[0].lastLocation = "Current Location";
    newMembers[0].lastSeen = "Just now";
    setMembers(newMembers);
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">成員 & 定位</h1>
        <button 
            onClick={handleCheckIn}
            className="bg-brand-blue text-white px-4 py-2 rounded-xl border-2 border-stone-800 shadow-retro-sm text-sm font-bold active:scale-95 transition-transform"
        >
            <i className="fa-solid fa-location-dot mr-1"></i> Check In
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map(member => (
            <RetroCard key={member.id} className="flex items-center gap-4">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-stone-800 bg-white" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                        <i className="fa-solid fa-phone"></i> {member.phone}
                    </div>
                    {member.lastLocation && (
                        <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
                            <i className="fa-solid fa-map-pin mr-1"></i>
                            {member.lastLocation} ({member.lastSeen})
                        </div>
                    )}
                </div>
                <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border-2 border-stone-200 text-stone-600">
                    <i className="fa-solid fa-phone"></i>
                </a>
            </RetroCard>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="font-bold text-stone-800 mb-3">緊急聯絡</h2>
        <RetroCard color="orange">
            <ul className="text-sm space-y-2">
                <li className="flex justify-between"><span>👮 日本報警</span> <span className="font-bold">110</span></li>
                <li className="flex justify-between"><span>🚑 救護車</span> <span className="font-bold">119</span></li>
                <li className="flex justify-between"><span>🇹🇼 駐日代表處</span> <span className="font-bold">+81-3-3280-7811</span></li>
            </ul>
        </RetroCard>
      </div>
    </div>
  );
};

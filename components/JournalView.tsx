import React, { useState } from 'react';
import { RetroCard } from './RetroCard';
import { JournalEntry } from '../types';

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
        id: '1', userId: '1', userName: 'Alice', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        text: '京都的空氣真好！鴨川旁邊的風很涼爽～',
        date: 'Day 1 - 16:30',
        timestamp: Date.now(),
        photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop'
    }
  ]);
  const [newText, setNewText] = useState('');

  const handlePost = () => {
      if(!newText) return;
      const newEntry: JournalEntry = {
          id: Date.now().toString(),
          userId: 'me',
          userName: 'Me',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
          text: newText,
          date: 'Just now',
          timestamp: Date.now(),
          // In real app, handle file upload here
          photoUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop' 
      };
      setEntries([newEntry, ...entries]);
      setNewText('');
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-4 text-stone-800">旅行日誌</h1>
      
      {/* Input Area */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-800 shadow-retro mb-8">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-stone-700 resize-none h-20 placeholder-stone-400"
            placeholder="寫下今天的心情..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-100">
              <button className="text-stone-400 hover:text-stone-800"><i className="fa-solid fa-image text-xl"></i></button>
              <button 
                onClick={handlePost}
                className="bg-stone-800 text-white px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform"
              >
                  發佈
              </button>
          </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
          {entries.map(entry => (
              <div key={entry.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                      <img src={entry.userAvatar} className="w-10 h-10 rounded-full border border-stone-200" />
                      <div>
                          <p className="font-bold text-sm text-stone-800">{entry.userName}</p>
                          <p className="text-xs text-stone-400">{entry.date}</p>
                      </div>
                  </div>
                  <p className="text-stone-700 mb-3 whitespace-pre-wrap">{entry.text}</p>
                  {entry.photoUrl && (
                      <div className="rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-100">
                          <img src={entry.photoUrl} className="w-full h-48 object-cover" />
                      </div>
                  )}
              </div>
          ))}
      </div>
    </div>
  );
};

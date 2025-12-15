import React, { useState } from 'react';
import { RetroCard } from './RetroCard';
import { Booking } from '../types';

export const BookingView: React.FC = () => {
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const bookings: Booking[] = [
    {
        id: '1', type: 'flight', title: 'TPE -> KIX', refNumber: 'BR132', date: '2026-03-XX', 
        time: '08:30', details: 'Gate B6, Seat 42A. Terminal 2.', isPrivate: false
    },
    {
        id: '2', type: 'hotel', title: 'Kyoto Machiya Airbnb', refNumber: 'HM-99283', date: 'Day 1 - Day 3',
        details: 'Higashiyama District. Keybox: 4421. Check-in 15:00.', isPrivate: true
    },
    {
        id: '3', type: 'hotel', title: 'Osaka Namba Hotel', refNumber: 'RES-8821', date: 'Day 4 - Day 6',
        details: 'Near Namba Station. Need to forward luggage here.', isPrivate: true
    }
  ];

  const handlePinSubmit = () => {
    if (pin === '007') {
        setUnlocked(true);
        setPinMode(false);
    } else {
        alert('PIN 錯誤!');
        setPin('');
    }
  };

  return (
    <div className="pb-24 px-4 pt-6">
       <h1 className="text-2xl font-bold mb-4 text-stone-800">預訂 & 票券</h1>

       {!unlocked && (
           <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-center">
               <p className="text-sm text-red-700 mb-2"><i className="fa-solid fa-lock"></i> 隱私模式已鎖定</p>
               {pinMode ? (
                   <div className="flex gap-2 justify-center">
                       <input 
                        type="password" 
                        maxLength={3}
                        className="w-20 text-center border-2 border-stone-300 rounded p-1"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="PIN"
                       />
                       <button onClick={handlePinSubmit} className="bg-stone-800 text-white px-3 rounded">GO</button>
                   </div>
               ) : (
                   <button onClick={() => setPinMode(true)} className="text-xs underline text-stone-500">輸入 PIN (007) 查看詳細地址</button>
               )}
           </div>
       )}

       <div className="space-y-4">
           {bookings.map(book => (
               <div key={book.id} className="relative">
                   {/* Ticket Notch visual effect */}
                   <div className="absolute -left-2 top-1/2 w-4 h-4 bg-[#F7F4EB] rounded-full z-10"></div>
                   <div className="absolute -right-2 top-1/2 w-4 h-4 bg-[#F7F4EB] rounded-full z-10"></div>
                   
                   <RetroCard className="border-dashed border-2 px-6 py-4 flex flex-col gap-2">
                       <div className="flex justify-between items-start border-b border-stone-200 pb-2 mb-1">
                           <div>
                               <span className="text-xs font-bold text-stone-400 uppercase">{book.type}</span>
                               <h3 className="font-bold text-xl text-stone-800">{book.title}</h3>
                           </div>
                           <div className="text-right">
                               <p className="font-mono font-bold text-stone-600 bg-stone-100 px-2 rounded">{book.refNumber}</p>
                           </div>
                       </div>
                       
                       <div className="flex justify-between items-end">
                           <div>
                               <p className="text-stone-500 text-sm"><i className="fa-regular fa-calendar mr-1"></i> {book.date}</p>
                               {book.time && <p className="text-stone-500 text-sm"><i className="fa-regular fa-clock mr-1"></i> {book.time}</p>}
                           </div>
                           
                           <div className="text-right max-w-[50%]">
                               {book.isPrivate && !unlocked ? (
                                   <p className="text-xs text-stone-400 italic">*** 詳細資訊已隱藏 ***</p>
                               ) : (
                                   <p className="text-sm text-stone-700 font-medium">{book.details}</p>
                               )}
                           </div>
                       </div>
                   </RetroCard>
               </div>
           ))}
       </div>
    </div>
  );
};

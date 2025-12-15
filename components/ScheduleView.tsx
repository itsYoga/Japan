import React, { useState } from 'react';
import { RetroCard } from './RetroCard';
import { DayPlan, ScheduleItem } from '../types';
import { getGuideTips } from '../services/geminiService';

interface ScheduleViewProps {
  data: DayPlan[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ data }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loadingTipId, setLoadingTipId] = useState<string | null>(null);
  const [tips, setTips] = useState<Record<string, string>>({});

  const currentDay = data[selectedDayIndex];

  const handleGetTips = async (item: ScheduleItem) => {
    if (tips[item.id]) return; // Already loaded
    
    setLoadingTipId(item.id);
    const tip = await getGuideTips(item.location, item.description);
    setTips(prev => ({ ...prev, [item.id]: tip }));
    setLoadingTipId(null);
  };

  const openGoogleMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spot': return 'fa-camera text-emerald-600';
      case 'food': return 'fa-utensils text-orange-500';
      case 'transport': return 'fa-train text-blue-500';
      case 'hotel': return 'fa-bed text-purple-500';
      default: return 'fa-map-pin';
    }
  };

  const getWeatherIcon = (condition: string) => {
      switch(condition) {
          case 'sakura': return '🌸';
          case 'rain': return '🌧️';
          case 'cloudy': return '☁️';
          default: return '☀️';
      }
  };

  return (
    <div className="pb-24">
      {/* Date Scroller */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 p-4 sticky top-0 bg-[#F7F4EB] z-10 border-b border-stone-200">
        {data.map((day, idx) => (
          <button
            key={day.dayLabel}
            onClick={() => setSelectedDayIndex(idx)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all
              ${selectedDayIndex === idx 
                ? 'bg-stone-800 text-white border-stone-800 shadow-retro-sm' 
                : 'bg-white text-stone-600 border-stone-300'}
            `}
          >
            <div className="text-xs opacity-80">{day.date.slice(5)}</div>
            <div>{day.dayLabel}</div>
          </button>
        ))}
      </div>

      {/* Weather Header */}
      <div className="px-4 py-2 flex justify-between items-center text-stone-600">
        <div className="font-bold text-lg">
          {currentDay.weather.temp} <span className="text-2xl ml-2">{getWeatherIcon(currentDay.weather.condition)}</span>
        </div>
        <div className="text-sm bg-white border-2 border-stone-800 rounded-full px-3 py-1">
          {data.length - selectedDayIndex} days left
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 space-y-4 mt-2">
        {currentDay.items.map((item, idx) => (
          <div key={item.id} className="relative pl-4">
             {/* Connector Line */}
             {idx !== currentDay.items.length - 1 && (
                <div className="absolute left-[27px] top-10 bottom-[-20px] w-[2px] bg-stone-300 z-0"></div>
             )}
            
            <div className="flex items-start gap-3 relative z-10">
              {/* Time Bubble */}
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-sm font-bold text-stone-500 bg-[#F7F4EB] px-1">{item.time}</span>
                <div className={`w-6 h-6 rounded-full border-2 border-stone-800 bg-white flex items-center justify-center mt-1`}>
                    <i className={`fa-solid ${getTypeIcon(item.type)} text-xs`}></i>
                </div>
              </div>

              {/* Card */}
              <RetroCard className="flex-1" onClick={() => {}}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-stone-800">{item.title}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openGoogleMaps(item.location); }}
                    className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full border border-stone-800 hover:bg-blue-200"
                  >
                    <i className="fa-solid fa-location-arrow text-blue-600 text-xs"></i>
                  </button>
                </div>
                
                <p className="text-sm text-stone-600 mt-1">{item.description}</p>
                
                {/* AI Guide Button */}
                {!tips[item.id] && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleGetTips(item); }}
                    className="mt-3 text-xs bg-stone-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 active:scale-95 transition-transform"
                    disabled={loadingTipId === item.id}
                  >
                    {loadingTipId === item.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fa-solid fa-wand-magic-sparkles text-yellow-300"></i>
                    )}
                    AI 導遊分析
                  </button>
                )}

                {/* AI Tip Result */}
                {tips[item.id] && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-stone-700 relative">
                    <div className="absolute -top-2 left-4 w-3 h-3 bg-yellow-50 border-t border-l border-yellow-200 transform rotate-45"></div>
                    <div className="whitespace-pre-line">{tips[item.id]}</div>
                  </div>
                )}
              </RetroCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

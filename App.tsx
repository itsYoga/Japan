import React, { useState, useEffect } from 'react';
import { Tab, DayPlan } from './types';
import { ScheduleView } from './components/ScheduleView';
import { ExpenseView } from './components/ExpenseView';
import { BookingView } from './components/BookingView';
import { MemberView } from './components/MemberView';
import { JournalView } from './components/JournalView';
import { LoginScreen } from './components/LoginScreen';
import { auth } from './firebase';

// --- Detailed Data from Prompt ---
const MOCK_ITINERARY: DayPlan[] = [
  {
    date: '2026-03-XX', dayLabel: 'Day 1', weather: { condition: 'sunny', temp: '12°C' },
    items: [
      { id: '1-1', time: '13:00', title: '關西機場 → 京都', location: 'Kyoto Station', type: 'transport', description: '搭乘 Haruka 特急 (75min). 建議事先買外國人優惠票!' },
      { id: '1-2', time: '16:00', title: '鴨川散策', location: 'Sanjo Bridge', type: 'spot', description: '三條大橋至四條大橋。拍攝鴨川流水與町家建築。' },
      { id: '1-3', time: '18:00', title: '晚餐：先斗町柚子元', location: 'Pontocho Yuzugen', type: 'food', description: '柚子火鍋/京料理。需預約 (Group of 7)。' },
      { id: '1-4', time: '20:30', title: '祇園白川夜遊', location: 'Gion Tatsumi Bridge', type: 'spot', description: '拍攝夜間柳樹與巽橋，充滿京都味。' },
    ]
  },
  {
    date: '2026-03-XY', dayLabel: 'Day 2', weather: { condition: 'cloudy', temp: '14°C' },
    items: [
      { id: '2-1', time: '08:30', title: '清水寺', location: 'Kiyomizu-dera', type: 'spot', description: '從五條坂向上。參觀清水舞台、音羽之瀧接水祈福。' },
      { id: '2-2', time: '12:00', title: '午餐：奧丹清水', location: 'Okutan Kiyomizu', type: 'food', description: '380年老店湯豆腐料理。需預約包廂。' },
      { id: '2-3', time: '14:00', title: '高台寺 & 八坂神社', location: 'Kodaiji', type: 'spot', description: '寧寧之道與竹林，適合團體拍照。' },
      { id: '2-4', time: '17:00', title: '花見小路', location: 'Hanamikoji Street', type: 'spot', description: '感受花街風情。' },
      { id: '2-5', time: '19:00', title: '晚餐：五行拉麵', location: 'Gogyo Ramen Kyoto', type: 'food', description: '焦燒味噌拉麵，或選擇 Ganko 高瀨川二條苑。' },
    ]
  },
  {
    date: '2026-03-XZ', dayLabel: 'Day 3', weather: { condition: 'sakura', temp: '15°C' },
    items: [
      { id: '3-1', time: '08:00', title: '嵐山竹林 & 天龍寺', location: 'Arashiyama Bamboo Grove', type: 'spot', description: '早到拍攝無人空景。參觀世界遺產曹源池庭園。' },
      { id: '3-2', time: '11:30', title: '午餐：篩月', location: 'Shigetsu', type: 'food', description: '天龍寺內精進料理 (米其林推薦)。需預約。' },
      { id: '3-3', time: '13:30', title: '嵯峨野小火車', location: 'Sagano Romantic Train', type: 'spot', description: '搭乘富貴號 (5號車廂) 欣賞保津川與岩石。' },
      { id: '3-4', time: '16:00', title: '嵐電和服森林', location: 'Arashiyama Station', type: 'spot', description: '京友禪之林與足湯體驗。' },
      { id: '3-5', time: '19:00', title: '晚餐：名代豬排', location: 'Katsukura Kyoto Station', type: 'food', description: '酥脆炸豬排，無限續加高麗菜絲。大長桌適合團體。' },
    ]
  },
  {
    date: '2026-03-XW', dayLabel: 'Day 4', weather: { condition: 'sunny', temp: '16°C' },
    items: [
      { id: '4-1', time: '08:30', title: '伏見稻荷大社', location: 'Fushimi Inari Taisha', type: 'spot', description: '千本鳥居。建議走到四辻俯瞰市景。' },
      { id: '4-2', time: '11:00', title: '淀水路河津櫻', location: 'Yodo Waterway', type: 'spot', description: '早春河津櫻與油菜花秘境。' },
      { id: '4-3', time: '13:30', title: '午餐：鳥せい 本店', location: 'Torisei Honten', type: 'food', description: '酒造改建餐廳，巨大清酒桶。親子丼。' },
      { id: '4-4', time: '15:30', title: '移動至大阪', location: 'Namba Station', type: 'transport', description: '京阪+地鐵。Check-in Airbnb (難波/心齋橋)。' },
      { id: '4-5', time: '18:30', title: '晚餐：千房大阪燒', location: 'Chibo Okonomiyaki', type: 'food', description: '道頓堀必吃。看師傅現場製作大阪燒。' },
    ]
  },
   {
    date: '2026-03-XV', dayLabel: 'Day 5', weather: { condition: 'sunny', temp: '15°C' },
    items: [
      { id: '5-1', time: '09:00', title: '大阪 → 奈良', location: 'Kintetsu-Nara Station', type: 'transport', description: '搭乘近鐵奈良線快速急行。' },
      { id: '5-2', time: '10:00', title: '奈良公園 & 東大寺', location: 'Nara Park', type: 'spot', description: '餵鹿 (小心攻擊!)。參觀大佛殿與金剛力士像。' },
      { id: '5-3', time: '13:00', title: '午餐：釜飯/鰻魚飯', location: 'Edogawa Naramachi', type: 'food', description: '江戶川鰻魚飯或釜飯茶漬け Grancha。' },
      { id: '5-4', time: '14:30', title: '春日大社 & 中谷堂', location: 'Nakatanidou', type: 'spot', description: '參觀石燈籠。回程觀看高速搗麻糬表演。' },
      { id: '5-5', time: '19:00', title: '晚餐：燒肉力丸', location: 'Yakiniku Rikimaru', type: 'food', description: '國產牛吃到飽。提供厚切牛舌。' },
    ]
  },
   {
    date: '2026-03-XU', dayLabel: 'Day 6', weather: { condition: 'rain', temp: '13°C' },
    items: [
      { id: '6-1', time: '09:30', title: '大阪城', location: 'Osaka Castle', type: 'spot', description: '天守閣、歷史博物館與梅林。' },
      { id: '6-2', time: '12:30', title: '午餐：新世界串炸', location: 'Shinsekai', type: 'food', description: '串炸達摩。禁止二次沾醬！' },
      { id: '6-3', time: '14:30', title: '心齋橋購物', location: 'Shinsaibashi-Suji', type: 'spot', description: '藥妝、服飾、伴手禮最後衝刺。' },
      { id: '6-4', time: '18:00', title: '晚餐：壽喜燒 北むら', location: 'Kitamura Sukiyaki', type: 'food', description: '米其林一星，關西風壽喜燒 (先煎後煮)。必預約包廂。' },
    ]
  },
  {
    date: '2026-03-XT', dayLabel: 'Day 7', weather: { condition: 'sunny', temp: '14°C' },
    items: [
      { id: '7-1', time: '09:30', title: '黑門市場', location: 'Kuromon Ichiba Market', type: 'food', description: '大阪的廚房。必吃烤扇貝、海膽、神戶牛串燒。' },
      { id: '7-2', time: '12:00', title: '難波 Parks', location: 'Namba Parks', type: 'spot', description: '欣賞峽谷建築設計，最後補給。' },
      { id: '7-3', time: '13:30', title: '前往關西機場', location: 'Namba Station', type: 'transport', description: '搭乘南海電鐵特急 Rapi:t (鐵人28號)。' },
    ]
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCHEDULE);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if auth is already initialized or user session persists
    const unsubscribe = auth.onAuthStateChanged((u) => {
        if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SCHEDULE:
        return <ScheduleView data={MOCK_ITINERARY} />;
      case Tab.EXPENSES:
        return <ExpenseView />;
      case Tab.BOOKINGS:
        return <BookingView />;
      case Tab.MEMBERS:
        return <MemberView />;
      case Tab.JOURNAL:
        return <JournalView />;
      default:
        return <div className="p-8 text-center text-stone-500">開發中...</div>;
    }
  };

  if (!user) {
      return <LoginScreen onLoginSuccess={setUser} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-[#F7F4EB] text-ink font-sans pb-4">
      
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#F7F4EB]/90 backdrop-blur-sm z-20 px-4 py-3 flex justify-between items-center border-b border-stone-200">
        <h1 className="text-xl font-bold text-stone-800 tracking-wide">
          <i className="fa-solid fa-plane-departure mr-2 text-brand-orange"></i>
          關西七人行 
        </h1>
        <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="User" /> : <i className="fa-solid fa-user text-xs"></i>}
        </div>
      </div>

      {/* Main Content */}
      <main className="animate-fade-in">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t-2 border-stone-800 px-2 py-3 flex justify-around items-center z-30 shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.05)] pb-6">
        <button 
          onClick={() => setActiveTab(Tab.SCHEDULE)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SCHEDULE ? 'text-stone-900 -translate-y-2' : 'text-stone-400'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === Tab.SCHEDULE ? 'bg-brand-green border-2 border-stone-800 shadow-retro-sm' : ''}`}>
             <i className="fa-solid fa-calendar-days text-lg"></i>
          </div>
          <span className="text-[10px] font-bold">行程</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.BOOKINGS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.BOOKINGS ? 'text-stone-900 -translate-y-2' : 'text-stone-400'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === Tab.BOOKINGS ? 'bg-brand-blue border-2 border-stone-800 shadow-retro-sm' : ''}`}>
             <i className="fa-solid fa-ticket text-lg"></i>
          </div>
          <span className="text-[10px] font-bold">預訂</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.EXPENSES)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.EXPENSES ? 'text-stone-900 -translate-y-2' : 'text-stone-400'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === Tab.EXPENSES ? 'bg-brand-orange border-2 border-stone-800 shadow-retro-sm' : ''}`}>
             <i className="fa-solid fa-wallet text-lg"></i>
          </div>
          <span className="text-[10px] font-bold">記帳</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.JOURNAL)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.JOURNAL ? 'text-stone-900 -translate-y-2' : 'text-stone-400'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === Tab.JOURNAL ? 'bg-pink-200 border-2 border-stone-800 shadow-retro-sm' : ''}`}>
             <i className="fa-solid fa-book-open text-lg"></i>
          </div>
          <span className="text-[10px] font-bold">日誌</span>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.MEMBERS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.MEMBERS ? 'text-stone-900 -translate-y-2' : 'text-stone-400'}`}
        >
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === Tab.MEMBERS ? 'bg-yellow-200 border-2 border-stone-800 shadow-retro-sm' : ''}`}>
             <i className="fa-solid fa-users text-lg"></i>
          </div>
          <span className="text-[10px] font-bold">成員</span>
        </button>
      </div>
    </div>
  );
};

export default App;

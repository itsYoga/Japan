import React from 'react';
import { loginWithGoogle } from '../firebase';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    // In a real env with valid config, this works. 
    // For demo/mock, we might simulate it if it fails.
    try {
      const user = await loginWithGoogle();
      onLoginSuccess(user);
    } catch (e) {
      // Fallback for demo if firebase config is invalid
      console.warn("Firebase Auth failed (expected if no valid keys), using mock user");
      onLoginSuccess({
        uid: "mock-user-" + Math.random(),
        displayName: "Demo User",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F7F4EB] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-retro">
        <i className="fa-solid fa-plane-departure text-4xl text-white"></i>
      </div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">關西七人行</h1>
      <p className="text-stone-600 mb-8 max-w-xs">
        Kyoto & Osaka Travel Log<br/>
        Collaborative Planner
      </p>

      <button 
        onClick={handleLogin}
        className="bg-white border-2 border-stone-800 rounded-xl px-6 py-3 flex items-center gap-3 shadow-retro active:shadow-retro-active active:translate-y-[2px] active:translate-x-[2px] transition-all"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
        <span className="font-bold text-stone-800">Sign in with Google</span>
      </button>
      
      <p className="mt-8 text-xs text-stone-400">
        Designed for the 7-person squad.<br/>
        Syncs Expenses, Locations & Journals.
      </p>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>

      <div className="z-10 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white uppercase mb-8">
          Watch<span className="text-gray-500">Vault</span>
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Timeless Precision.<br />
          <span className="text-gray-400">Modern Luxury.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
          An exclusive platform for discovering, sourcing, and acquiring the world's most premium timepieces.
        </p>
        
        <button 
          onClick={() => navigate('/home')}
          className="px-10 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

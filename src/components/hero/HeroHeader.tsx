import React from 'react';
import { Pointer } from 'lucide-react';
import baguioSeal from '@/assets/baguio-seal.jpg';

interface HeroHeaderProps {
  theme: 'day' | 'night';
  touchToBeginLabel: string;
  welcomeLabel: string;
}

export const HeroHeader = ({ theme, touchToBeginLabel, welcomeLabel }: HeroHeaderProps) => (
  <div className="relative z-20 flex flex-col items-center justify-start pt-16">
    <div className="flex flex-col items-center">
      <img
        src={baguioSeal}
        alt="Baguio City Hall Seal"
        className="w-24 h-24 mb-3 rounded-full drop-shadow-lg"
        width={512}
        height={512}
      />
      <div className="text-center">
        <span className="text-5xl font-bold text-green-900" style={{ fontFamily: 'Times New Roman, serif', textShadow: '0px 0px 10px rgba(255,255,255,0.7)' }}>CITY GOVERNMENT OF BAGUIO</span>
      </div>
    </div>

    <div className="mb-8 relative mt-32">
      <div className="absolute inset-0 rounded-full border-4 border-green-600 animate-ping" />
      <Pointer className="w-24 h-24 text-gray-700 relative" />
    </div>

    <div className="text-center mb-8">
      <h2 className={`text-2xl font-bold ${theme === 'day' ? 'text-gray-800' : 'text-white'} mb-4`} style={{ textShadow: theme === 'day' ? '2px 2px 4px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)' }}>
        {touchToBeginLabel}
      </h2>
      <p className={`text-lg ${theme === 'day' ? 'text-gray-700' : 'text-white'}`} style={{ textShadow: theme === 'day' ? '2px 2px 4px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)' }}>
        {welcomeLabel}
      </p>
    </div>
  </div>
);

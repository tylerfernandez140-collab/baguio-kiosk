import { useKiosk } from '@/context/KioskContext';
import { Pointer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations } from '@/data/kioskData';
import baguioSeal from '@/assets/baguio-seal.jpg';
import baguioDay from '@/assets/baguio-day.jpg';
import baguioNight from '@/assets/baguio-night.jpg';
import TopBar from './TopBar';

interface HeroDashboardProps {
  onNavigate: (page: string) => void;
}

const HeroDashboard = ({ onNavigate }: HeroDashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language, theme } = useKiosk();
  const t = translations[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTouchBegin = () => {
    onNavigate('cityhall');
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden cursor-pointer"
      onClick={handleTouchBegin}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={theme === 'day' ? baguioDay : baguioNight}
          alt="Baguio City"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Light overlay for better readability */}
        <div className="absolute inset-0 bg-white/40" />
        
        {/* Fog Effect Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Fog Layer 1 - Cloud-like patches moving left to right */}
          <div className="absolute inset-0 fog-layer-1">
            <div className={`absolute top-10 left-0 w-[600px] h-[400px] ${theme === 'day' ? 'bg-white/70' : 'bg-white/40'} rounded-full blur-3xl`} />
            <div className={`absolute top-32 left-48 w-[500px] h-[350px] ${theme === 'day' ? 'bg-white/65' : 'bg-white/35'} rounded-full blur-2xl`} />
            <div className={`absolute top-20 left-96 w-[450px] h-[300px] ${theme === 'day' ? 'bg-white/68' : 'bg-white/38'} rounded-full blur-xl`} />
            <div className={`absolute bottom-40 left-24 w-[550px] h-[450px] ${theme === 'day' ? 'bg-white/62' : 'bg-white/32'} rounded-full blur-3xl`} />
            <div className={`absolute bottom-20 left-64 w-[400px] h-[320px] ${theme === 'day' ? 'bg-white/70' : 'bg-white/40'} rounded-full blur-2xl`} />
          </div>
          
          {/* Fog Layer 2 - Different cloud pattern moving left to right */}
          <div className="absolute inset-0 fog-layer-2">
            <div className={`absolute top-20 left-0 w-[520px] h-[380px] ${theme === 'day' ? 'bg-white/65' : 'bg-white/35'} rounded-full blur-2xl`} />
            <div className={`absolute top-40 left-32 w-[580px] h-[420px] ${theme === 'day' ? 'bg-white/68' : 'bg-white/38'} rounded-full blur-3xl`} />
            <div className={`absolute top-16 left-80 w-[480px] h-[340px] ${theme === 'day' ? 'bg-white/62' : 'bg-white/32'} rounded-full blur-xl`} />
            <div className={`absolute bottom-32 left-56 w-[500px] h-[380px] ${theme === 'day' ? 'bg-white/65' : 'bg-white/35'} rounded-full blur-2xl`} />
            <div className={`absolute bottom-16 left-96 w-[420px] h-[320px] ${theme === 'day' ? 'bg-white/70' : 'bg-white/40'} rounded-full blur-3xl`} />
          </div>
          
          {/* Fog Layer 3 - Subtle cloud patches moving left to right */}
          <div className="absolute inset-0 fog-layer-3">
            <div className={`absolute top-28 left-0 w-[450px] h-[350px] ${theme === 'day' ? 'bg-white/60' : 'bg-white/30'} rounded-full blur-xl`} />
            <div className={`absolute top-48 left-40 w-[500px] h-[400px] ${theme === 'day' ? 'bg-white/62' : 'bg-white/32'} rounded-full blur-2xl`} />
            <div className={`absolute top-12 left-72 w-[420px] h-[320px] ${theme === 'day' ? 'bg-white/65' : 'bg-white/35'} rounded-full blur-xl`} />
            <div className={`absolute bottom-28 left-48 w-[480px] h-[380px] ${theme === 'day' ? 'bg-white/60' : 'bg-white/30'} rounded-full blur-2xl`} />
            <div className={`absolute bottom-12 left-88 w-[400px] h-[320px] ${theme === 'day' ? 'bg-white/62' : 'bg-white/32'} rounded-full blur-xl`} />
          </div>
        </div>
      </div>

      <TopBar />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-start min-h-screen px-8 pt-16">
        {/* Baguio City Hall Header with Seal */}
        <div className="flex flex-col items-center">
          {/* Baguio City Hall Seal - Top */}
          <img
            src={baguioSeal}
            alt="Baguio City Hall Seal"
            className="w-24 h-24 mb-3 rounded-full drop-shadow-lg"
            width={512}
            height={512}
          />
          
          {/* City Government of Baguio - Below Seal */}
          <div className="text-center">
            <span className="text-5xl font-bold text-green-900" style={{ fontFamily: 'Times New Roman, serif', textShadow: '0px 0px 10px rgba(255,255,255,0.7)' }}>CITY GOVERNMENT OF BAGUIO</span>
          </div>
        </div>

        {/* Hand Pointing Icon with Animation */}
        <div className="mb-8 relative mt-32">
          <div className="absolute inset-0 rounded-full border-4 border-green-600 animate-ping" />
          <Pointer className="w-24 h-24 text-gray-700 relative" />
        </div>

        {/* Touch Screen to Begin Text */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold ${theme === 'day' ? 'text-gray-800' : 'text-white'} mb-4`} style={{ textShadow: theme === 'day' ? '2px 2px 4px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {t.touchToBegin}
          </h2>
          <p className={`text-lg ${theme === 'day' ? 'text-gray-700' : 'text-white'}`} style={{ textShadow: theme === 'day' ? '2px 2px 4px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {t.welcome}
          </p>
        </div>
      </div>

      {/* Time and Date Display - Bottom Right */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-2xl font-semibold text-white">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-white">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;

import React from 'react';

interface HeroFogProps {
  theme: 'day' | 'night';
}

export const HeroFog = ({ theme }: HeroFogProps) => {
  const fogOpacity = theme === 'day' ? 'bg-white/70' : 'bg-white/40';
  const fogOpacity2 = theme === 'day' ? 'bg-white/65' : 'bg-white/35';
  const fogOpacity3 = theme === 'day' ? 'bg-white/68' : 'bg-white/38';
  const fogOpacity4 = theme === 'day' ? 'bg-white/62' : 'bg-white/32';
  const fogOpacity5 = theme === 'day' ? 'bg-white/60' : 'bg-white/30';

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 fog-layer-1">
        <div className={`absolute top-10 left-0 w-[600px] h-[400px] ${fogOpacity} rounded-full blur-3xl`} />
        <div className={`absolute top-32 left-48 w-[500px] h-[350px] ${fogOpacity2} rounded-full blur-2xl`} />
        <div className={`absolute top-20 left-96 w-[450px] h-[300px] ${fogOpacity3} rounded-full blur-xl`} />
        <div className={`absolute bottom-40 left-24 w-[550px] h-[450px] ${fogOpacity4} rounded-full blur-3xl`} />
        <div className={`absolute bottom-20 left-64 w-[400px] h-[320px] ${fogOpacity} rounded-full blur-2xl`} />
      </div>
      
      <div className="absolute inset-0 fog-layer-2">
        <div className={`absolute top-20 left-0 w-[520px] h-[380px] ${fogOpacity2} rounded-full blur-2xl`} />
        <div className={`absolute top-40 left-32 w-[580px] h-[420px] ${fogOpacity3} rounded-full blur-3xl`} />
        <div className={`absolute top-16 left-80 w-[480px] h-[340px] ${fogOpacity4} rounded-full blur-xl`} />
        <div className={`absolute bottom-32 left-56 w-[500px] h-[380px] ${fogOpacity2} rounded-full blur-2xl`} />
        <div className={`absolute bottom-16 left-96 w-[420px] h-[320px] ${fogOpacity} rounded-full blur-3xl`} />
      </div>
      
      <div className="absolute inset-0 fog-layer-3">
        <div className={`absolute top-28 left-0 w-[450px] h-[350px] ${fogOpacity5} rounded-full blur-xl`} />
        <div className={`absolute top-48 left-40 w-[500px] h-[400px] ${fogOpacity4} rounded-full blur-2xl`} />
        <div className={`absolute top-12 left-72 w-[420px] h-[320px] ${fogOpacity2} rounded-full blur-xl`} />
        <div className={`absolute bottom-28 left-48 w-[480px] h-[380px] ${fogOpacity5} rounded-full blur-2xl`} />
        <div className={`absolute bottom-12 left-88 w-[400px] h-[320px] ${fogOpacity4} rounded-full blur-xl`} />
      </div>
    </div>
  );
};

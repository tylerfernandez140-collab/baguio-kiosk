import { useKiosk } from '@/context/KioskContext';
import { translations } from '@/data/kioskData';
import baguioDay from '@/assets/baguio-day.jpg';
import baguioNight from '@/assets/baguio-night.jpg';
import TopBar from './TopBar';
import { HeroFog } from './hero/HeroFog';
import { HeroTime } from './hero/HeroTime';
import { HeroHeader } from './hero/HeroHeader';

interface HeroDashboardProps {
  onNavigate: (page: string) => void;
}

const HeroDashboard = ({ onNavigate }: HeroDashboardProps) => {
  const { language, theme } = useKiosk();
  const t = translations[language];

  return (
    <div 
      className="relative min-h-screen overflow-hidden cursor-pointer"
      onClick={() => onNavigate('cityhall')}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={theme === 'day' ? baguioDay : baguioNight}
          alt="Baguio City"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-white/40" />
        <HeroFog theme={theme} />
      </div>

      <TopBar />

      <HeroHeader 
        theme={theme} 
        touchToBeginLabel={t.touchToBegin} 
        welcomeLabel={t.welcome} 
      />

      <HeroTime />
    </div>
  );
};

export default HeroDashboard;

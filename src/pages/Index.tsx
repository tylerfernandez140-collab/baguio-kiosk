import { useState, useEffect } from 'react';
import { useKiosk } from '@/context/KioskContext';
import HeroDashboard from '@/components/HeroDashboard';
import CityHallDirectory from '@/components/CityHallDirectory';

type Page = 'home' | 'cityhall';

const KioskApp = () => {
  const [page, setPage] = useState<Page>('home');
  const { isIdle } = useKiosk();

  useEffect(() => {
    if (isIdle) {
      setPage('home');
    }
  }, [isIdle]);

  const goHome = () => { setPage('home'); };

  switch (page) {
    case 'cityhall':
      return <CityHallDirectory onNavigate={goHome} />;
    default:
      return <HeroDashboard onNavigate={(p) => setPage(p as Page)} />;
  }
};

const Index = () => (
  <KioskApp />
);

export default Index;

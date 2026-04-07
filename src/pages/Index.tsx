import { useState, useEffect } from 'react';
import { KioskProvider, useKiosk } from '@/context/KioskContext';
import { cityHallFloors, type Office } from '@/data/kioskData';
import HeroDashboard from '@/components/HeroDashboard';
import Directory from '@/components/Directory';
import FloorMap from '@/components/FloorMap';
import Services from '@/components/Services';
import Announcements from '@/components/Announcements';
import Tourism from '@/components/Tourism';
import Emergency from '@/components/Emergency';
import SearchPage from '@/components/SearchPage';
import CityHallDirectory from '@/components/CityHallDirectory';

type Page = 'home' | 'cityhall' | 'directory' | 'floormap' | 'services' | 'announcements' | 'tourism' | 'emergency' | 'search';

const KioskApp = () => {
  const [page, setPage] = useState<Page>('home');
  const [highlightOffice, setHighlightOffice] = useState<Office | null>(null);
  const { isIdle } = useKiosk();

  // Auto return to home on idle
  useEffect(() => {
    if (isIdle) {
      setPage('home');
      setHighlightOffice(null);
    }
  }, [isIdle]);

  const goHome = () => { setPage('home'); setHighlightOffice(null); };

  const handleOfficeSelect = (office: Office) => {
    setHighlightOffice(office);
    setPage('floormap');
  };

  const handleSearchNavigate = (officeId: string) => {
    const office = cityHallFloors.flatMap(f => f.offices).find(o => o.id === officeId);
    if (office) handleOfficeSelect(office);
  };

  switch (page) {
    case 'cityhall':
      return <CityHallDirectory onNavigate={goHome} />;
    case 'directory':
      return <Directory onBack={goHome} onSelectOffice={handleOfficeSelect} />;
    case 'floormap':
      return <FloorMap onBack={goHome} highlightOffice={highlightOffice} />;
    case 'services':
      return <Services onBack={goHome} />;
    case 'announcements':
      return <Announcements onBack={goHome} />;
    case 'tourism':
      return <Tourism onBack={goHome} />;
    case 'emergency':
      return <Emergency onBack={goHome} />;
    case 'search':
      return <SearchPage onBack={goHome} onNavigateToOffice={handleSearchNavigate} />;
    default:
      return <HeroDashboard onNavigate={(p) => setPage(p as Page)} />;
  }
};

const Index = () => (
  <KioskProvider>
    <KioskApp />
  </KioskProvider>
);

export default Index;

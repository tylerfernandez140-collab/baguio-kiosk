import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

type Language = 'en' | 'fil';
type Theme = 'day' | 'night';

interface KioskContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  resetIdleTimer: () => void;
  isIdle: boolean;
  kioskId: string;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  navigation: { floorId: string; officeId: string } | null;
  startNavigation: (floorId: string, officeId: string) => void;
  clearNavigation: () => void;
}

const KioskContext = createContext<KioskContextType | null>(null);

const IDLE_TIMEOUT = 120000; // 2 minutes

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('kiosk-theme');
    return (savedTheme as Theme) || 'day';
  });
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const timer = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
    idleTimerRef.current = timer;
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      // Only set up event listeners once
      const events = ['touchstart', 'mousedown', 'mousemove', 'keydown'];
      const handler = () => resetIdleTimer();
      events.forEach(e => window.addEventListener(e, handler));
      resetIdleTimer();
      setIsInitialized(true);
      
      return () => {
        events.forEach(e => window.removeEventListener(e, handler));
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [isInitialized, resetIdleTimer]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'night');
    localStorage.setItem('kiosk-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'day' ? 'night' : 'day');

  const [kioskId] = useState<string>(() => {
    // 1. Check URL for ?kioskId=...
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('kioskId');
    if (urlId) {
      localStorage.setItem('kiosk-id', urlId);
      return urlId;
    }
    
    // 2. Check Local Storage for previously saved ID
    const savedId = localStorage.getItem('kiosk-id');
    if (savedId) return savedId;
    
    // 3. Fallback to Environment Variable or Default
    return import.meta.env.VITE_KIOSK_ID || 'kiosk_1';
  });

  const [selectedFloor, setSelectedFloor] = useState('first');
  const [navigation, setNavigation] = useState<{ floorId: string; officeId: string } | null>(null);

  const startNavigation = (floorId: string, officeId: string) => {
    // 1. Clear any existing navigation
    setNavigation(null);
    
    // 2. Start from first floor to show line to stairs
    setSelectedFloor('first');
    setNavigation({ floorId, officeId });

    // 3. If target is on another floor, wait 4 seconds then switch
    if (floorId !== 'first') {
      setTimeout(() => {
        setSelectedFloor(floorId);
      }, 4000);
    }
  };

  const clearNavigation = () => setNavigation(null);

  return (
    <KioskContext.Provider value={{ 
      language, setLanguage, theme, toggleTheme, resetIdleTimer, isIdle, kioskId,
      selectedFloor, setSelectedFloor, navigation, startNavigation, clearNavigation
    }}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error('useKiosk must be used within KioskProvider');
  return ctx;
};

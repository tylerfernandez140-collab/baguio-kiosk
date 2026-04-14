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
  
  return (
    <KioskContext.Provider value={{ language, setLanguage, theme, toggleTheme, resetIdleTimer, isIdle, kioskId }}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error('useKiosk must be used within KioskProvider');
  return ctx;
};

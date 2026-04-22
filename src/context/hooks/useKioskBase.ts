import { useState, useEffect, useCallback, useRef } from 'react';

export type Language = 'en' | 'fil';
export type Theme = 'day' | 'night';

const IDLE_TIMEOUT = 120000; // 2 minutes

export const useKioskBase = () => {
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('kioskId');
    if (urlId) {
      localStorage.setItem('kiosk-id', urlId);
      return urlId;
    }
    const savedId = localStorage.getItem('kiosk-id');
    if (savedId) return savedId;
    return import.meta.env.VITE_KIOSK_ID || 'kiosk_1';
  });

  return {
    language,
    setLanguage,
    theme,
    toggleTheme,
    isIdle,
    resetIdleTimer,
    kioskId
  };
};

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialFloorLabels } from '@/data/floorLabels';
import { supabase } from '@/lib/supabase';

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
  labels: Record<string, Record<string, string>>;
  updateLabel: (floorId: string, labelKey: string, newValue: string) => void;
  offices: any[];
  refreshOffices: () => Promise<void>;
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
  const [labels, setLabels] = useState(initialFloorLabels);
  const [offices, setOffices] = useState<any[]>([]);

  const fetchOffices = useCallback(async () => {
    // Now just fetch from offices table as 'name' is synced with floor_labels.label_text
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('floor_id', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching offices:', error);
    } else if (data) {
      setOffices(data);
    }
  }, []);

  useEffect(() => {
    const fetchLabels = async () => {
      const { data, error } = await supabase.from('floor_labels').select('*');
      if (error) {
        console.error('Error fetching labels from Supabase:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const newLabels: Record<string, Record<string, string>> = JSON.parse(JSON.stringify(initialFloorLabels));
        data.forEach((item: any) => {
          if (!newLabels[item.floor_id]) newLabels[item.floor_id] = {};
          newLabels[item.floor_id][item.label_key] = item.label_text;
        });
        setLabels(newLabels);
      }
    };

    fetchLabels();
    fetchOffices();

    // Set up realtime subscription for labels
    const labelsChannel = supabase
      .channel('floor-labels-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'floor_labels' },
        (payload) => {
          const { floor_id, label_key, label_text } = payload.new as any;
          setLabels(prev => ({
            ...prev,
            [floor_id]: {
              ...prev[floor_id],
              [label_key]: label_text
            }
          }));
        }
      )
      .subscribe();

    // Set up realtime subscription for offices
    const officesChannel = supabase
      .channel('offices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'offices' },
        () => {
          fetchOffices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(labelsChannel);
      supabase.removeChannel(officesChannel);
    };
  }, [fetchOffices]);

  const updateLabel = async (floorId: string, labelKey: string, newValue: string) => {
    // 1. Update local state for immediate feedback
    setLabels(prev => ({
      ...prev,
      [floorId]: {
        ...prev[floorId],
        [labelKey]: newValue
      }
    }));

    // 2. Persist to Supabase
    const { error } = await supabase
      .from('floor_labels')
      .upsert({ 
        floor_id: floorId, 
        label_key: labelKey, 
        label_text: newValue 
      }, { onConflict: 'floor_id,label_key' });

    if (error) {
      console.error('Error updating label in Supabase:', error);
    }
  };

  const startNavigation = (floorId: string, officeId: string) => {
    // 1. Clear any existing navigation
    setNavigation(null);
    
    // 2. Start from first floor to show line to stairs
    setSelectedFloor('first');
    setNavigation({ floorId, officeId });

    // 3. If target is on another floor, sequence the transitions
    if (floorId === 'third') {
      setTimeout(() => {
        setSelectedFloor('second');
        setTimeout(() => {
          setSelectedFloor('third');
        }, 1000);
      }, 1000);
    } else if (floorId !== 'first') {
      setTimeout(() => {
        setSelectedFloor(floorId);
      }, 1000);
    }
  };

  const clearNavigation = () => setNavigation(null);

  return (
    <KioskContext.Provider value={{ 
      language, setLanguage, theme, toggleTheme, resetIdleTimer, isIdle, kioskId,
      selectedFloor, setSelectedFloor, navigation, startNavigation, clearNavigation,
      labels, updateLabel, offices, refreshOffices: fetchOffices
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

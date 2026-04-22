import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialFloorLabels } from '@/data/floorLabels';
import { supabase } from '@/lib/supabase';
import { getKioskSettings } from '../config/kioskConfig';

type Language = 'en' | 'fil';
type Theme = 'day' | 'night';

export interface NavigationStep {
  id: string;
  type: 'walk' | 'stairs' | 'elevator' | 'floor_change' | 'arrived';
  description: string;
  descriptionFil: string;
  floorId: string;
  targetPosition?: { x: number; y: number; z: number };
  completed: boolean;
}

export interface NavigationState {
  floorId: string;
  officeId: string;
  officeName: string;
  steps: NavigationStep[];
  currentStepIndex: number;
  isActive: boolean;
  isTransitioning: boolean;
}

interface CameraAnimationState {
  isAnimating: boolean;
  targetPosition: { x: number; y: number; z: number } | null;
  lookAtPosition: { x: number; y: number; z: number } | null;
  progress: number;
}

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
  navigation: NavigationState | null;
  startNavigation: (floorId: string, officeId: string, officeName?: string) => void;
  clearNavigation: () => void;
  labels: Record<string, Record<string, string>>;
  updateLabel: (floorId: string, labelKey: string, newValue: string) => void;
  offices: any[];
  refreshOffices: () => Promise<void>;
  goToNextStep: () => void;
  completeCurrentStep: () => void;
  startFloorTransition: () => void;
  endFloorTransition: () => void;
  cameraAnimation: CameraAnimationState;
  setCameraAnimation: (state: CameraAnimationState) => void;
  startCameraAnimation: (targetPos: { x: number; y: number; z: number }, lookAtPos: { x: number; y: number; z: number }) => void;
  stopCameraAnimation: () => void;
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
  const [navigation, setNavigation] = useState<NavigationState | null>(null);
  const [cameraAnimation, setCameraAnimation] = useState<CameraAnimationState>({
    isAnimating: false,
    targetPosition: null,
    lookAtPosition: null,
    progress: 0,
  });
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

  // Generate navigation steps based on start and end locations
  const generateNavigationSteps = (
    startFloor: string,
    targetFloor: string,
    officeId: string,
    officeName: string,
    kioskId: string
  ): NavigationStep[] => {
    const steps: NavigationStep[] = [];
    let stepId = 0;

    const floorOrder = ['basement', 'first', 'second', 'third'];
    const startIndex = floorOrder.indexOf(startFloor);
    const endIndex = floorOrder.indexOf(targetFloor);

    if (startIndex === -1 || endIndex === -1) return [];

    const floorNames: Record<string, string> = {
      basement: 'Basement',
      first: 'First Floor',
      second: 'Second Floor',
      third: 'Third Floor',
    };

    if (startIndex === endIndex) {
      // Single floor navigation
      steps.push({
        id: `step-${stepId++}`,
        type: 'walk',
        description: `Follow the path to ${officeName}`,
        descriptionFil: `Sundin ang daan patungo sa ${officeName}`,
        floorId: startFloor,
        completed: false,
      });
    } else {
      // Multi-floor navigation
      const isUp = endIndex > startIndex;
      const direction = isUp ? 1 : -1;
      
      // Determine the sequence of floors to visit
      let currentIdx = startIndex;
      
      while (currentIdx !== endIndex) {
        const currentFloorId = floorOrder[currentIdx];
        const nextIdx = currentIdx + direction;
        const nextFloorId = floorOrder[nextIdx];
        const stairDirection = isUp ? 'up' : 'down';

        // 1. Walk to stairs on current floor
        steps.push({
          id: `step-${stepId++}`,
          type: 'walk',
          description: `Follow the path to the stairs for ${floorNames[nextFloorId]}`,
          descriptionFil: `Sundin ang daan patungo sa hagdan para sa ${floorNames[nextFloorId]}`,
          floorId: currentFloorId,
          targetPosition: { x: 2.96, y: 0.5, z: 0.5 }, // General stairs position
          completed: false,
        });

        // 2. Take stairs
        steps.push({
          id: `step-${stepId++}`,
          type: 'stairs',
          description: `Take the stairs ${stairDirection} to the ${floorNames[nextFloorId]}`,
          descriptionFil: `Gamitin ang hagdan ${stairDirection === 'up' ? 'paakyat' : 'pababa'} patungo sa ${floorNames[nextFloorId]}`,
          floorId: currentFloorId,
          completed: false,
        });

        // 3. Floor transition step (triggers visual change)
        steps.push({
          id: `step-${stepId++}`,
          type: 'floor_change',
          description: `Arrived at ${floorNames[nextFloorId]}`,
          descriptionFil: `Nakarating na sa ${floorNames[nextFloorId]}`,
          floorId: nextFloorId,
          completed: false,
        });

        currentIdx = nextIdx;

        // 4. If we reached the target floor, walk to destination
        // If we haven't reached the target floor yet, we'll loop back and walk to the NEXT stairs
        if (currentIdx === endIndex) {
          steps.push({
            id: `step-${stepId++}`,
            type: 'walk',
            description: `Continue from the stairs landing toward ${officeName}`,
            descriptionFil: `Magpatuloy mula sa hagdan patungo sa ${officeName}`,
            floorId: nextFloorId,
            completed: false,
          });
        }
      }
    }

    // Final step: Arrive at destination
    steps.push({
      id: `step-${stepId++}`,
      type: 'arrived',
      description: `You have arrived at ${officeName}`,
      descriptionFil: `Nakarating ka na sa ${officeName}`,
      floorId: targetFloor,
      completed: false,
    });

    return steps;
  };

  const startNavigation = (floorId: string, officeId: string, officeName?: string) => {
    const targetOfficeName = officeName || officeId;
    
    // Generate navigation steps
    const steps = generateNavigationSteps('first', floorId, officeId, targetOfficeName, kioskId);
    
    // Create navigation state
    const newNavigation: NavigationState = {
      floorId,
      officeId,
      officeName: targetOfficeName,
      steps,
      currentStepIndex: 0,
      isActive: true,
      isTransitioning: false,
    };

    // Clear any existing navigation and start fresh
    setNavigation(null);
    setSelectedFloor('first');
    
    // Small delay to ensure clean state
    setTimeout(() => {
      setNavigation(newNavigation);
      
      // Start camera animation from "You Are Here" position
      const settings = getKioskSettings(kioskId);
      const startPos = settings.firstFloorPosition;
      
      // Calculate first target (usually the hallway or first waypoint)
      const firstStep = steps[0];
      if (firstStep) {
        startCameraAnimation(
          { x: startPos[0], y: startPos[1] + 2, z: startPos[2] },
          { x: startPos[0], y: 0, z: startPos[2] - 2 }
        );
      }
    }, 100);
  };

  const clearNavigation = () => {
    setNavigation(null);
    stopCameraAnimation();
  };

  const goToNextStep = () => {
    setNavigation(prev => {
      if (!prev) return null;
      const newIndex = Math.min(prev.currentStepIndex + 1, prev.steps.length - 1);
      return { ...prev, currentStepIndex: newIndex };
    });
  };

  const completeCurrentStep = () => {
    setNavigation(prev => {
      if (!prev) return null;
      const updatedSteps = [...prev.steps];
      if (updatedSteps[prev.currentStepIndex]) {
        updatedSteps[prev.currentStepIndex] = {
          ...updatedSteps[prev.currentStepIndex],
          completed: true,
        };
      }
      return { ...prev, steps: updatedSteps };
    });
  };

  const startFloorTransition = () => {
    setNavigation(prev => prev ? { ...prev, isTransitioning: true } : null);
  };

  const endFloorTransition = () => {
    setNavigation(prev => prev ? { ...prev, isTransitioning: false } : null);
  };

  const startCameraAnimation = (targetPos: { x: number; y: number; z: number }, lookAtPos: { x: number; y: number; z: number }) => {
    setCameraAnimation({
      isAnimating: true,
      targetPosition: targetPos,
      lookAtPosition: lookAtPos,
      progress: 0,
    });
  };

  const stopCameraAnimation = () => {
    setCameraAnimation({
      isAnimating: false,
      targetPosition: null,
      lookAtPosition: null,
      progress: 0,
    });
  };

  return (
    <KioskContext.Provider value={{ 
      language, setLanguage, theme, toggleTheme, resetIdleTimer, isIdle, kioskId,
      selectedFloor, setSelectedFloor, navigation, startNavigation, clearNavigation,
      labels, updateLabel, offices, refreshOffices: fetchOffices,
      goToNextStep, completeCurrentStep, startFloorTransition, endFloorTransition,
      cameraAnimation, setCameraAnimation, startCameraAnimation, stopCameraAnimation
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

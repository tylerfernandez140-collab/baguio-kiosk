import React, { createContext, useContext, useState } from 'react';
import { useKioskBase, Language, Theme } from './hooks/useKioskBase';
import { useKioskData } from './hooks/useKioskData';
import { useKioskNavigation, NavigationState } from './hooks/useKioskNavigation';
import { useKioskCamera, CameraAnimationState } from './hooks/useKioskCamera';

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

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, theme, toggleTheme, isIdle, resetIdleTimer, kioskId } = useKioskBase();
  const { labels, updateLabel, offices, fetchOffices } = useKioskData();
  const { cameraAnimation, setCameraAnimation, startCameraAnimation, stopCameraAnimation } = useKioskCamera();
  const [selectedFloor, setSelectedFloor] = useState('first');
  const { 
    navigation, 
    startNavigation, 
    clearNavigation, 
    goToNextStep, 
    completeCurrentStep, 
    startFloorTransition, 
    endFloorTransition 
  } = useKioskNavigation(kioskId, setSelectedFloor, startCameraAnimation, stopCameraAnimation);

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

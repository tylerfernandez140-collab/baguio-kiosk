import * as THREE from 'three';

export interface KioskSettings {
  firstFloorPosition: [number, number, number];
  showPaths: boolean;
}

export const KIOSK_SETTINGS: Record<string, KioskSettings> = {
  kiosk_1: {
    firstFloorPosition: [3.20, 0.01, 2.5],
    showPaths: true,
  },
  kiosk_2: {
    firstFloorPosition: [-5.98, 0.1, 0.78],
    showPaths: true,
  },
};

export const getKioskSettings = (id: string): KioskSettings => {
  return KIOSK_SETTINGS[id] || KIOSK_SETTINGS.kiosk_1;
};

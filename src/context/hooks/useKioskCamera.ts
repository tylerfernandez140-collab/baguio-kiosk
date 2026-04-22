import { useState } from 'react';

export interface CameraAnimationState {
  isAnimating: boolean;
  targetPosition: { x: number; y: number; z: number } | null;
  lookAtPosition: { x: number; y: number; z: number } | null;
  progress: number;
}

export const useKioskCamera = () => {
  const [cameraAnimation, setCameraAnimation] = useState<CameraAnimationState>({
    isAnimating: false,
    targetPosition: null,
    lookAtPosition: null,
    progress: 0,
  });

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

  return {
    cameraAnimation,
    setCameraAnimation,
    startCameraAnimation,
    stopCameraAnimation
  };
};

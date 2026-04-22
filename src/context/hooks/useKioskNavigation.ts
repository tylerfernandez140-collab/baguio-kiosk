import { useState } from 'react';
import { getKioskSettings } from '../../config/kioskConfig';

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

export const useKioskNavigation = (
  kioskId: string, 
  setSelectedFloor: (floor: string) => void,
  startCameraAnimation: (targetPos: { x: number; y: number; z: number }, lookAtPos: { x: number; y: number; z: number }) => void,
  stopCameraAnimation: () => void
) => {
  const [navigation, setNavigation] = useState<NavigationState | null>(null);

  const generateNavigationSteps = (
    startFloor: string,
    targetFloor: string,
    officeId: string,
    officeName: string
  ): NavigationStep[] => {
    const steps: NavigationStep[] = [];
    let stepId = 0;

    steps.push({
      id: `step-${stepId++}`,
      type: 'walk',
      description: `Start from your current location`,
      descriptionFil: `Magsimula sa iyong kasalukuyang lokasyon`,
      floorId: startFloor,
      completed: false,
    });

    if (targetFloor !== startFloor) {
      const floorNames: Record<string, string> = {
        basement: 'Basement',
        first: 'First Floor',
        second: 'Second Floor',
        third: 'Third Floor',
      };

      steps.push({
        id: `step-${stepId++}`,
        type: 'walk',
        description: `Follow the path to the stairs`,
        descriptionFil: `Sundin ang daan patungo sa hagdan`,
        floorId: startFloor,
        targetPosition: { x: 2.96, y: 0.5, z: 0.5 },
        completed: false,
      });

      const direction = targetFloor === 'basement' ? 'down' : 'up';
      steps.push({
        id: `step-${stepId++}`,
        type: 'stairs',
        description: `Go ${direction} the stairs to ${floorNames[targetFloor]}`,
        descriptionFil: `Bumaba/pumunta pababa/paakyat sa hagdan patungo sa ${floorNames[targetFloor]}`,
        floorId: startFloor,
        completed: false,
      });

      steps.push({
        id: `step-${stepId++}`,
        type: 'floor_change',
        description: `Entering ${floorNames[targetFloor]}`,
        descriptionFil: `Papasok sa ${floorNames[targetFloor]}`,
        floorId: targetFloor,
        completed: false,
      });

      steps.push({
        id: `step-${stepId++}`,
        type: 'walk',
        description: `Continue from the stairs entrance`,
        descriptionFil: `Magpatuloy mula sa pasukan ng hagdan`,
        floorId: targetFloor,
        completed: false,
      });
    }

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
    const steps = generateNavigationSteps('first', floorId, officeId, targetOfficeName);
    
    const newNavigation: NavigationState = {
      floorId,
      officeId,
      officeName: targetOfficeName,
      steps,
      currentStepIndex: 0,
      isActive: true,
      isTransitioning: false,
    };

    setNavigation(null);
    setSelectedFloor('first');
    
    setTimeout(() => {
      setNavigation(newNavigation);
      const settings = getKioskSettings(kioskId);
      const startPos = settings.firstFloorPosition;
      
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

  return {
    navigation,
    startNavigation,
    clearNavigation,
    goToNextStep,
    completeCurrentStep,
    startFloorTransition,
    endFloorTransition
  };
};

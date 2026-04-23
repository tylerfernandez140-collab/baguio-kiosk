import { useEffect, useState, useRef } from 'react';
import { MoveVertical } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';

export function NavigationOverlay() {
  const { 
    navigation, 
    language, 
    goToNextStep, 
    completeCurrentStep,
    selectedFloor,
    setSelectedFloor,
    startFloorTransition,
    endFloorTransition,
  } = useKiosk();
  
  const transitionLockRef = useRef(false);

  // Handle floor transitions automatically
  useEffect(() => {
    if (!navigation?.isActive) return;

    const currentStep = navigation.steps[navigation.currentStepIndex];
    if (!currentStep) return;

    // Auto-advance through completed steps until we find one needing action
    if (currentStep.completed && !navigation.isTransitioning) {
      goToNextStep();
      return;
    }
    
    // Auto-complete stairs/floor_change steps that don't have walking paths
    if ((currentStep.type === 'stairs' || currentStep.type === 'floor_change') && !currentStep.completed && !navigation.isTransitioning) {
      completeCurrentStep();
      return;
    }

    // Check if we need to switch floors
    if (currentStep.floorId !== selectedFloor && !navigation.isTransitioning && !transitionLockRef.current) {
      console.log(`Auto-switching floor: ${selectedFloor} -> ${currentStep.floorId}`);
      transitionLockRef.current = true;
      startFloorTransition();
      
      // Synchronize with FloorTransitionOverlay durations - added extra buffer
      setTimeout(() => {
        setSelectedFloor(currentStep.floorId);
        
        setTimeout(() => {
          endFloorTransition();
          completeCurrentStep();
          
          // Keep the lock for a bit longer to prevent immediate double-switching
          setTimeout(() => {
            transitionLockRef.current = false;
          }, 1000);
        }, 2000); // Wait longer during the transition screen
      }, 1000); // Give more time for the initial fade-out
    }
  }, [navigation?.currentStepIndex, navigation?.isActive, navigation?.steps, selectedFloor]);

  if (!navigation?.isActive) return null;

  const currentStep = navigation.steps[navigation.currentStepIndex];
  const totalSteps = navigation.steps.length;
  const progress = ((navigation.currentStepIndex + 1) / totalSteps) * 100;
  const completedSteps = navigation.steps.filter(s => s.completed).length;

  const handleNextStep = () => {
    completeCurrentStep();
    goToNextStep();
  };

  const handleSkipToFloor = (floorId: string) => {
    setSelectedFloor(floorId);
  };

  // Auto-navigation mode - no UI, just handle step progression in background
  return null;
}

export default NavigationOverlay;

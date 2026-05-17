import { useEffect, useState, useRef } from 'react';
import { MoveVertical, ChevronLeft, ChevronRight } from 'lucide-react';
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
    jumpToStep,
    cameraAnimationEnabled,
  } = useKiosk();
  
  const lastStepIndexRef = useRef(navigation?.currentStepIndex || 0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Handle floor transitions automatically
  useEffect(() => {
    if (!navigation?.isActive) {
      isFirstRender.current = true;
      return;
    }

    const currentStep = navigation.steps[navigation.currentStepIndex];
    if (!currentStep) return;

    // 1. Auto-advance through completed steps
    if (currentStep.completed && !navigation.isTransitioning) {
      goToNextStep();
      return;
    }
    
    // 2. Auto-complete stairs/floor_change steps
    if ((currentStep.type === 'stairs' || currentStep.type === 'floor_change') && !currentStep.completed && !navigation.isTransitioning) {
      completeCurrentStep();
      return;
    }

    // 3. Handle Auto-Floor Switch
    // We only auto-switch if the step index has just changed, or it's the very first render of navigation
    // We also must switch if the current floor doesn't match and we are not locked (to catch missed transitions due to short animations)
    const stepChanged = lastStepIndexRef.current !== navigation.currentStepIndex;
    const needsFloorSwitch = currentStep.floorId !== selectedFloor;
    
    if (needsFloorSwitch && !navigation.isTransitioning) {
      if (transitionTimeoutRef.current) return;
      
      console.log(`Auto-switching floor to match instruction: ${selectedFloor} -> ${currentStep.floorId}`);
      
      // Wait 1.5s before starting the transition so the user can see they arrived at the stairs
      transitionTimeoutRef.current = setTimeout(() => {
        startFloorTransition(currentStep.floorId);
        
        // Fade out
        setTimeout(() => {
          setSelectedFloor(currentStep.floorId);
          
          // Fade in
          setTimeout(() => {
            endFloorTransition();
            transitionTimeoutRef.current = null;
          }, 1500);
        }, 1000);
      }, 1500);
    }

    lastStepIndexRef.current = navigation.currentStepIndex;
    isFirstRender.current = false;
    
    // 4. Auto-advance for simple view (no camera animation)
    let simpleViewTimer: NodeJS.Timeout | null = null;
    if (!cameraAnimationEnabled && !navigation.isTransitioning && currentStep.type === 'walk' && !currentStep.completed) {
      simpleViewTimer = setTimeout(() => {
        completeCurrentStep();
      }, 2000); // 2 seconds display time per floor
    }

    return () => {
      if (transitionTimeoutRef.current && !navigation.isActive) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      if (simpleViewTimer) {
        clearTimeout(simpleViewTimer);
      }
    };
  }, [navigation?.currentStepIndex, navigation?.isActive, navigation?.steps, navigation?.isTransitioning, selectedFloor, cameraAnimationEnabled]);

  if (!navigation?.isActive) return null;

  const FLOOR_ORDER = ['basement', 'first', 'second', 'third'];
  const involvedFloors = FLOOR_ORDER.filter(f => 
    navigation.steps.some(s => s.floorId === f)
  );
  
  const currentFloorIndex = involvedFloors.indexOf(selectedFloor);

  const handleNext = () => {
    if (currentFloorIndex < involvedFloors.length - 1) {
      const nextFloor = involvedFloors[currentFloorIndex + 1];
      startFloorTransition(nextFloor);
      setTimeout(() => {
        setSelectedFloor(nextFloor);
        
        // Find the walk step for this floor and jump to it
        const nextStepIndex = navigation.steps.findIndex(s => s.floorId === nextFloor && (s.type === 'walk' || s.type === 'arrived'));
        if (nextStepIndex !== -1) {
          jumpToStep(nextStepIndex);
        }

        setTimeout(() => {
          endFloorTransition();
        }, 1500);
      }, 1000);
    }
  };

  const handlePrev = () => {
    if (currentFloorIndex > 0) {
      const prevFloor = involvedFloors[currentFloorIndex - 1];
      startFloorTransition(prevFloor);
      setTimeout(() => {
        setSelectedFloor(prevFloor);
        
        // Find the walk step for this floor and jump to it
        const prevStepIndex = navigation.steps.findIndex(s => s.floorId === prevFloor && s.type === 'walk');
        if (prevStepIndex !== -1) {
          jumpToStep(prevStepIndex);
        }

        setTimeout(() => {
          endFloorTransition();
        }, 1500);
      }, 1000);
    }
  };

  const getFloorName = (id: string) => {
    if (language === 'en') {
      return id.charAt(0).toUpperCase() + id.slice(1);
    } else {
      const names: Record<string, string> = {
        basement: 'Basement',
        first: 'Unang Palapag',
        second: 'Ikalawang Palapag',
        third: 'Ikatlong Palapag'
      };
      return names[id] || id;
    }
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-white dark:bg-gray-800 p-3 px-6 rounded-2xl border-2 border-green-500 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={handlePrev}
        disabled={currentFloorIndex <= 0 || navigation.isTransitioning}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:hover:bg-transparent rounded-xl text-gray-700 dark:text-gray-200 transition-colors"
        title="Previous Floor"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center min-w-[140px]">
        <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-widest">
          {language === 'en' ? 'NAVIGATE FLOORS' : 'LIPAT PALAPAG'}
        </span>
        <span className="text-base font-bold text-gray-800 dark:text-white">
          {getFloorName(selectedFloor)}
        </span>
      </div>

      <button 
        onClick={handleNext}
        disabled={currentFloorIndex >= involvedFloors.length - 1 || navigation.isTransitioning}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:hover:bg-transparent rounded-xl text-gray-700 dark:text-gray-200 transition-colors"
        title="Next Floor"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default NavigationOverlay;

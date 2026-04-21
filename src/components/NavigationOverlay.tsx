import { useEffect, useState } from 'react';
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
  
  const [showFloorTransition, setShowFloorTransition] = useState(false);

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
    if (currentStep.floorId !== selectedFloor && !navigation.isTransitioning) {
      startFloorTransition();
      setShowFloorTransition(true);
      
      // Fade out, switch floor, fade in
      setTimeout(() => {
        setSelectedFloor(currentStep.floorId);
        
        setTimeout(() => {
          setShowFloorTransition(false);
          endFloorTransition();
          completeCurrentStep();
        }, 800);
      }, 600);
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

  // Floor transition overlay
  if (showFloorTransition) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-500">
        <div className="text-center animate-pulse">
          <MoveVertical className="w-16 h-16 text-white mx-auto mb-4" />
          <p className="text-white text-xl font-bold">
            {language === 'en' ? 'Changing Floor...' : 'Nagpapalit ng Palapag...'}
          </p>
          <p className="text-white/70 text-sm mt-2">
            {language === 'en' 
              ? `Going to ${currentStep?.floorId || 'destination'}` 
              : `Papunta sa ${currentStep?.floorId || 'destinasyon'}`}
          </p>
        </div>
      </div>
    );
  }

  // Auto-navigation mode - no UI, just handle step progression in background
  return null;
}

export default NavigationOverlay;

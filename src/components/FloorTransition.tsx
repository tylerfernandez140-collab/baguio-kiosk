import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, DoorOpen, MoveVertical } from 'lucide-react';
import { useKiosk } from '../context/KioskContext';

interface FloorTransitionProps {
  isActive: boolean;
  fromFloor?: string;
  toFloor?: string;
  onComplete?: () => void;
}

const floorNames: Record<string, { en: string; fil: string }> = {
  first: { en: 'First Floor', fil: 'Unang Palapag' },
  second: { en: 'Second Floor', fil: 'Ikalawang Palapag' },
  third: { en: 'Third Floor', fil: 'Ikatlong Palapag' },
  basement: { en: 'Basement', fil: 'Silong' },
};

export function FloorTransitionOverlay({ 
  isActive, 
  fromFloor = 'first', 
  toFloor = 'second',
  onComplete 
}: FloorTransitionProps) {
  const { language } = useKiosk();
  const [phase, setPhase] = useState<'idle' | 'fading-out' | 'transitioning' | 'fading-in' | 'complete'>('idle');

  useEffect(() => {
    if (isActive && phase === 'idle') {
      // Start the transition sequence
      setPhase('fading-out');
      
      // After fade out, show transition screen
      const fadeOutTimer = setTimeout(() => {
        setPhase('transitioning');
        
        // Hold transition screen
        const transitionTimer = setTimeout(() => {
          setPhase('fading-in');
          
          // Fade back in
          const fadeInTimer = setTimeout(() => {
            setPhase('complete');
            onComplete?.();
          }, 800);
          
          return () => clearTimeout(fadeInTimer);
        }, 1500);
        
        return () => clearTimeout(transitionTimer);
      }, 600);
      
      return () => clearTimeout(fadeOutTimer);
    }
    
    if (!isActive) {
      setPhase('idle');
    }
  }, [isActive, fromFloor, toFloor, onComplete, phase]);

  if (!isActive || phase === 'idle' || phase === 'complete') return null;

  const isGoingUp = ['second', 'third'].includes(toFloor) && fromFloor !== 'basement' ||
                    (toFloor === 'first' && fromFloor === 'basement');
  const isStairs = true; // Always use stairs icon for now

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${
        phase === 'fading-out' ? 'bg-black/0' :
        phase === 'transitioning' ? 'bg-black' :
        phase === 'fading-in' ? 'bg-black/80' :
        'bg-transparent'
      }`}
      style={{
        backdropFilter: phase === 'fading-out' || phase === 'fading-in' ? 'blur(4px)' : 'none',
      }}
    >
      {/* Fade overlay */}
      {(phase === 'fading-out' || phase === 'fading-in') && (
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            phase === 'fading-out' ? 'opacity-0 animate-fade-out' : 'opacity-80 animate-fade-in'
          }`}
        />
      )}

      {/* Transition content */}
      {phase === 'transitioning' && (
        <div className="relative z-10 text-center animate-fade-in-up">
          {/* Floor indicator circles */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* From Floor */}
            <div className="flex flex-col items-center animate-fade-out-left">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                <span className="text-white text-2xl font-bold">
                  {fromFloor === 'first' && '1'}
                  {fromFloor === 'second' && '2'}
                  {fromFloor === 'third' && '3'}
                  {fromFloor === 'basement' && 'B'}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {language === 'en' ? floorNames[fromFloor].en : floorNames[fromFloor].fil}
              </span>
            </div>

            {/* Arrow/Stairs Animation */}
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-2">
                {true ? (
                  isGoingUp ? (
                    <ArrowUp className="w-8 h-8 text-white" />
                  ) : (
                    <ArrowDown className="w-8 h-8 text-white" />
                  )
                ) : (
                  <DoorOpen className="w-8 h-8 text-white" />
                )}
              </div>
              <MoveVertical className="w-12 h-12 text-white/50" />
            </div>

            {/* To Floor */}
            <div className="flex flex-col items-center animate-fade-in-right">
              <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-2 animate-bounce-subtle">
                <span className="text-white text-2xl font-bold">
                  {toFloor === 'first' && '1'}
                  {toFloor === 'second' && '2'}
                  {toFloor === 'third' && '3'}
                  {toFloor === 'basement' && 'B'}
                </span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                {language === 'en' ? floorNames[toFloor].en : floorNames[toFloor].fil}
              </span>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in">
            {language === 'en' 
              ? (isGoingUp ? 'Going Up...' : 'Going Down...')
              : (isGoingUp ? 'Papakyat...' : 'Pabababa...')
            }
          </h2>
          <p className="text-white/70 text-lg animate-fade-in-delay">
            {language === 'en'
              ? `Please use the stairs to go to the ${floorNames[toFloor].en}`
              : `Paki gamitin ang hagdan para pumunta sa ${floorNames[toFloor].fil}`
            }
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-200" />
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-300" />
            <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse delay-400" />
          </div>
        </div>
      )}
    </div>
  );
}

// Simpler inline floor transition indicator (for corner display)
export function FloorTransitionIndicator() {
  const { navigation, selectedFloor, language } = useKiosk();
  const [showIndicator, setShowIndicator] = useState(false);
  const [targetFloor, setTargetFloor] = useState<string | null>(null);

  useEffect(() => {
    if (navigation?.isActive && navigation.floorId !== selectedFloor) {
      setTargetFloor(navigation.floorId);
      setShowIndicator(true);
    } else {
      setShowIndicator(false);
    }
  }, [navigation, selectedFloor]);

  if (!showIndicator || !targetFloor) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
        <MoveVertical className="w-6 h-6 animate-bounce" />
        <div>
          <p className="text-xs font-medium text-white/80">
            {language === 'en' ? 'Go to' : 'Pumunta sa'}
          </p>
          <p className="font-bold text-sm">
            {language === 'en' ? floorNames[targetFloor].en : floorNames[targetFloor].fil}
          </p>
        </div>
        <ArrowUp className="w-5 h-5 animate-pulse" />
      </div>
    </div>
  );
}

export default FloorTransitionOverlay;

import React from 'react';
import { RotateCcw, CheckCircle } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';

interface NavigationCompletePopupProps {
  navigation: {
    isActive: boolean;
    officeName: string;
    steps: { type: string; completed: boolean }[];
    currentStepIndex: number;
  };
  onRepeat: () => void;
  onDone: () => void;
}

export function NavigationCompletePopup({ navigation, onRepeat, onDone }: NavigationCompletePopupProps) {
  const { language } = useKiosk();
  
  // Check if we've reached the final step (arrived)
  const currentStep = navigation.steps[navigation.currentStepIndex];
  const hasArrived = currentStep?.type === 'arrived';
  
  if (!hasArrived) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-start justify-center pt-4 animate-fade-in" style={{ isolation: 'isolate' }}>
      {/* Backdrop to block 3D elements */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 max-w-xs w-full mx-4 text-center border-2 border-green-500 relative z-10">
        {/* Success Icon */}
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          {language === 'en' ? 'You Have Arrived!' : 'Nakarating Ka Na!'}
        </h2>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRepeat}
            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-lg transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'en' ? 'Repeat' : 'Ulitin'}
          </button>
          <button
            onClick={onDone}
            className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-all text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {language === 'en' ? 'Done' : 'Tapos'}
          </button>
        </div>
      </div>
    </div>
  );
}

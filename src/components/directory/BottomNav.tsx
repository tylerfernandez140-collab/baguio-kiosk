import React from 'react';
import { categories } from './constants';

interface BottomNavProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onNavigate: (page: string) => void;
}

export const BottomNav = ({ selectedCategory, setSelectedCategory, onNavigate }: BottomNavProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center py-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => {
                if (category.id === 'home') {
                  onNavigate('hero'); // Navigate to home screen
                } else {
                  setSelectedCategory(category.id);
                }
              }}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

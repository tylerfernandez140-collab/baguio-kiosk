import React from 'react';
import { Search, X } from 'lucide-react';

interface Office {
  id: string;
  name: string;
  floor: string;
  floorName: string;
}

interface SearchOverlayProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredOffices: Office[];
  handleOfficeSelect: (office: Office) => void;
}

export const SearchOverlay = ({
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  filteredOffices,
  handleOfficeSelect
}: SearchOverlayProps) => {
  return (
    <div className="absolute top-8 right-8 z-50">
      {!isSearchOpen ? (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 text-green-600"
        >
          <Search className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-80 max-h-[70vh] flex flex-col border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search first floor offices..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredOffices.length > 0 ? (
              <div className="space-y-1">
                {filteredOffices.map((office) => (
                  <button
                    key={`${office.floor}-${office.id}`}
                    onClick={() => handleOfficeSelect(office)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                  >
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-green-600 transition-colors truncate">
                      {String(office.name).replace(/\\n/g, '\n').replace(/\n/g, ' ')}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {office.floorName}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                No offices found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

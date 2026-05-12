import React from 'react';
import { Building, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
      active ? 'bg-pine text-white shadow-lg shadow-pine/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-pine rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-pine/20">B</div>
        <span className="font-bold text-xl tracking-tight">Admin Kiosk</span>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem icon={<Building size={18} />} label="Manage Offices" active={activeTab === 'offices'} onClick={() => setActiveTab('offices')} />
      </nav>

      <Button variant="ghost" className="justify-start gap-3 text-neutral-400 hover:text-white hover:bg-neutral-800" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </Button>
    </aside>
  );
};

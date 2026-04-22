import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './Admin/components/Sidebar';
import { DashboardTab } from './Admin/tabs/DashboardTab';
import { OfficesTab } from './Admin/tabs/OfficesTab';
import { useOfficeManagement } from './Admin/hooks/useOfficeManagement';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom hook containing all the data fetching and business logic
  const officesHook = useOfficeManagement(user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          <DashboardTab 
            totalOffices={officesHook.displayOffices.length} 
            isRefreshing={officesHook.isRefreshing}
            onRefresh={officesHook.fetchOffices}
          />
        ) : activeTab === 'offices' ? (
          <OfficesTab officesHook={officesHook} />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Select a section from the sidebar to continue.
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

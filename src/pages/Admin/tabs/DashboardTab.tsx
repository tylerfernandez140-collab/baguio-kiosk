import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Users, ChevronRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';

interface DashboardTabProps {
  totalOffices: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DashboardTab = ({ totalOffices, isRefreshing, onRefresh }: DashboardTabProps) => {
  return (
    <>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-neutral-400">Here's what's happening with the Baguio City Hall Kiosk.</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700 gap-2" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw size={16} />}
            Refresh Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500">Add New Entry</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Offices" value={totalOffices.toString()} change="+3 this month" />
        <StatCard title="Daily Searches" value="1,284" change="+12% from yesterday" />
        <StatCard title="Active Kiosks" value="8" change="All systems go" />
      </div>

      <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <Button variant="link" className="text-blue-400 p-0">View All <ChevronRight size={16} /></Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-neutral-800/40 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-medium">Mayor's Office Updated</h4>
                  <p className="text-sm text-neutral-500">Room 102 details were modified by admin</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

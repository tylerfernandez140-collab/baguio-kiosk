import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Settings, LogOut, ChevronRight, Loader2, Search, Edit2, Check, X, Building, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { cityHallFloors, Office } from '@/data/kioskData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Admin = () => {
  const { user, loading } = useAuth();
  const { labels, updateLabel, offices, refreshOffices } = useKiosk();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabelKey, setEditingLabelKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localOffices, setLocalOffices] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchOffices();
  }, [user]);

  const fetchOffices = async () => {
    if (!user) return;
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from('offices')
      .select('*');

    if (error) {
      console.error('Error fetching offices:', error);
      toast.error(`Database Error: ${error.message}`);
    } else {
      console.log('Fetched offices:', data);
      setLocalOffices(data || []);
    }
    setIsRefreshing(false);
    refreshOffices(); // Also refresh context
  };

  // Keep local offices in sync with context offices for editing
  useEffect(() => {
    if (offices.length > 0 && !isRefreshing) {
      setLocalOffices(offices);
    }
  }, [offices, isRefreshing]);

  const handleDeleteOffice = async (id: string) => {
    if (!confirm('Are you sure you want to remove this office from the directory? (The map label will remain)')) return;

    const { error } = await supabase
      .from('offices')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete office');
    } else {
      toast.success('Office removed from directory');
      refreshOffices();
    }
  };

  const handleAddOffice = async (floorId: string, name: string) => {
    const { data, error } = await supabase
      .from('offices')
      .insert({
        floor_id: floorId,
        name: name,
        description: '',
        officer: ''
      })
      .select();

    if (error) {
      toast.error('Failed to add office');
    } else {
      toast.success('Office registered in directory');
      if (data && data[0]) {
        await refreshOffices();
        setEditingId(data[0].id);
      } else {
        refreshOffices();
      }
    }
  };

  const handleSaveEdit = async (id: string) => {
    const officeToUpdate = displayOffices.find(off => off.id === id);
    if (!officeToUpdate) return;

    const { error } = await supabase
      .from('offices')
      .update({
        officer: officeToUpdate.officer,
        description: officeToUpdate.description,
        image_url: officeToUpdate.image_url
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating office:', error);
      toast.error('Failed to save changes');
    } else {
      setEditingId(null);
      toast.success('Office updated successfully');
    }
  };

  const handleSave3DLabel = (floorId: string, key: string) => {
    updateLabel(floorId, key, editValue);
    setEditingLabelKey(null);
    toast.success('3D Map Label updated successfully');
  };

  const displayOffices = localOffices.length > 0 ? localOffices : offices;

  const filteredOffices = useMemo(() => {
    return displayOffices.filter(off => 
      String(off.name).toLowerCase().includes(searchQuery.toLowerCase()) || 
      (off.officer && String(off.officer).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [displayOffices, searchQuery]);

  const handleImageUpload = async (file: File, officeId: string) => {
    try {
      // Check file size (limit to 1MB for database storage)
      if (file.size > 1024 * 1024) {
        toast.error('Image is too large. Please use an image under 1MB.');
        return null;
      }

      setUploadingStatus(prev => ({ ...prev, [officeId]: 10 }));
      
      const reader = new FileReader();
      
      // Wrap FileReader in a promise
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        
        // Simulate progress for UI feel
        let progress = 10;
        const interval = setInterval(() => {
          progress += 20;
          if (progress >= 90) clearInterval(interval);
          setUploadingStatus(prev => ({ ...prev, [officeId]: progress }));
        }, 50);

        reader.readAsDataURL(file);
      });

      setUploadingStatus(prev => ({ ...prev, [officeId]: 100 }));

      // Update local state immediately with Base64 data
      setLocalOffices(prev => 
        prev.map(off => off.id === officeId ? { ...off, image_url: base64Data } : off)
      );
      
      toast.success('Image processed successfully');
      
      // Clear status after a delay
      setTimeout(() => {
        setUploadingStatus(prev => {
          const next = { ...prev };
          delete next[officeId];
          return next;
        });
      }, 1000);

      return base64Data;
    } catch (error: any) {
      setUploadingStatus(prev => {
        const next = { ...prev };
        delete next[officeId];
        return next;
      });
      console.error('Processing error:', error);
      toast.error(`Processing failed: ${error.message}`);
      return null;
    }
  };

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
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">B</div>
          <span className="font-bold text-xl tracking-tight">Admin Kiosk</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Building size={18} />} 
            label="Manage Offices" 
            active={activeTab === 'offices'}
            onClick={() => setActiveTab('offices')}
          />
          <NavItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <Button 
          variant="ghost" 
          className="justify-start gap-3 text-neutral-400 hover:text-white hover:bg-neutral-800"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          <>
            <header className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
                <p className="text-neutral-400">Here's what's happening with the Baguio City Hall Kiosk.</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700 gap-2"
                  onClick={fetchOffices}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw size={16} />}
                  Refresh Data
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500">Add New Entry</Button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard title="Total Offices" value={displayOffices.length.toString()} change="+3 this month" />
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
        ) : activeTab === 'offices' ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Building className="text-blue-500" />
                Office Directory Management
              </CardTitle>
              <CardDescription>
                Linked to 3D Map Labels on your floors. Total database entries: {displayOffices.length}
              </CardDescription>
            </div>
          </CardHeader>
            <header className="flex justify-between items-center mb-8">
              <Button className="bg-blue-600 hover:bg-blue-500 flex gap-2">
                <Building size={18} />
                Add New Office
              </Button>
            </header>

            <Tabs defaultValue="offices" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
                  <TabsTrigger value="offices" className="data-[state=active]:bg-blue-600">Offices List</TabsTrigger>
                  <TabsTrigger value="labels" className="data-[state=active]:bg-blue-600">3D Map Labels</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="offices">
                <Tabs defaultValue="floor1" className="w-full">
                  <TabsList className="bg-neutral-800 border border-neutral-700/50 p-1 mb-6">
                    <TabsTrigger value="floor0" className="data-[state=active]:bg-neutral-700">Basement</TabsTrigger>
                    <TabsTrigger value="floor1" className="data-[state=active]:bg-neutral-700">First Floor</TabsTrigger>
                    <TabsTrigger value="floor2" className="data-[state=active]:bg-neutral-700">Second Floor</TabsTrigger>
                    <TabsTrigger value="floor3" className="data-[state=active]:bg-neutral-700">Third Floor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="floor0" className="mt-0 outline-none">
                    <OfficeList 
                      offices={filteredOffices.filter(o => String(o.floor_id).toLowerCase() === 'basement')} 
                      floorId="basement"
                      editingId={editingId}
                      setEditingId={setEditingId}
                      setOffices={setLocalOffices}
                      handleSaveEdit={handleSaveEdit}
                      handleAddOffice={handleAddOffice}
                      refreshOffices={refreshOffices}
                      handleImageUpload={handleImageUpload}
                      uploadingStatus={uploadingStatus}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="floor1" className="mt-0 outline-none">
                    <OfficeList 
                      offices={filteredOffices.filter(o => ['first', 'ground', '1'].includes(String(o.floor_id).toLowerCase()))} 
                      floorId="first"
                      editingId={editingId}
                      setEditingId={setEditingId}
                      setOffices={setLocalOffices}
                      handleSaveEdit={handleSaveEdit}
                      handleAddOffice={handleAddOffice}
                      refreshOffices={refreshOffices}
                      handleImageUpload={handleImageUpload}
                      uploadingStatus={uploadingStatus}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </TabsContent>
                  
                  <TabsContent value="floor2" className="mt-0 outline-none">
                    <OfficeList 
                      offices={filteredOffices.filter(o => String(o.floor_id).toLowerCase() === 'second' || String(o.floor_id) === '2')} 
                      floorId="second"
                      editingId={editingId}
                      setEditingId={setEditingId}
                      setOffices={setLocalOffices}
                      handleSaveEdit={handleSaveEdit}
                      handleAddOffice={handleAddOffice}
                      refreshOffices={refreshOffices}
                      handleImageUpload={handleImageUpload}
                      uploadingStatus={uploadingStatus}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="floor3" className="mt-0 outline-none">
                    <OfficeList 
                      offices={filteredOffices.filter(o => String(o.floor_id).toLowerCase() === 'third' || String(o.floor_id) === '3')} 
                      floorId="third"
                      editingId={editingId}
                      setEditingId={setEditingId}
                      setOffices={setLocalOffices}
                      handleSaveEdit={handleSaveEdit}
                      handleAddOffice={handleAddOffice}
                      refreshOffices={refreshOffices}
                      handleImageUpload={handleImageUpload}
                      uploadingStatus={uploadingStatus}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="labels">
                <Tabs defaultValue="floor1">
                  <TabsList className="bg-neutral-800 border border-neutral-700/50 p-1 mb-6">
                    <TabsTrigger value="floor0" className="data-[state=active]:bg-neutral-700">Basement</TabsTrigger>
                    <TabsTrigger value="floor1" className="data-[state=active]:bg-neutral-700">First Floor</TabsTrigger>
                    <TabsTrigger value="floor2" className="data-[state=active]:bg-neutral-700">Second Floor</TabsTrigger>
                    <TabsTrigger value="floor3" className="data-[state=active]:bg-neutral-700">Third Floor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="floor0">
                    <LabelGrid 
                      floorId="basement" 
                      floorLabels={labels.basement} 
                      editingLabelKey={editingLabelKey}
                      setEditingLabelKey={setEditingLabelKey}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      handleSave3DLabel={handleSave3DLabel}
                    />
                  </TabsContent>

                  <TabsContent value="floor1">
                    <LabelGrid 
                      floorId="first" 
                      floorLabels={labels.first} 
                      editingLabelKey={editingLabelKey}
                      setEditingLabelKey={setEditingLabelKey}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      handleSave3DLabel={handleSave3DLabel}
                    />
                  </TabsContent>

                  <TabsContent value="floor2">
                    <LabelGrid 
                      floorId="second" 
                      floorLabels={labels.second} 
                      editingLabelKey={editingLabelKey}
                      setEditingLabelKey={setEditingLabelKey}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      handleSave3DLabel={handleSave3DLabel}
                    />
                  </TabsContent>

                  <TabsContent value="floor3">
                    <LabelGrid 
                      floorId="third" 
                      floorLabels={labels.third} 
                      editingLabelKey={editingLabelKey}
                      setEditingLabelKey={setEditingLabelKey}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      handleSave3DLabel={handleSave3DLabel}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Select a section from the sidebar to continue.
          </div>
        )}
      </main>
    </div>
  );
};

const OfficeList = ({ 
  offices, 
  floorId,
  editingId, 
  setEditingId, 
  setOffices, 
  handleSaveEdit, 
  handleAddOffice,
  refreshOffices,
  handleImageUpload,
  uploadingStatus,
  searchQuery,
  setSearchQuery 
}: any) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <Input 
            placeholder="Search directory entries..." 
            className="pl-10 bg-neutral-900 border-neutral-800 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-[250px] text-neutral-400 font-semibold">Office Name (From Map)</TableHead>
              <TableHead className="w-[200px] text-neutral-400 font-semibold">Officer In Charge</TableHead>
              <TableHead className="text-neutral-400 font-semibold">Description</TableHead>
              <TableHead className="w-[120px] text-right text-neutral-400 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offices.map((office: any) => (
              <TableRow key={office.id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                <TableCell className="font-medium align-top py-4">
                  <div className="text-white flex flex-col gap-1">
                    <span>{String(office.name).replace(/\\n/g, ' ')}</span>
                  </div>
                  {office.image_url && (
                    <div className="mt-1 text-[10px] text-green-500 flex items-center gap-1">
                      <Check size={10} /> Image Linked
                    </div>
                  )}
                </TableCell>
                
                <TableCell className="align-top py-4">
                  {editingId === office.id ? (
                    <div className="flex flex-col gap-2">
                      <Input 
                        value={office.officer || ''}
                        onChange={(e) => setOffices((prev: any[]) => prev.map(o => o.id === office.id ? { ...o, officer: e.target.value } : o))}
                        className="bg-neutral-800 border-neutral-700 h-8 text-xs"
                        placeholder="Officer name"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="relative group">
                          {uploadingStatus[office.id] !== undefined ? (
                            <div className="w-full h-12 border border-neutral-800 rounded flex flex-col items-center justify-center p-2 gap-2">
                              <Progress value={uploadingStatus[office.id]} className="h-1 animate-pulse" />
                              <span className="text-[10px] text-blue-400 font-medium">
                                {uploadingStatus[office.id] === 100 ? 'Finalizing...' : 'Uploading...'}
                              </span>
                            </div>
                          ) : office.image_url ? (
                            <div className="relative w-full h-12 rounded border border-neutral-700 overflow-hidden">
                              <img src={office.image_url} alt="Office" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <label className="cursor-pointer text-[10px] text-white flex items-center gap-1">
                                  <Upload size={10} /> Change
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, office.id);
                                    }}
                                  />
                                </label>
                              </div>
                              {/* Success indicator */}
                              <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
                                <Check size={8} className="text-white" />
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-12 border-2 border-dashed border-neutral-800 rounded flex flex-col items-center justify-center gap-1 text-neutral-500 hover:border-neutral-700 hover:text-neutral-400 cursor-pointer transition-all">
                              <ImageIcon size={14} />
                              <span className="text-[10px]">Upload Photo</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, office.id);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-neutral-300 text-sm">{office.officer || '—'}</span>
                  )}
                </TableCell>
                
                <TableCell className="align-top py-4">
                  {editingId === office.id ? (
                    <textarea 
                      value={office.description || ''}
                      onChange={(e) => setOffices((prev: any[]) => prev.map(o => o.id === office.id ? { ...o, description: e.target.value } : o))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs text-white resize-none h-20 outline-none focus:border-blue-500"
                      placeholder="Add description..."
                    />
                  ) : (
                    <p className="text-neutral-500 text-sm line-clamp-2">{office.description || 'No description yet.'}</p>
                  )}
                </TableCell>
                
                <TableCell className="text-right align-top py-4">
                  <div className="flex justify-end gap-1">
                    {editingId === office.id ? (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleSaveEdit(office.id)}>
                          <Check size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400" onClick={() => { setEditingId(null); refreshOffices(); }}>
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-white" onClick={() => setEditingId(office.id)}>
                        <Edit2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {offices.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-neutral-500 italic">
                  No directory entries found for this floor.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const LabelGrid = ({ 
  floorId, 
  floorLabels, 
  editingLabelKey, 
  setEditingLabelKey, 
  editValue, 
  setEditValue, 
  handleSave3DLabel 
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Object.entries(floorLabels || {}).map(([key, label]: [string, any]) => (
      <Card key={key} className="bg-neutral-900 border-neutral-800 group hover:border-neutral-700 transition-colors">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-tighter">{key}</span>
              {editingLabelKey !== key && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => { setEditingLabelKey(key); setEditValue(label); }}
                >
                  <Edit2 size={14} />
                </Button>
              )}
            </div>
            
            {editingLabelKey === key ? (
              <div className="flex flex-col gap-2">
                <textarea 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-neutral-800 border-blue-500 rounded p-2 text-sm text-white resize-none h-16 outline-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="h-7 bg-green-600 px-2" onClick={() => handleSave3DLabel(floorId, key)}>
                    <Check size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingLabelKey(null)}>
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-white whitespace-pre-wrap">{label || '—'}</p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, change }: { title: string; value: string; change: string }) => (
  <Card className="bg-neutral-900 border-neutral-800">
    <CardHeader className="pb-2">
      <CardDescription className="text-neutral-400">{title}</CardDescription>
      <CardTitle className="text-3xl font-bold">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-blue-400 font-medium">{change}</p>
    </CardContent>
  </Card>
);

export default Admin;

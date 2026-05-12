import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useKiosk } from '@/context/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Loader2, Search, Edit2, Check, X, Building, Upload, Image as ImageIcon } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('offices');
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

  const handleSave3DLabel = async (floorId: string, key: string) => {
    try {
      await updateLabel(floorId, key, editValue);
      setEditingLabelKey(null);
      toast.success('3D Map Label updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes to database');
    }
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
        <Loader2 className="w-8 h-8 text-pine animate-spin" />
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
          <div className="w-8 h-8 bg-pine rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-pine/20">B</div>
          <span className="font-bold text-xl tracking-tight">Admin Kiosk</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <NavItem 
            icon={<Building size={18} />} 
            label="Manage Offices" 
            active={activeTab === 'offices'}
            onClick={() => setActiveTab('offices')}
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
        {activeTab === 'offices' ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Building className="text-pine" />
                Office Directory Management
              </CardTitle>
              <CardDescription>
                Linked to 3D Map Labels on your floors. Total database entries: {displayOffices.length}
              </CardDescription>
            </div>
          </CardHeader>


            <Tabs defaultValue="offices" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
                  <TabsTrigger value="offices" className="data-[state=active]:bg-pine text-white">Offices List</TabsTrigger>
                  <TabsTrigger value="labels" className="data-[state=active]:bg-pine text-white">3D Map Labels</TabsTrigger>
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
          <div className="flex items-center justify-center h-full text-neutral-500 italic">
            Please use the sidebar to manage your kiosk directory.
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
            className="pl-10 bg-neutral-900 border-neutral-800 focus:ring-pine"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-[300px] text-neutral-400 font-semibold">Office Name (From Map)</TableHead>
              <TableHead className="text-neutral-400 font-semibold">Directory Image</TableHead>
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
                    <div className="flex flex-col gap-2 max-w-[200px]">
                      <div className="relative group">
                        {uploadingStatus[office.id] !== undefined ? (
                          <div className="w-full h-24 border border-neutral-800 rounded flex flex-col items-center justify-center p-2 gap-2 bg-neutral-900/50">
                            <Progress value={uploadingStatus[office.id]} className="h-1 w-full animate-pulse" />
                            <span className="text-[10px] text-sky font-medium">
                              {uploadingStatus[office.id] === 100 ? 'Finalizing...' : 'Uploading...'}
                            </span>
                          </div>
                        ) : office.image_url ? (
                          <div className="relative w-full h-24 rounded border border-neutral-700 overflow-hidden shadow-xl bg-neutral-950">
                            <img src={office.image_url} alt="Office" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <label className="cursor-pointer text-xs text-white flex items-center gap-2 font-medium">
                                <Upload size={14} /> Change Image
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
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                              <Check size={10} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-24 border-2 border-dashed border-neutral-800 rounded flex flex-col items-center justify-center gap-2 text-neutral-500 hover:border-pine hover:text-pine hover:bg-pine/5 cursor-pointer transition-all">
                            <ImageIcon size={20} />
                            <span className="text-xs font-medium">Upload Photo</span>
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
                  ) : (
                    <div className="flex items-center gap-4">
                      {office.image_url ? (
                        <div className="w-16 h-16 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950">
                          <img src={office.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg border border-neutral-800 bg-neutral-900/50 flex items-center justify-center text-neutral-700">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span className="text-neutral-500 text-xs italic">{office.image_url ? 'Image uploaded' : 'No image yet'}</span>
                    </div>
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
                <TableCell colSpan={3} className="h-24 text-center text-neutral-500 italic">
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
                  className="bg-neutral-800 border-pine rounded p-2 text-sm text-white resize-none h-16 outline-none"
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
      active ? 'bg-pine text-white shadow-lg shadow-pine/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
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
      <p className="text-sm text-gold font-medium">{change}</p>
    </CardContent>
  </Card>
);

export default Admin;

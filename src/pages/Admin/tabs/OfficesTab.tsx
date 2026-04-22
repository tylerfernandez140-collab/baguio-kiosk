import React, { useState } from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { OfficeList } from '../components/OfficeList';
import { LabelGrid } from '../components/LabelGrid';
import { useKiosk } from '@/context/KioskContext';
import { toast } from 'sonner';

interface OfficesTabProps {
  officesHook: any;
}

export const OfficesTab = ({ officesHook }: OfficesTabProps) => {
  const { labels, updateLabel, refreshOffices } = useKiosk();
  const [editingLabelKey, setEditingLabelKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const {
    displayOffices, filteredOffices, editingId, setEditingId,
    setLocalOffices, handleSaveEdit, handleAddOffice,
    handleImageUpload, uploadingStatus, searchQuery, setSearchQuery
  } = officesHook;

  const handleSave3DLabel = (floorId: string, key: string) => {
    updateLabel(floorId, key, editValue);
    setEditingLabelKey(null);
    toast.success('3D Map Label updated successfully');
  };

  const renderOfficeList = (floorMatch: (o: any) => boolean, floorId: string) => (
    <OfficeList 
      offices={filteredOffices.filter(floorMatch)} 
      floorId={floorId}
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
  );

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
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
            
            <TabsContent value="floor0" className="mt-0 outline-none">{renderOfficeList((o) => String(o.floor_id).toLowerCase() === 'basement', 'basement')}</TabsContent>
            <TabsContent value="floor1" className="mt-0 outline-none">{renderOfficeList((o) => ['first', 'ground', '1'].includes(String(o.floor_id).toLowerCase()), 'first')}</TabsContent>
            <TabsContent value="floor2" className="mt-0 outline-none">{renderOfficeList((o) => String(o.floor_id).toLowerCase() === 'second' || String(o.floor_id) === '2', 'second')}</TabsContent>
            <TabsContent value="floor3" className="mt-0 outline-none">{renderOfficeList((o) => String(o.floor_id).toLowerCase() === 'third' || String(o.floor_id) === '3', 'third')}</TabsContent>
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
            
            <TabsContent value="floor0"><LabelGrid floorId="basement" floorLabels={labels.basement} editingLabelKey={editingLabelKey} setEditingLabelKey={setEditingLabelKey} editValue={editValue} setEditValue={setEditValue} handleSave3DLabel={handleSave3DLabel} /></TabsContent>
            <TabsContent value="floor1"><LabelGrid floorId="first" floorLabels={labels.first} editingLabelKey={editingLabelKey} setEditingLabelKey={setEditingLabelKey} editValue={editValue} setEditValue={setEditValue} handleSave3DLabel={handleSave3DLabel} /></TabsContent>
            <TabsContent value="floor2"><LabelGrid floorId="second" floorLabels={labels.second} editingLabelKey={editingLabelKey} setEditingLabelKey={setEditingLabelKey} editValue={editValue} setEditValue={setEditValue} handleSave3DLabel={handleSave3DLabel} /></TabsContent>
            <TabsContent value="floor3"><LabelGrid floorId="third" floorLabels={labels.third} editingLabelKey={editingLabelKey} setEditingLabelKey={setEditingLabelKey} editValue={editValue} setEditValue={setEditValue} handleSave3DLabel={handleSave3DLabel} /></TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </>
  );
};

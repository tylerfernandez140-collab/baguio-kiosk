import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Check, X, Edit2, Upload, Image as ImageIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OfficeListProps {
  offices: any[];
  floorId: string;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  setOffices: React.Dispatch<React.SetStateAction<any[]>>;
  handleSaveEdit: (id: string) => void;
  handleAddOffice: (floorId: string, name: string) => void;
  refreshOffices: () => void;
  handleImageUpload: (file: File, officeId: string) => void;
  uploadingStatus: Record<string, number>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const OfficeList = ({ 
  offices, floorId, editingId, setEditingId, setOffices, handleSaveEdit, 
  refreshOffices, handleImageUpload, uploadingStatus, searchQuery, setSearchQuery 
}: OfficeListProps) => {
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
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleSaveEdit(office.id)}><Check size={16} /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400" onClick={() => { setEditingId(null); refreshOffices(); }}><X size={16} /></Button>
                      </>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-white" onClick={() => setEditingId(office.id)}><Edit2 size={16} /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {offices.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-neutral-500 italic">No directory entries found for this floor.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

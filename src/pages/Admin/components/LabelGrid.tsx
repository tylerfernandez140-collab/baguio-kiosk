import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X } from 'lucide-react';

interface LabelGridProps {
  floorId: string;
  floorLabels: Record<string, string>;
  editingLabelKey: string | null;
  setEditingLabelKey: (key: string | null) => void;
  editValue: string;
  setEditValue: (value: string) => void;
  handleSave3DLabel: (floorId: string, key: string) => void;
}

export const LabelGrid = ({ 
  floorId, floorLabels, editingLabelKey, setEditingLabelKey, 
  editValue, setEditValue, handleSave3DLabel 
}: LabelGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Object.entries(floorLabels || {}).map(([key, label]) => (
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
                  onClick={() => { setEditingLabelKey(key); setEditValue(label as string); }}
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
                  <Button size="sm" className="h-7 bg-green-600 px-2" onClick={() => handleSave3DLabel(floorId, key)}><Check size={14} /></Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingLabelKey(null)}><X size={14} /></Button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-white whitespace-pre-wrap">{label as string || '—'}</p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

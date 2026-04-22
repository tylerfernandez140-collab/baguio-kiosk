import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useKiosk } from '@/context/KioskContext';
import { toast } from 'sonner';

export const useOfficeManagement = (user: any) => {
  const { offices, refreshOffices } = useKiosk();
  const [localOffices, setLocalOffices] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingStatus, setUploadingStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      fetchOffices();
    }
  }, [user]);

  const fetchOffices = async () => {
    if (!user) return;
    setIsRefreshing(true);
    const { data, error } = await supabase.from('offices').select('*');

    if (error) {
      console.error('Error fetching offices:', error);
      toast.error(`Database Error: ${error.message}`);
    } else {
      setLocalOffices(data || []);
    }
    setIsRefreshing(false);
    refreshOffices();
  };

  useEffect(() => {
    if (offices.length > 0 && !isRefreshing) {
      setLocalOffices(offices);
    }
  }, [offices, isRefreshing]);

  const handleDeleteOffice = async (id: string) => {
    if (!confirm('Are you sure you want to remove this office from the directory? (The map label will remain)')) return;

    const { error } = await supabase.from('offices').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete office');
    } else {
      toast.success('Office removed from directory');
      refreshOffices();
    }
  };

  const handleAddOffice = async (floorId: string, name: string) => {
    const { data, error } = await supabase.from('offices').insert({
      floor_id: floorId,
      name: name,
      description: '',
      officer: ''
    }).select();

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

  const displayOffices = localOffices.length > 0 ? localOffices : offices;

  const handleSaveEdit = async (id: string) => {
    const officeToUpdate = displayOffices.find(off => off.id === id);
    if (!officeToUpdate) return;

    const { error } = await supabase.from('offices').update({
      officer: officeToUpdate.officer,
      description: officeToUpdate.description,
      image_url: officeToUpdate.image_url
    }).eq('id', id);

    if (error) {
      console.error('Error updating office:', error);
      toast.error('Failed to save changes');
    } else {
      setEditingId(null);
      toast.success('Office updated successfully');
    }
  };

  const filteredOffices = useMemo(() => {
    return displayOffices.filter(off => 
      String(off.name).toLowerCase().includes(searchQuery.toLowerCase()) || 
      (off.officer && String(off.officer).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [displayOffices, searchQuery]);

  const handleImageUpload = async (file: File, officeId: string) => {
    try {
      if (file.size > 1024 * 1024) {
        toast.error('Image is too large. Please use an image under 1MB.');
        return null;
      }

      setUploadingStatus(prev => ({ ...prev, [officeId]: 10 }));
      
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        
        let progress = 10;
        const interval = setInterval(() => {
          progress += 20;
          if (progress >= 90) clearInterval(interval);
          setUploadingStatus(prev => ({ ...prev, [officeId]: progress }));
        }, 50);

        reader.readAsDataURL(file);
      });

      setUploadingStatus(prev => ({ ...prev, [officeId]: 100 }));

      setLocalOffices(prev => 
        prev.map(off => off.id === officeId ? { ...off, image_url: base64Data } : off)
      );
      
      toast.success('Image processed successfully');
      
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

  return {
    localOffices, setLocalOffices, displayOffices, filteredOffices,
    isRefreshing, fetchOffices, editingId, setEditingId,
    searchQuery, setSearchQuery, uploadingStatus,
    handleAddOffice, handleSaveEdit, handleDeleteOffice, handleImageUpload
  };
};

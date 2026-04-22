import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { initialFloorLabels } from '@/data/floorLabels';

export const useKioskData = () => {
  const [labels, setLabels] = useState(initialFloorLabels);
  const [offices, setOffices] = useState<any[]>([]);

  const fetchOffices = useCallback(async () => {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('floor_id', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching offices:', error);
    } else if (data) {
      setOffices(data);
    }
  }, []);

  const fetchLabels = useCallback(async () => {
    const { data, error } = await supabase.from('floor_labels').select('*');
    if (error) {
      console.error('Error fetching labels from Supabase:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const newLabels: Record<string, Record<string, string>> = JSON.parse(JSON.stringify(initialFloorLabels));
      data.forEach((item: any) => {
        if (!newLabels[item.floor_id]) newLabels[item.floor_id] = {};
        newLabels[item.floor_id][item.label_key] = item.label_text;
      });
      setLabels(newLabels);
    }
  }, []);

  useEffect(() => {
    fetchLabels();
    fetchOffices();

    const labelsChannel = supabase
      .channel('floor-labels-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'floor_labels' },
        (payload) => {
          const { floor_id, label_key, label_text } = payload.new as any;
          setLabels(prev => ({
            ...prev,
            [floor_id]: {
              ...prev[floor_id],
              [label_key]: label_text
            }
          }));
        }
      )
      .subscribe();

    const officesChannel = supabase
      .channel('offices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'offices' },
        () => {
          fetchOffices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(labelsChannel);
      supabase.removeChannel(officesChannel);
    };
  }, [fetchLabels, fetchOffices]);

  const updateLabel = async (floorId: string, labelKey: string, newValue: string) => {
    setLabels(prev => ({
      ...prev,
      [floorId]: {
        ...prev[floorId],
        [labelKey]: newValue
      }
    }));

    const { error } = await supabase
      .from('floor_labels')
      .upsert({ 
        floor_id: floorId, 
        label_key: labelKey, 
        label_text: newValue 
      }, { onConflict: 'floor_id,label_key' });

    if (error) {
      console.error('Error updating label in Supabase:', error);
    }
  };

  return {
    labels,
    updateLabel,
    offices,
    fetchOffices
  };
};

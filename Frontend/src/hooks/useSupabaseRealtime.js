import { useEffect, useState } from 'react';
import { supabase, subscribeToTable } from '../config/supabase';

export const useSupabaseRealtime = (table, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;

    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(fetchedData || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching ${table}:`, err);
      } finally {
        setLoading(false);
      }
    };

    const handleRealtimeUpdate = (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setData(currentData => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...currentData];
          case 'UPDATE':
            return currentData.map(item => 
              item.id === newRecord.id ? newRecord : item
            );
          case 'DELETE':
            return currentData.filter(item => item.id !== oldRecord.id);
          default:
            return currentData;
        }
      });
    };

    fetchData();
    subscription = subscribeToTable(table, handleRealtimeUpdate);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [table]);

  return { data, loading, error, refetch: () => fetchData() };
};

export default useSupabaseRealtime;
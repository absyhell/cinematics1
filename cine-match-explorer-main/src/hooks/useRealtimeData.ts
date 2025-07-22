
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { POLLING_INTERVALS } from '@/services/apiConfig';

/**
 * A hook that provides real-time data functionality using polling
 * This could be improved with WebSockets or MongoDB Change Streams in a production environment
 */
export function useRealtimeData<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options: {
    pollingInterval?: number;
    enabled?: boolean;
    onUpdate?: (data: T) => void;
  } = {}
) {
  const { 
    pollingInterval = POLLING_INTERVALS.recommendations,
    enabled = true,
    onUpdate
  } = options;
  
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchFn,
    refetchInterval: enabled ? pollingInterval : false,
    refetchIntervalInBackground: true,
    meta: {
      onSuccess: (data: T) => {
        setLastUpdated(new Date());
        if (onUpdate) onUpdate(data);
      }
    }
  });
  
  // Update last updated whenever data changes
  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
      if (onUpdate) onUpdate(data as T);
    }
  }, [data, onUpdate]);
  
  // Force manual refresh function
  const refreshData = async () => {
    await refetch();
  };
  
  // Update notification effect
  useEffect(() => {
    // You could add visual indicators or notifications here
    // when data is refreshed in the background
    console.log(`Real-time data updated for ${queryKey.join('/')} at ${lastUpdated.toLocaleTimeString()}`);
  }, [lastUpdated, queryKey]);
  
  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
}

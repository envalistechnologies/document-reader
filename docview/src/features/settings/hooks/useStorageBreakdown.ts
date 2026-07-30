import { useState, useCallback } from 'react';
import { getStorageBreakdown, StorageBreakdown } from '../../../services/storage/storageUsage.service';

export function useStorageBreakdown() {
  const [breakdown, setBreakdown] = useState<StorageBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBreakdown = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStorageBreakdown();
      setBreakdown(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { breakdown, isLoading, error, fetchBreakdown };
}

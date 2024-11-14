import { useState, useCallback } from 'react';
import { useMessage } from '../contexts/MessageContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showMessage } = useMessage();

  const handleRequest = useCallback(async (apiFunc, ...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      showMessage(errorMessage, 'error');
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  return { handleRequest, loading, error };
}; 
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export function useApiQuery<T = any>(
  key: string | string[],
  endpoint: string,
  options = {}
) {
  const navigate = useNavigate();

  return useQuery<T>(
    key,
    async () => {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
        throw error;
      }
    },
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'An error occurred');
      },
      ...options,
    }
  );
}

export function useApiMutation<T = any>(
  endpoint: string,
  options: {
    method?: 'post' | 'put' | 'delete' | 'patch';
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    invalidateQueries?: string[];
  } = {}
) {
  const {
    method = 'post',
    onSuccess,
    onError,
    invalidateQueries = [],
  } = options;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<T, any, any>(
    async (data) => {
      try {
        const response = await api[method](endpoint, data);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        if (invalidateQueries.length > 0) {
          invalidateQueries.forEach((query) => {
            queryClient.invalidateQueries(query);
          });
        }
        onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'An error occurred');
        onError?.(error);
      },
    }
  );
}
/**
 * Country and State API hooks using TanStack Query
 * Handles country and state management operations
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiHelper } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

// Filter countries mutation
export const useFilterCountries = () => {
  return useMutation({
    mutationFn: async (filters: {
      name?: string;
      code?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/country/filter', filters);
      return response;
    },
  });
};

// Filter states mutation
export const useFilterStates = () => {
  return useMutation({
    mutationFn: async (filters: {
      name?: string;
      countryId?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/states/filter', filters);
      return response;
    },
  });
};

// Get states by country
export const useStatesByCountry = (countryId: string) => {
  return useQuery({
    queryKey: queryKeys.locations.states(countryId),
    queryFn: () => apiHelper.get(`/v1/states/country/${countryId}`),
    enabled: !!countryId,
    staleTime: 30 * 60 * 1000, // 30 minutes - location data doesn't change often
  });
};

// Get all countries (using filter with no params)
export const useCountries = () => {
  return useQuery({
    queryKey: queryKeys.locations.countries(),
    queryFn: async () => {
      const response = await apiHelper.post('/v1/country/filter', {});
      return response;
    },
    staleTime: 30 * 60 * 1000,
  });
};

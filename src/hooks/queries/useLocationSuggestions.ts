import { useQuery } from '@tanstack/react-query';

export interface LocationSuggestion {
  city: string;
  state: string;
  postalCode: string;
}

interface PostalApiPostOffice {
  District?: string;
  State?: string;
  Pincode?: string;
}

interface PostalApiItem {
  Status?: string;
  PostOffice?: PostalApiPostOffice[] | null;
}

const dedupeSuggestions = (items: LocationSuggestion[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.city}|${item.state}|${item.postalCode}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const normalizePostalApi = (response: PostalApiItem[]): LocationSuggestion[] => {
  const offices = response?.[0]?.PostOffice ?? [];
  return dedupeSuggestions(
    offices
      .map((office) => ({
        city: office.District?.trim() || '',
        state: office.State?.trim() || '',
        postalCode: office.Pincode?.trim() || '',
      }))
      .filter((item) => item.city && item.state && item.postalCode)
  );
};

const fetchPostalApi = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load location suggestions');
  }
  return (await response.json()) as PostalApiItem[];
};

export const usePostalCodeLookup = (postalCode: string) => {
  const sanitizedPostalCode = postalCode.trim();

  return useQuery({
    queryKey: ['locations', 'postalCode', sanitizedPostalCode],
    queryFn: async () => {
      const response = await fetchPostalApi(`https://api.postalpincode.in/pincode/${sanitizedPostalCode}`);
      return normalizePostalApi(response);
    },
    enabled: sanitizedPostalCode.length >= 6,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
};

export const useCityLocationSuggestions = (city: string, state?: string) => {
  const sanitizedCity = city.trim();
  const sanitizedState = state?.trim().toLowerCase() || '';

  return useQuery({
    queryKey: ['locations', 'city', sanitizedCity, sanitizedState],
    queryFn: async () => {
      const response = await fetchPostalApi(`https://api.postalpincode.in/postoffice/${encodeURIComponent(sanitizedCity)}`);
      const normalized = normalizePostalApi(response);
      if (!sanitizedState) {
        return normalized;
      }
      return normalized.filter((item) => item.state.toLowerCase() === sanitizedState);
    },
    enabled: sanitizedCity.length >= 2,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
};
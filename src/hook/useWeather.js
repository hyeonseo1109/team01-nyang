import { useQuery } from '@tanstack/react-query';
import { getTodayWeather, getFiveDayWeather } from '../api/weather';

export function useTodayWeather(location) {
  return useQuery({
    queryKey: ['todayWeather', location?.lat, location?.lon],
    queryFn: () => (location ? getTodayWeather(location.lat, location.lon) : Promise.resolve(null)),
    enabled: !!location,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFiveDayWeather(location) {
  return useQuery({
    queryKey: ['fiveDayWeather', location?.lat, location?.lon],
    queryFn: () => (location ? getFiveDayWeather(location.lat, location.lon) : Promise.resolve([])),
    enabled: !!location,
    staleTime: 1000 * 60 * 5,
  });
}

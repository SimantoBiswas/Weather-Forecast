'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWeatherData, searchLocations } from '@/lib/api';
import {
  DEFAULT_LOCATION,
  MAX_RECENT_SEARCHES,
  RECENT_SEARCHES_KEY,
} from '@/lib/constants';
import type { GeoLocation, RecentSearch, WeatherData } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // refresh every 10 minutes

export function useWeather() {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>(
    RECENT_SEARCHES_KEY,
    []
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (loc: GeoLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while fetching the weather.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + periodic refresh for "real-time" updates
  useEffect(() => {
    load(location);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => load(location), REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

  const selectLocation = useCallback(
    (loc: GeoLocation) => {
      setLocation(loc);
      setRecentSearches((prev) => {
        const entry: RecentSearch = {
          name: loc.name,
          country: loc.country,
          latitude: loc.latitude,
          longitude: loc.longitude,
        };
        const withoutDuplicate = prev.filter(
          (item) => !(item.latitude === loc.latitude && item.longitude === loc.longitude)
        );
        return [entry, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES);
      });
    },
    [setRecentSearches]
  );

  const refresh = useCallback(() => load(location), [load, location]);

  return {
    location,
    weather,
    loading,
    error,
    selectLocation,
    recentSearches,
    refresh,
    searchLocations,
  };
}

'use client';

import { useCallback, useState } from 'react';

interface GeoState {
  loading: boolean;
  error: string | null;
}

/**
 * Wraps the browser Geolocation API to resolve the user's current
 * latitude/longitude on demand (used for the "auto-detect location" action).
 */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ loading: false, error: null });

  const getPosition = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const err = 'Geolocation is not supported by your browser.';
        setState({ loading: false, error: err });
        reject(new Error(err));
        return;
      }

      setState({ loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          const message =
            error.code === error.PERMISSION_DENIED
              ? 'Location access was denied.'
              : 'Unable to retrieve your location.';
          setState({ loading: false, error: message });
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { ...state, getPosition };
}

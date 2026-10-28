import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { findCity, MANUAL_LOCATIONS } from '../data/cities';
import { deviceTimeZone } from '../engine/timezone';
import { useSettings } from './settings';

export interface Place {
  latitude: number;
  longitude: number;
  timeZone: string;
  label: string;
  source: 'gps' | 'manual';
}

export type PlaceState =
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'ready'; place: Place };

/**
 * Where to compute times for. GPS coordinates are read once per app start and
 * kept in memory only; nothing is sent anywhere.
 */
export function usePlace(): PlaceState {
  const { settings } = useSettings();
  const [state, setState] = useState<PlaceState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    if (settings.locationMode === 'manual') {
      const city = findCity(settings.manualCityId) ?? MANUAL_LOCATIONS[0];
      setState({
        status: 'ready',
        place: { latitude: city.latitude, longitude: city.longitude, timeZone: city.timeZone, label: city.name.en, source: 'manual' },
      });
      return;
    }
    setState({ status: 'loading' });
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) setState({ status: 'denied' });
        return;
      }
      // Indoors the GPS can take very long; use the last known position at once,
      // and give a fresh fix at most 12 seconds before falling back to the chosen city.
      const last = await Location.getLastKnownPositionAsync().catch(() => null);
      const timeout = new Promise<null>((r) => setTimeout(() => r(null), 12000));
      const pos = last ?? (await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), timeout]));
      if (cancelled) return;
      if (!pos) {
        const city = findCity(settings.manualCityId) ?? MANUAL_LOCATIONS[0];
        setState({ status: 'ready', place: { latitude: city.latitude, longitude: city.longitude, timeZone: city.timeZone, label: `${city.name.en} (GPS ⌛)`, source: 'manual' } });
        return;
      }
      setState({
        status: 'ready',
        place: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timeZone: deviceTimeZone(),
          label: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`,
          source: 'gps',
        },
      });
    })().catch(() => { if (!cancelled) setState({ status: 'denied' }); });
    return () => { cancelled = true; };
  }, [settings.locationMode, settings.manualCityId]);

  return state;
}

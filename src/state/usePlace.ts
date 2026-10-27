import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { MANUAL_LOCATIONS } from '../data/cities';
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
      const city = MANUAL_LOCATIONS.find((c) => c.id === settings.manualCityId) ?? MANUAL_LOCATIONS[0];
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
      const last = await Location.getLastKnownPositionAsync();
      const pos = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      if (cancelled) return;
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

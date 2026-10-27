import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { upcomingReminders } from '../engine/reminders';
import { localDateIn } from '../engine/timezone';
import { useSettings } from './settings';
import type { PlaceState } from './usePlace';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

/** Re-schedules local prayer reminders whenever the place or settings change. */
export function useAdhanReminders(place: PlaceState): void {
  const { settings, t } = useSettings();
  const ready = place.status === 'ready' ? place.place : null;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      const anyOn = Object.values(settings.adhan).some(Boolean);
      if (!anyOn) return;
      const perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted || cancelled) return;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('adhan', {
          name: 'Prayer times', importance: Notifications.AndroidImportance.HIGH, sound: 'default',
        });
      }
      const now = new Date();
      const list = upcomingReminders(
        localDateIn(now, ready.timeZone), ready, settings.prayer, settings.adhan, now,
      );
      for (const r of list) {
        if (cancelled) return;
        await Notifications.scheduleNotificationAsync({
          content: { title: t(r.prayer), body: t('adhanBody'), sound: 'default' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.date, channelId: 'adhan' },
        });
      }
    })().catch(() => undefined);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready?.latitude, ready?.longitude, settings.prayer, settings.adhan, settings.language]);
}

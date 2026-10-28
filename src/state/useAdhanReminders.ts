import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { upcomingReminders } from '../engine/reminders';
import { dayOf, eventReminders } from '../engine/islamicCalendar';
import { localDateIn } from '../engine/timezone';
import { ADHAN_SOUND } from '../data/adhanSound';
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
      if (!anyOn && !settings.eventReminders) return;
      const perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted || cancelled) return;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('adhan', {
          name: 'Prayer times', importance: Notifications.AndroidImportance.HIGH, sound: 'default',
        });
        // A channel's sound cannot change later, so the adhan has its own channel.
        if (ADHAN_SOUND) {
          await Notifications.setNotificationChannelAsync('adhan-voice', {
            name: 'Prayer times (adhan)', importance: Notifications.AndroidImportance.MAX, sound: ADHAN_SOUND.file,
          });
        }
        await Notifications.setNotificationChannelAsync('events', {
          name: 'Islamic days', importance: Notifications.AndroidImportance.DEFAULT, sound: 'default',
        });
      }
      const now = new Date();
      const useAdhan = !!ADHAN_SOUND && settings.adhanSound;
      // iOS keeps at most 64 pending notifications: up to 48 prayer reminders and 14 for Islamic days.
      if (anyOn) {
        const list = upcomingReminders(
          localDateIn(now, ready.timeZone), ready, settings.prayer, settings.adhan, now, 4, 48,
        );
        for (const r of list) {
          if (cancelled) return;
          await Notifications.scheduleNotificationAsync({
            content: { title: `🕌 ${t(r.prayer)}`, body: t('adhanBody'), sound: useAdhan ? ADHAN_SOUND!.file : 'default' },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.date, channelId: useAdhan ? 'adhan-voice' : 'adhan' },
          });
        }
      }
      if (settings.eventReminders) {
        const lang = settings.language;
        const key = lang === 'ur' || lang === 'fa' ? 'ur' : lang === 'roman' ? 'roman' : 'en';
        for (const e of eventReminders(dayOf(localDateIn(now, ready.timeZone)), now, settings.hijriOffset)) {
          if (cancelled) return;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${e.sameDay ? t('eventToday') : t('eventTomorrow')}: ${e.event.name[key]}`,
              body: e.event.year ? `${e.event.name[key]} (${e.event.year})` : t('eventBody'),
              sound: 'default',
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: e.at, channelId: 'events' },
          });
        }
      }
    })().catch(() => undefined);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready?.latitude, ready?.longitude, settings.prayer, settings.adhan, settings.language, settings.eventReminders, settings.hijriOffset, settings.adhanSound]);
}

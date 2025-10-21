import { useEffect } from 'react';
import { useEvents } from '@/contexts/EventsContext';
import { toast } from '@/hooks/use-toast';
import { isBefore, isAfter, subMinutes } from 'date-fns';

export const useNotifications = () => {
  const { events } = useEvents();

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();

      events.forEach(event => {
        // Combine date and time for accurate comparison
        const eventDateTime = new Date(event.startDate);
        if (event.startTime) {
          const [hours, minutes] = event.startTime.split(':').map(Number);
          eventDateTime.setHours(hours, minutes, 0, 0);
        }

        event.notifications.forEach(notification => {
          const notificationTime = subMinutes(eventDateTime, notification.minutesBefore);
          const storageKey = `notification_${event.id}_${notification.minutesBefore}`;
          const hasShown = localStorage.getItem(storageKey);

          // Check if it's time to show the notification and hasn't been shown yet
          if (
            !hasShown &&
            isAfter(now, notificationTime) &&
            isBefore(now, eventDateTime)
          ) {
            // Show notification
            toast({
              title: `${event.type === 'event' ? 'Evento' : event.type === 'task' ? 'Tarea' : 'Cumpleaños'} próximo`,
              description: `${event.title} ${event.startTime ? `a las ${event.startTime}` : 'hoy'}`,
              duration: 10000,
            });

            // Mark as shown
            localStorage.setItem(storageKey, 'true');
          }

          // Clean up old notifications (after event has passed)
          if (isAfter(now, eventDateTime) && hasShown) {
            localStorage.removeItem(storageKey);
          }
        });
      });
    };

    // Check immediately
    checkNotifications();

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [events]);
};

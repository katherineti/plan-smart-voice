import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEvents } from '@/contexts/EventsContext';
import { useState } from 'react';
import EventDetailsDialog from './EventDetailsDialog';
import type { CalendarEvent } from '@/types/event';

interface WeekViewProps {
  selectedDate: Date;
}

const WeekView = ({ selectedDate }: WeekViewProps) => {
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const weekStart = startOfWeek(selectedDate, { locale: es });
  const weekEnd = endOfWeek(selectedDate, { locale: es });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.startDate, day));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
        <div className="p-2"></div>
        {days.map(day => (
          <div key={day.toISOString()} className="p-2 text-center border-l">
            <div className="text-sm font-medium">{format(day, 'EEE', { locale: es })}</div>
            <div className={`text-lg ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b" style={{ minHeight: '60px' }}>
            <div className="p-2 text-xs text-muted-foreground">
              {format(new Date().setHours(hour, 0), 'HH:mm')}
            </div>
            {days.map(day => {
              const dayEvents = getEventsForDay(day).filter(event => {
                const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
                return eventHour === hour;
              });

              return (
                <div key={day.toISOString()} className="border-l p-1 relative">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="text-xs p-2 rounded cursor-pointer mb-1"
                      style={{ backgroundColor: event.color, color: '#fff' }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          open={true}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default WeekView;

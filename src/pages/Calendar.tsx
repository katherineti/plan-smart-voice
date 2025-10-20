import { useState } from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import VoiceButton from '@/components/voice/VoiceButton';
import Chatbot from '@/components/chat/Chatbot';
import EventForm from '@/components/calendar/EventForm';
import EventDetailsDialog from '@/components/calendar/EventDetailsDialog';
import { useEvents } from '@/contexts/EventsContext';
import type { EventType } from '@/types/event';

type View = 'month' | 'week' | 'day';

const Calendar = () => {
  const { events } = useEvents();
  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState<{
    type: EventType;
    title: string;
    startDate: Date;
    startTime: string;
    endTime: string;
    location?: string;
  } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleEventDataCollected = (data: {
    type: EventType;
    title: string;
    startDate: Date;
    startTime: string;
    endTime: string;
    location?: string;
  }) => {
    setEventFormData(data);
    setEventFormOpen(true);
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader 
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onEventSelect={handleEventSelect}
      />
      
      <div className="flex-1 overflow-hidden">
        {view === 'month' && <MonthView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {view === 'week' && <WeekView selectedDate={selectedDate} />}
        {view === 'day' && <DayView selectedDate={selectedDate} />}
      </div>

      <VoiceButton />
      <Chatbot onEventDataCollected={handleEventDataCollected} />
      
      {eventFormData && (
        <EventForm
          type={eventFormData.type}
          open={eventFormOpen}
          onOpenChange={(open) => {
            setEventFormOpen(open);
            if (!open) setEventFormData(null);
          }}
          initialData={{
            title: eventFormData.title,
            startDate: eventFormData.startDate,
            startTime: eventFormData.startTime,
            endTime: eventFormData.endTime,
            location: eventFormData.location
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          open={!!selectedEventId}
          onOpenChange={(open) => {
            if (!open) setSelectedEventId(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

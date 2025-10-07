import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import VoiceButton from '@/components/voice/VoiceButton';

type View = 'month' | 'week' | 'day';

const Calendar = () => {
  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { t } = useLanguage();

  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader 
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <div className="flex-1 overflow-hidden">
        {view === 'month' && <MonthView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {view === 'week' && <WeekView selectedDate={selectedDate} />}
        {view === 'day' && <DayView selectedDate={selectedDate} />}
      </div>

      <VoiceButton />
    </div>
  );
};

export default Calendar;

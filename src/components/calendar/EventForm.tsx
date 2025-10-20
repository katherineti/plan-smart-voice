import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/contexts/EventsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';
import type { EventType, CalendarEvent } from '@/types/event';

interface EventFormProps {
  type: EventType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent;
  initialData?: {
    title?: string;
    startDate?: Date;
    startTime?: string;
    endTime?: string;
  };
}

const EVENT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

const EventForm = ({ type, open, onOpenChange, event, initialData }: EventFormProps) => {
  const { addEvent, updateEvent } = useEvents();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    color: event?.color || EVENT_COLORS[0],
    startDate: initialData?.startDate || event?.startDate || new Date(),
    endDate: event?.endDate || new Date(),
    startTime: initialData?.startTime || event?.startTime || '09:00',
    endTime: initialData?.endTime || event?.endTime || '10:00',
  });

  // Update form data when initialData changes (from chatbot)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || prev.title,
        startDate: initialData.startDate || prev.startDate,
        startTime: initialData.startTime || prev.startTime,
        endTime: initialData.endTime || prev.endTime,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      type,
      notifications: [],
      userId: user?.id || '1'
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{event ? t('edit') : t('add')} {t(type)}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">{t('date')}</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate instanceof Date 
                ? formData.startDate.toISOString().split('T')[0] 
                : formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t('startTime')}</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{t('endTime')}</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('color')}</Label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: formData.color === color ? '#000' : 'transparent',
                    transform: formData.color === color ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;

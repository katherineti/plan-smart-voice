import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/contexts/EventsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Edit, Trash2, Copy } from 'lucide-react';
import EventForm from './EventForm';
import type { CalendarEvent } from '@/types/event';

interface EventDetailsDialogProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailsDialog = ({ event, open, onOpenChange }: EventDetailsDialogProps) => {
  const { deleteEvent, duplicateEvent } = useEvents();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    deleteEvent(event.id);
    onOpenChange(false);
  };

  const handleDuplicate = () => {
    duplicateEvent(event.id);
    onOpenChange(false);
  };

  if (isEditing) {
    return (
      <EventForm
        type={event.type}
        event={event}
        open={true}
        onOpenChange={(open) => {
          setIsEditing(false);
          if (!open) onOpenChange(false);
        }}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalles del {t(event.type)}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: event.color + '20', borderLeft: `4px solid ${event.color}` }}
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-muted-foreground">{event.description}</p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Fecha: </span>
              {format(event.startDate, 'PPP', { locale: es })}
            </div>
            {event.startTime && event.endTime && (
              <div>
                <span className="font-medium">Hora: </span>
                {event.startTime} - {event.endTime}
              </div>
            )}
            {event.location && (
              <div>
                <span className="font-medium">Ubicación: </span>
                {event.location}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('edit')}
            </Button>
            <Button
              onClick={handleDuplicate}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Copy className="h-4 w-4" />
              {t('duplicate')}
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('delete')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;

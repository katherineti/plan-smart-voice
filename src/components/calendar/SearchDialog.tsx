import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEvents } from '@/contexts/EventsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSelect?: (eventId: string) => void;
}

const SearchDialog = ({ open, onOpenChange, onEventSelect }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { events } = useEvents();
  const { t } = useLanguage();

  const handleEventClick = (eventId: string) => {
    if (onEventSelect) {
      onEventSelect(eventId);
      onOpenChange(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('search')}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="p-3 rounded-lg border hover:bg-accent cursor-pointer"
              style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
              onClick={() => handleEventClick(event.id)}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {format(event.startDate, 'PPP', { locale: es })}
              </div>
              {event.location && (
                <div className="text-sm text-muted-foreground">{event.location}</div>
              )}
            </div>
          ))}
          {searchQuery && filteredEvents.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No se encontraron resultados
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

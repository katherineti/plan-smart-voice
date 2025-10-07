import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, CheckSquare, Cake, X } from 'lucide-react';
import EventForm from './EventForm';
import type { EventType } from '@/types/event';

interface AddEventMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEventMenu = ({ open, onOpenChange }: AddEventMenuProps) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<EventType | null>(null);

  const handleSelectType = (type: EventType) => {
    setSelectedType(type);
  };

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  if (selectedType) {
    return <EventForm type={selectedType} open={true} onOpenChange={handleClose} />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Seleccionar tipo</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={() => handleSelectType('event')}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <Calendar className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-medium">{t('event')}</div>
              <div className="text-xs text-muted-foreground">Crear un evento</div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelectType('task')}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <CheckSquare className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-medium">{t('task')}</div>
              <div className="text-xs text-muted-foreground">Crear una tarea</div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelectType('birthday')}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <Cake className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-medium">{t('birthday')}</div>
              <div className="text-xs text-muted-foreground">Crear un cumpleaños</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventMenu;

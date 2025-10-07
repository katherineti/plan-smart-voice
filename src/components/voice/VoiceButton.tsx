import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useEvents } from '@/contexts/EventsContext';
import { useAuth } from '@/contexts/AuthContext';

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();
  const { addEvent, updateEvent, deleteEvent, events } = useEvents();
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error de reconocimiento de voz",
          description: "No se pudo procesar el comando de voz",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    console.log('Voice command:', command);

    // Login con Google
    if (command.includes('iniciar sesión') || command.includes('login')) {
      signInWithGoogle();
      toast({
        title: "Iniciando sesión",
        description: "Iniciando sesión con Google...",
      });
      return;
    }

    // Agregar evento
    if (command.includes('agregar') || command.includes('crear')) {
      const eventData = {
        title: extractTitle(command),
        type: 'event' as const,
        startDate: new Date(),
        endDate: new Date(),
        color: '#3b82f6',
        notifications: [],
        userId: user?.id || '1'
      };
      addEvent(eventData);
      toast({
        title: "Evento creado",
        description: `Se creó: ${eventData.title}`,
      });
      return;
    }

    // Eliminar evento
    if (command.includes('eliminar') || command.includes('borrar')) {
      const eventToDelete = events[0];
      if (eventToDelete) {
        deleteEvent(eventToDelete.id);
        toast({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado",
        });
      }
      return;
    }

    toast({
      title: "Comando no reconocido",
      description: "Intenta de nuevo con otro comando",
    });
  };

  const extractTitle = (command: string): string => {
    const words = command.split(' ');
    const titleStart = words.findIndex(w => w === 'evento' || w === 'tarea') + 1;
    return words.slice(titleStart).join(' ') || 'Nuevo evento';
  };

  const toggleListening = async () => {
    if (!recognition) {
      toast({
        title: "No disponible",
        description: "El reconocimiento de voz no está disponible en este navegador",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isListening) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setIsListening(true);
        toast({
          title: "Escuchando...",
          description: "Di un comando de voz",
        });
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch (error) {
      console.error('Microphone permission error:', error);
      toast({
        title: "Error de permisos",
        description: "Necesitas permitir el acceso al micrófono",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={toggleListening}
      size="lg"
      className={`fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg ${
        isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''
      }`}
    >
      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </Button>
  );
};

export default VoiceButton;

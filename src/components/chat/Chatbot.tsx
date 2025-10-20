import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Mic, MicOff, X, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatbotProps {
  onEventDataCollected: (data: {
    type: 'event' | 'task' | 'birthday';
    title: string;
    startDate: Date;
    startTime: string;
    endTime: string;
    location?: string;
  }) => void;
}

const Chatbot = ({ onEventDataCollected }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [conversationState, setConversationState] = useState<{
    step: 'greeting' | 'type' | 'title' | 'date' | 'startTime' | 'endTime' | 'location' | 'complete';
    type?: 'event' | 'task' | 'birthday';
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
  }>({ step: 'greeting' });
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addUserMessage(transcript);
        processUserInput(transcript);
        setInputText('');
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      speak('¡Hola! Soy tu asistente de OronixOS. ¿Qué te gustaría crear hoy: un evento, una tarea o un cumpleaños?');
      addBotMessage('¡Hola! Soy tu asistente de OronixOS. ¿Qué te gustaría crear hoy: un evento, una tarea o un cumpleaños?');
    }
  }, [isOpen]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'bot', content }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    switch (conversationState.step) {
      case 'greeting':
      case 'type':
        if (lowerInput.includes('evento')) {
          setConversationState({ ...conversationState, step: 'title', type: 'event' });
          const msg = '¡Perfecto! Vamos a crear un evento. ¿Cuál es el título del evento?';
          speak(msg);
          addBotMessage(msg);
        } else if (lowerInput.includes('tarea')) {
          setConversationState({ ...conversationState, step: 'title', type: 'task' });
          const msg = '¡Genial! Vamos a crear una tarea. ¿Cuál es el título de la tarea?';
          speak(msg);
          addBotMessage(msg);
        } else if (lowerInput.includes('cumpleaño')) {
          setConversationState({ ...conversationState, step: 'title', type: 'birthday' });
          const msg = '¡Excelente! Vamos a crear un cumpleaños. ¿De quién es el cumpleaños?';
          speak(msg);
          addBotMessage(msg);
        } else {
          const msg = 'Por favor, dime si quieres crear un evento, una tarea o un cumpleaños.';
          speak(msg);
          addBotMessage(msg);
        }
        break;

      case 'title':
        setConversationState({ ...conversationState, step: 'date', title: input });
        const msgDate = '¿Para qué fecha? Dime la fecha en formato día/mes/año o solo el día si es para este mes.';
        speak(msgDate);
        addBotMessage(msgDate);
        break;

      case 'date':
        const parsedDate = parseDate(input);
        if (parsedDate) {
          setConversationState({ ...conversationState, step: 'startTime', date: parsedDate });
          const msgStart = '¿A qué hora inicia? Por ejemplo: 9:00 o 14:30';
          speak(msgStart);
          addBotMessage(msgStart);
        } else {
          const msgError = 'No entendí la fecha. Por favor, dímela de nuevo.';
          speak(msgError);
          addBotMessage(msgError);
        }
        break;

      case 'startTime':
        const startTime = parseTime(input);
        if (startTime) {
          setConversationState({ ...conversationState, step: 'endTime', startTime });
          const msgEnd = '¿A qué hora termina? Por ejemplo: 10:00 o 16:30';
          speak(msgEnd);
          addBotMessage(msgEnd);
        } else {
          const msgError = 'No entendí la hora. Por favor, dímela de nuevo en formato HH:MM';
          speak(msgError);
          addBotMessage(msgError);
        }
        break;

      case 'endTime':
        const endTime = parseTime(input);
        if (endTime) {
          setConversationState({ ...conversationState, step: 'location', endTime });
          const msgLocation = '¿Dónde será? Puedes decirme la ubicación o simplemente di "sin ubicación" o "saltar".';
          speak(msgLocation);
          addBotMessage(msgLocation);
        } else {
          const msgError = 'No entendí la hora. Por favor, dímela de nuevo en formato HH:MM';
          speak(msgError);
          addBotMessage(msgError);
        }
        break;

      case 'location':
        let location: string | undefined = undefined;
        if (!lowerInput.includes('sin') && !lowerInput.includes('saltar') && !lowerInput.includes('no')) {
          location = input;
        }
        
        setConversationState({ ...conversationState, step: 'complete', location });
        const msgComplete = '¡Perfecto! Tengo toda la información. Voy a abrir el formulario para que puedas revisar y guardar.';
        speak(msgComplete);
        addBotMessage(msgComplete);

        setTimeout(() => {
          const eventData = {
            type: conversationState.type!,
            title: conversationState.title!,
            startDate: new Date(conversationState.date!),
            startTime: conversationState.startTime!,
            endTime: conversationState.endTime!,
            location: location
          };
          onEventDataCollected(eventData);
          setIsOpen(false);
          resetConversation();
        }, 2000);
        break;
    }
  };

  const parseDate = (input: string): string | null => {
    const today = new Date();
    
    // Buscar patrones de fecha
    const dayMatch = input.match(/(\d{1,2})/);
    const fullDateMatch = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    const shortDateMatch = input.match(/(\d{1,2})\/(\d{1,2})/);

    if (fullDateMatch) {
      return `${fullDateMatch[3]}-${fullDateMatch[2].padStart(2, '0')}-${fullDateMatch[1].padStart(2, '0')}`;
    } else if (shortDateMatch) {
      return `${today.getFullYear()}-${shortDateMatch[2].padStart(2, '0')}-${shortDateMatch[1].padStart(2, '0')}`;
    } else if (dayMatch) {
      const day = parseInt(dayMatch[1]);
      if (day >= 1 && day <= 31) {
        return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    }

    if (input.toLowerCase().includes('hoy')) {
      return today.toISOString().split('T')[0];
    } else if (input.toLowerCase().includes('mañana')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    return null;
  };

  const parseTime = (input: string): string | null => {
    const timeMatch = input.match(/(\d{1,2}):?(\d{2})?/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    return null;
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationState({ step: 'greeting' });
    setInputText('');
  };

  const toggleListening = async () => {
    if (!recognition) {
      toast({
        title: "No disponible",
        description: "El reconocimiento de voz no está disponible en este navegador",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!isListening) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setIsListening(true);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch (error) {
      console.error('Microphone permission error:', error);
      toast({
        title: "Error de permisos",
        description: "Necesitas permitir el acceso al micrófono",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      processUserInput(inputText);
      setInputText('');
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-24 right-8 rounded-full w-16 h-16 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-background border rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-primary text-primary-foreground">
            <h3 className="font-semibold">Asistente OronixOS</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                resetConversation();
              }}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu respuesta..."
                className="flex-1"
              />
              <Button
                onClick={toggleListening}
                size="icon"
                variant={isListening ? 'destructive' : 'outline'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

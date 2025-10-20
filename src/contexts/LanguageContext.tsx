import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'fr' | 'de' | 'pt';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  es: {
    welcome: 'Bienvenido a Planificador Virtual',
    signInGoogle: 'Iniciar sesión con Google',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    event: 'Evento',
    task: 'Tarea',
    birthday: 'Cumpleaños',
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    duplicate: 'Duplicar',
    save: 'Guardar',
    cancel: 'Cancelar',
    search: 'Buscar',
    settings: 'Configuración',
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Predeterminado',
    title: 'Título',
    description: 'Descripción',
    location: 'Ubicación',
    color: 'Color',
    notifications: 'Notificaciones',
    date: 'Fecha',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin'
  },
  en: {
    welcome: 'Welcome to Virtual Planner',
    signInGoogle: 'Sign in with Google',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    event: 'Event',
    task: 'Task',
    birthday: 'Birthday',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    duplicate: 'Duplicate',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    title: 'Title',
    description: 'Description',
    location: 'Location',
    color: 'Color',
    notifications: 'Notifications',
    date: 'Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    startTime: 'Start Time',
    endTime: 'End Time'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored) setLanguage(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

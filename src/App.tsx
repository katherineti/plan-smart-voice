import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EventsProvider } from "@/contexts/EventsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import { BASE_PATH } from "./../const";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* CLAVE: Se añade el 'basename' para que React Router funcione en el subdirectorio 
        ('/plan-smart-voice/') tanto en 'npm run preview' como en GitHub Pages.
      */}
      {/* <BrowserRouter basename="/plan-smart-voice"> */}
      <BrowserRouter basename={BASE_PATH}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <EventsProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={<Navigate to="/calendar" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </EventsProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

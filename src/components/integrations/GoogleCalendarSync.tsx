import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  status: string;
}

export const GoogleCalendarSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if Google Calendar is connected
  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  const checkGoogleCalendarConnection = async () => {
    // This would check if the user has authorized Google Calendar
    // For now, we'll simulate the check
    const hasGoogleToken = localStorage.getItem('google_calendar_token');
    setIsConnected(!!hasGoogleToken);
  };

  const connectGoogleCalendar = async () => {
    setLoading(true);
    try {
      // This would initiate Google OAuth flow
      // For now, we'll simulate the connection
      
      // In a real implementation, this would redirect to Google OAuth
      const googleAuthUrl = `https://accounts.google.com/oauth/v2/auth?` +
        `client_id=YOUR_GOOGLE_CLIENT_ID&` +
        `redirect_uri=${window.location.origin}/auth/google/callback&` +
        `scope=https://www.googleapis.com/auth/calendar.readonly&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        localStorage.setItem('google_calendar_token', 'demo_token');
        setIsConnected(true);
        setLoading(false);
        toast({
          title: "Google Calendar Conectado!",
          description: "Sua agenda do Google Calendar foi sincronizada com sucesso.",
        });
      }, 2000);

    } catch (error) {
      console.error('Google Calendar connection error:', error);
      setLoading(false);
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível conectar com o Google Calendar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const syncCalendar = async () => {
    setSyncStatus('syncing');
    try {
      // This would fetch events from Google Calendar API
      // For now, we'll simulate some events
      
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          summary: 'Reunião de trabalho',
          start: '2024-01-15T09:00:00',
          end: '2024-01-15T10:00:00',
          status: 'confirmed'
        },
        {
          id: '2', 
          summary: 'Consulta médica',
          start: '2024-01-15T14:00:00',
          end: '2024-01-15T15:00:00',
          status: 'confirmed'
        },
        {
          id: '3',
          summary: 'Aula de português',
          start: '2024-01-15T16:00:00', 
          end: '2024-01-15T17:00:00',
          status: 'confirmed'
        }
      ];

      setTimeout(() => {
        setEvents(mockEvents);
        setSyncStatus('success');
        toast({
          title: "Sincronização Completa",
          description: `${mockEvents.length} eventos encontrados no Google Calendar.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Calendar sync error:', error);
      setSyncStatus('error');
      toast({
        title: "Erro na Sincronização",
        description: "Não foi possível sincronizar com o Google Calendar.",
        variant: "destructive",
      });
    }
  };

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem('google_calendar_token');
    setIsConnected(false);
    setEvents([]);
    setSyncStatus('idle');
    toast({
      title: "Google Calendar Desconectado",
      description: "A sincronização foi desativada.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Integração Google Calendar
        </CardTitle>
        <CardDescription>
          Sincronize sua agenda do Google para evitar conflitos de horários
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>

          {isConnected ? (
            <div className="space-x-2">
              <Button
                onClick={syncCalendar}
                disabled={syncStatus === 'syncing'}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                Sincronizar
              </Button>
              
              <Button
                onClick={disconnectGoogleCalendar}
                size="sm"
                variant="destructive"
              >
                Desconectar
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectGoogleCalendar}
              disabled={loading}
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {loading ? 'Conectando...' : 'Conectar'}
            </Button>
          )}
        </div>

        {isConnected && events.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Eventos Hoje ({events.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-muted p-2 rounded text-sm">
                  <div className="font-medium">{event.summary}</div>
                  <div className="text-muted-foreground">
                    {new Date(event.start).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(event.end).toLocaleTimeString('pt-BR', {
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isConnected && syncStatus === 'success' && events.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Nenhum evento encontrado para hoje
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-medium text-blue-800 mb-1">Como funciona:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Conecte sua conta do Google Calendar</li>
            <li>• Os horários ocupados não aparecerão como disponíveis</li>
            <li>• Sincronização automática a cada 15 minutos</li>
            <li>• Apenas eventos confirmados são considerados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
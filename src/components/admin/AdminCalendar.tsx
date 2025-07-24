import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Settings, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { t } = useLanguage();
  
  // Mock data for demonstration - admin view
  const timeSlots = [
    { time: "09:00", available: true, type: "available" },
    { time: "10:00", available: false, type: "booked", student: "Maria Silva", meetLink: "meet.google.com/abc-def" },
    { time: "11:00", available: true, type: "blocked" },
    { time: "14:00", available: true, type: "available" },
    { time: "15:00", available: false, type: "booked", student: "João Santos", meetLink: "meet.google.com/xyz-123" },
    { time: "16:00", available: false, type: "blocked" },
    { time: "17:00", available: true, type: "available" },
    { time: "18:00", available: true, type: "available" },
  ];
  
  const getSlotStyle = (slot: any) => {
    if (slot.type === "booked") {
      return "bg-lesson-booked text-white border-lesson-booked";
    }
    if (slot.type === "blocked") {
      return "bg-lesson-unavailable text-muted-foreground border-lesson-unavailable";
    }
    return "bg-lesson-available text-white hover:bg-lesson-available/90 border-lesson-available";
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Gerenciar Agenda - {formatDate(selectedDate)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Horários
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Bloquear Horário
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-available rounded-full"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-booked rounded-full"></div>
            <span>Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-unavailable rounded-full"></div>
            <span>Bloqueado</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeSlots.map((slot, index) => (
            <div key={index} className="relative group">
              <div className={`border-2 rounded-lg p-4 transition-all ${getSlotStyle(slot)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  
                  {slot.type === "available" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {slot.type === "blocked" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-muted-foreground hover:bg-black/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                {slot.type === "booked" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="text-xs">{slot.student}</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                      Confirmado
                    </Badge>
                  </div>
                )}
                
                {slot.type === "available" && (
                  <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                    Aberto
                  </Badge>
                )}
                
                {slot.type === "blocked" && (
                  <Badge variant="outline" className="text-xs bg-black/10 border-black/20">
                    Indisponível
                  </Badge>
                )}
              </div>
              
              {/* Admin controls on hover */}
              {slot.type === "booked" && (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white shadow-md hover:bg-accent-soft"
                    >
                      <CalendarIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white shadow-md hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3">
          <Button variant="outline">
            ← Dia Anterior
          </Button>
          <Button variant="outline">
            Hoje
          </Button>
          <Button variant="outline">
            Próximo Dia →
          </Button>
        </div>
        
        <div className="bg-accent-soft p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Resumo do Dia</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Aulas agendadas:</span>
              <p className="font-semibold">2</p>
            </div>
            <div>
              <span className="text-muted-foreground">Horários livres:</span>
              <p className="font-semibold">4</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bloqueados:</span>
              <p className="font-semibold">2</p>
            </div>
            <div>
              <span className="text-muted-foreground">Receita prevista:</span>
              <p className="font-semibold">R$ 100</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCalendar;
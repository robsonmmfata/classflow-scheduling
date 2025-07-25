import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for demonstration
  const timeSlots = [
    { time: "08:00 - 08:50", available: true, type: "regular" },
    { time: "09:00 - 09:50", available: false, type: "booked", student: "Maria Silva" },
    { time: "10:00 - 10:50", available: true, type: "trial" },
    { time: "11:00 - 11:50", available: true, type: "regular" },
    { time: "14:00 - 14:50", available: true, type: "regular" },
    { time: "15:00 - 15:50", available: true, type: "regular" },
    { time: "16:00 - 16:50", available: false, type: "unavailable" },
    { time: "17:00 - 17:50", available: true, type: "regular" },
    { time: "18:00 - 18:50", available: false, type: "booked", student: "João Santos" },
  ];
  
  const getSlotStyle = (slot: any) => {
    if (!slot.available && slot.type === "booked") {
      return "bg-lesson-booked text-white";
    }
    if (!slot.available && slot.type === "unavailable") {
      return "bg-lesson-unavailable text-muted-foreground";
    }
    if (slot.type === "trial") {
      return "bg-lesson-trial text-white hover:bg-lesson-trial/90";
    }
    return "bg-lesson-available text-white hover:bg-lesson-available/90";
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
    <section id="agenda" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Agenda de Horários
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o melhor horário para sua aula
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {formatDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-available rounded-full"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-trial rounded-full"></div>
                <span>Aula Experimental</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-booked rounded-full"></div>
                <span>Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-unavailable rounded-full"></div>
                <span>Indisponível</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((slot, index) => (
                <div key={index} className="relative">
                  <Button
                    variant={slot.available ? "default" : "secondary"}
                    className={`w-full h-16 flex flex-col items-center justify-center ${getSlotStyle(slot)}`}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    {slot.type === "trial" && slot.available && (
                      <Badge variant="outline" className="text-xs mt-1 bg-white/20 border-white/30 text-white">
                        Experimental
                      </Badge>
                    )}
                    {slot.type === "booked" && (
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs">{slot.student}</span>
                      </div>
                    )}
                  </Button>
                  
                  {slot.type === "booked" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white shadow-md hover:bg-accent-soft"
                    >
                      <Video className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                * Fuso horário: Brasília (GMT-3)
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline">
                  ← Dia Anterior
                </Button>
                <Button variant="outline">
                  Próximo Dia →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Calendar;
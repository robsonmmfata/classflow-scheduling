import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Settings, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([
    { time: "09:00", available: true, type: "available" },
    { time: "10:00", available: false, type: "booked", student: "Maria Silva", meetLink: "meet.google.com/abc-def" },
    { time: "11:00", available: true, type: "blocked" },
    { time: "14:00", available: true, type: "available" },
    { time: "15:00", available: false, type: "booked", student: "João Santos", meetLink: "meet.google.com/xyz-123" },
    { time: "16:00", available: false, type: "blocked" },
    { time: "17:00", available: true, type: "available" },
    { time: "18:00", available: true, type: "available" },
  ]);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const toggleBlockSlot = (time: string) => {
    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.time === time) {
          if (slot.type === "blocked") {
            return { ...slot, type: "available", available: true };
          } else if (slot.type === "available") {
            return { ...slot, type: "blocked", available: false };
          }
        }
        return slot;
      })
    );
    toast({
      title: t('scheduleChange'),
      description: t('timeStatusUpdated'),
    });
  };

  const goToPreviousDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const goToNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {t('manageAgenda')} - {formatDate(selectedDate)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
              <Settings className="h-4 w-4 mr-2" />
              {t('configureAvailability')}
            </Button>
            <Button variant="gradient" size="sm" onClick={() => toast({
              title: t('blockSchedule'),
              description: t('featureComingSoon'),
            })}>
              <Plus className="h-4 w-4 mr-2" />
              {t('blockSchedule')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-available rounded-full"></div>
            <span>{t('available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-booked rounded-full"></div>
            <span>{t('booked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lesson-unavailable rounded-full"></div>
            <span>{t('blocked')}</span>
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
                      onClick={() => toggleBlockSlot(slot.time)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {slot.type === "blocked" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-muted-foreground hover:bg-black/10"
                      onClick={() => toggleBlockSlot(slot.time)}
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
          {t('confirmed')}
        </Badge>
      </div>
    )}
    
    {slot.type === "available" && (
      <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
        {t('open')}
      </Badge>
    )}
    
    {slot.type === "blocked" && (
      <Badge variant="outline" className="text-xs bg-black/10 border-black/20">
        {t('unavailable')}
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
      <Button variant="outline" onClick={goToPreviousDay}>
        {t('previousDay')}
      </Button>
      <Button variant="outline" onClick={goToToday}>
        {t('today')}
      </Button>
      <Button variant="outline" onClick={goToNextDay}>
        {t('nextDay')}
      </Button>
        </div>
        
  <div className="bg-accent-soft p-4 rounded-lg">
    <h3 className="font-semibold mb-2">{t('daySummary')}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">{t('scheduledLessons')}:</span>
        <p className="font-semibold">2</p>
      </div>
      <div>
        <span className="text-muted-foreground">{t('freeSlots')}:</span>
        <p className="font-semibold">4</p>
      </div>
      <div>
        <span className="text-muted-foreground">{t('blockedSlots')}:</span>
        <p className="font-semibold">2</p>
      </div>
      <div>
        <span className="text-muted-foreground">{t('expectedRevenue')}:</span>
        <p className="font-semibold">R$ 100</p>
      </div>
    </div>
  </div>
      </CardContent>
    </Card>
  );
};

export default AdminCalendar;
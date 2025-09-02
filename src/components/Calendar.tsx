import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { timeSlots, bookSlot, scheduleSettings } = useSchedule();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Filter slots for current date
  const todaySlots = timeSlots.filter(slot => slot.date === '2025-07-27');
  
  const getSlotStyle = (slot: any) => {
    if (slot.type === "booked") {
      return "bg-lesson-booked text-white";
    }
    if (slot.type === "blocked") {
      return "bg-lesson-unavailable text-muted-foreground";
    }
    if (slot.type === "trial") {
      return "bg-lesson-trial text-white hover:bg-lesson-trial/90";
    }
    return "bg-lesson-available text-white hover:bg-lesson-available/90";
  };

  const handleBookSlot = (slotId: string) => {
    if (!user) {
      toast({
        title: t('loginRequired'),
        description: t('loginToBookLesson'),
        variant: "destructive"
      });
      return;
    }

    if (user.role !== 'student') {
      toast({
        title: t('accessDenied'),
        description: t('onlyStudentsCanBook'),
        variant: "destructive"
      });
      return;
    }

    bookSlot(slotId, { name: user.email, email: user.email });
    toast({
      title: t('lessonBooked'),
      description: t('lessonBookedSuccess'),
    });
  };

  const handleWhatsAppContact = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  };
  
  const formatDate = (date: Date) => {
    const { language } = useLanguage();
    let locale = 'pt-BR';
    if (language === 'en') locale = 'en-US';
    if (language === 'es') locale = 'es-ES';
    
    return date.toLocaleDateString(locale, { 
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
            {t('scheduleCalendar')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('chooseTime')}
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
                <span>{t('available')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-trial rounded-full"></div>
                <span>{t('trialLesson')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-booked rounded-full"></div>
                <span>{t('occupied')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-lesson-unavailable rounded-full"></div>
                <span>{t('unavailable')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {todaySlots.map((slot) => (
                <div key={slot.id} className="relative">
                  <Button
                    variant={slot.available ? "default" : "secondary"}
                    className={`w-full h-16 flex flex-col items-center justify-center ${getSlotStyle(slot)}`}
                    disabled={!slot.available}
                    onClick={() => slot.available && handleBookSlot(slot.id)}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{slot.time} - {slot.duration}min</span>
                    </div>
                    {slot.type === "trial" && slot.available && (
                      <Badge variant="outline" className="text-xs mt-1 bg-white/20 border-white/30 text-white">
                        {t('experimental')}
                      </Badge>
                    )}
                    {slot.type === "available" && slot.available && (
                      <Badge variant="outline" className="text-xs mt-1 bg-white/20 border-white/30 text-white">
                        {t('regular')}
                      </Badge>
                    )}
                    {slot.type === "booked" && (
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs">{slot.student}</span>
                      </div>
                    )}
                  </Button>
                  
                  {slot.type === "booked" && slot.whatsapp && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white shadow-md hover:bg-accent-soft"
                      onClick={() => handleWhatsAppContact(slot.whatsapp!)}
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                * {t('timezone')}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline">
                  ← {t('previousDay')}
                </Button>
                <Button variant="outline">
                  {t('nextDay')} →
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
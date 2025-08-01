import { useState } from "react";
import { Calendar, Clock, Video, MoreHorizontal, RefreshCw, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const MyLessons = () => {
  const [remainingLessons, setRemainingLessons] = useState(6);
  const { t } = useLanguage();
  
  // Mock data for demonstration
  const upcomingLessons = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:00",
      type: "regular",
      status: "confirmed",
      meetLink: "https://meet.google.com/abc-def-ghi",
      canCancel: true,
      hoursUntil: 48
    },
    {
      id: 2,
      date: "2024-01-17",
      time: "16:00", 
      type: "trial",
      status: "confirmed",
      meetLink: "https://meet.google.com/jkl-mno-pqr",
      canCancel: true,
      hoursUntil: 96
    },
    {
      id: 3,
      date: "2024-01-20",
      time: "15:00",
      type: "regular", 
      status: "confirmed",
      meetLink: "https://meet.google.com/stu-vwx-yzr",
      canCancel: true,
      hoursUntil: 144
    }
  ];
  
  const pastLessons = [
    {
      id: 4,
      date: "2024-01-10",
      time: "14:00",
      type: "regular",
      status: "completed",
      rating: 5
    },
    {
      id: 5,
      date: "2024-01-08",
      time: "16:00",
      type: "trial",
      status: "completed", 
      rating: 5
    }
  ];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };
  
  const getLessonTypeLabel = (type: string) => {
    return type === "trial" ? "Experimental" : "Regular";
  };
  
  const getLessonTypeBadge = (type: string) => {
    return type === "trial" ? "bg-lesson-trial" : "bg-lesson-available";
  };

  return (
    <section id="minhas-aulas" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('myLessons')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('manageSchedule')}
            </p>
          </div>
          
          {/* Aulas Restantes */}
          <Card className="mb-8 border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('lessonsBalance')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('remainingLessons')} <span className="font-bold text-accent">{remainingLessons} {t('lessonsToSchedule')}</span>
                  </p>
                </div>
                <Button variant="outline">
                  {t('buyMoreLessons')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Próximas Aulas */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {t('upcomingLessons')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent-soft transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(lesson.date)}
                      </div>
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <Clock className="h-4 w-4" />
                        {lesson.time}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge className={`${getLessonTypeBadge(lesson.type)} text-white`}>
                        {getLessonTypeLabel(lesson.type)}
                      </Badge>
                      <Badge variant="outline" className="text-accent border-accent">
                        {t('confirmed')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="gradient" 
                      size="sm"
                      onClick={() => window.open('https://meet.google.com/pui-qzis-ehf', '_blank')}
                    >
                      <Video className="h-4 w-4" />
                      {t('enterLesson')}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {t('reschedule')}
                        </DropdownMenuItem>
                        {lesson.canCancel && (
                          <DropdownMenuItem className="text-destructive">
                            <X className="h-4 w-4 mr-2" />
                            {t('cancel')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Aulas Anteriores */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                {t('pastLessons')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(lesson.date)}
                      </div>
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <Clock className="h-4 w-4" />
                        {lesson.time}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge className={`${getLessonTypeBadge(lesson.type)} text-white`}>
                        {getLessonTypeLabel(lesson.type)}
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                        {t('completed')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex text-accent">
                      {[...Array(lesson.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/avaliacoes'}>
                      {t('leaveFeedback')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Política de Cancelamento */}
          <Card className="mt-8 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-800 mb-2">
                {t('cancellationPolicy')}
              </h3>
              <p className="text-amber-700 text-sm">
                {t('cancellationText')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MyLessons;
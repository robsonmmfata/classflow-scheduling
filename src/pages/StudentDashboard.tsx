import { Calendar, Clock, Star, BookOpen, Video, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StudentStats from '@/components/student/StudentStats';
import Header from '@/components/Header';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const upcomingLessons = [
    {
      id: 1,
      date: "Hoje",
      time: "15:00",
      type: "regular",
      teacher: "Prof. Maria",
      meetLink: "https://meet.google.com/abc-def-ghi"
    },
    {
      id: 2,
      date: "Amanhã",
      time: "16:00",
      type: "trial", 
      teacher: "Prof. Maria",
      meetLink: "https://meet.google.com/jkl-mno-pqr"
    }
  ];

  const recentActivity = [
    { action: "Aula concluída", time: "2 horas atrás", type: "completed" },
    { action: "Aula agendada", time: "1 dia atrás", type: "scheduled" },
    { action: "Feedback enviado", time: "2 dias atrás", type: "feedback" },
    { action: "Pacote comprado", time: "3 dias atrás", type: "purchase" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Dashboard */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('welcome')}, {user?.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('studentDashboard')} - Acompanhe seu progresso
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="gradient">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Aula
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <StudentStats />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Próximas Aulas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Saldo de Aulas */}
              <Card className="border-l-4 border-l-accent shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {t('lessonsBalance')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('remainingLessons')} <span className="font-bold text-accent">{user?.remainingLessons || 0} {t('lessonsToSchedule')}</span>
                      </p>
                    </div>
                    <Button variant="gradient">
                      {t('buyMoreLessons')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Próximas Aulas */}
              <Card className="shadow-lg border-0">
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
                          <div className="text-sm font-medium text-foreground">{lesson.date}</div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {lesson.time}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{lesson.teacher}</span>
                            <Badge className={lesson.type === "trial" ? "bg-lesson-trial text-white" : "bg-lesson-available text-white"}>
                              {lesson.type === "trial" ? "Experimental" : "Regular"}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-accent border-accent">
                            {t('confirmed')}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="gradient" 
                        size="sm"
                        onClick={() => window.open(lesson.meetLink, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {t('enterLesson')}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Atividade Recente */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {t('recentActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-soft transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'completed' ? 'bg-accent' :
                        activity.type === 'scheduled' ? 'bg-primary' :
                        activity.type === 'feedback' ? 'bg-lesson-trial' :
                        'bg-muted-foreground'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Seu Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Aulas Concluídas</span>
                      <span>8/12</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Avaliação Média</span>
                      <span>4.8/5.0</span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Ver Relatório Completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
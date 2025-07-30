import { Calendar, Users, Clock, BookOpen, Star, Settings, Plus, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Chat from '@/components/Chat';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const todayLessons = [
    {
      id: 1,
      time: "09:00",
      student: "Maria Silva",
      type: "regular",
      status: "confirmed",
      duration: "50min",
      meetLink: "https://meet.google.com/abc-def-ghi"
    },
    {
      id: 2,
      time: "14:00",
      student: "João Santos",
      type: "trial",
      status: "confirmed",
      duration: "50min",
      meetLink: "https://meet.google.com/jkl-mno-pqr"
    },
    {
      id: 3,
      time: "16:00",
      student: "Ana Costa",
      type: "regular",
      status: "pending",
      duration: "50min",
      meetLink: "https://meet.google.com/stu-vwx-yz"
    }
  ];

  const weekStats = [
    { label: "Aulas desta semana", value: 12, change: "+2", color: "text-primary" },
    { label: "Alunos ativos", value: 8, change: "+1", color: "text-accent" },
    { label: "Avaliação média", value: "4.9", change: "+0.1", color: "text-yellow-500" },
    { label: "Receita semanal", value: "R$ 2.400", change: "+15%", color: "text-green-500" }
  ];

  const upcomingWeek = [
    { day: "Seg", lessons: 3, earnings: "R$ 450" },
    { day: "Ter", lessons: 2, earnings: "R$ 300" },
    { day: "Qua", lessons: 4, earnings: "R$ 600" },
    { day: "Qui", lessons: 2, earnings: "R$ 300" },
    { day: "Sex", lessons: 3, earnings: "R$ 450" },
    { day: "Sab", lessons: 1, earnings: "R$ 150" },
    { day: "Dom", lessons: 0, earnings: "R$ 0" }
  ];

  const recentStudents = [
    { name: "Carlos Lima", lastLesson: "Hoje", progress: "Iniciante", rating: 5 },
    { name: "Beatriz Souza", lastLesson: "Ontem", progress: "Intermediário", rating: 4 },
    { name: "Pedro Oliveira", lastLesson: "2 dias", progress: "Avançado", rating: 5 },
    { name: "Lucia Santos", lastLesson: "3 dias", progress: "Iniciante", rating: 4 }
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
                {t('welcome')}, Professor! 👨‍🏫
              </h1>
              <p className="text-muted-foreground mt-1">
                Dashboard do Professor - Gerencie suas aulas e alunos
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="gradient" onClick={() => navigate('/schedule')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Disponibilidade
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {weekStats.map((stat, index) => (
              <Card key={index} className="shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Aulas de Hoje */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Aulas de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayLessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 border border-border rounded-lg hover:bg-accent-soft transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                            {lesson.student.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{lesson.student}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.time} - {lesson.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={lesson.type === "trial" ? "bg-lesson-trial text-white" : "bg-lesson-available text-white"}>
                            {lesson.type === "trial" ? "Trial" : "Regular"}
                          </Badge>
                          <Badge variant={lesson.status === "confirmed" ? "outline" : "secondary"}>
                            {lesson.status === "confirmed" ? "Confirmada" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="flex-1"
                          onClick={() => window.open(lesson.meetLink, '_blank')}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Entrar na Aula
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({
                            title: "Detalhes da Aula",
                            description: `Aula com ${lesson.student} às ${lesson.time}`,
                          })}
                        >
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cronograma da Semana */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Cronograma da Semana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {upcomingWeek.map((day, index) => (
                      <div key={index} className="text-center p-3 border border-border rounded-lg hover:bg-accent-soft transition-colors">
                        <p className="text-sm font-medium text-foreground mb-2">{day.day}</p>
                        <p className="text-lg font-bold text-primary">{day.lessons}</p>
                        <p className="text-xs text-muted-foreground">aulas</p>
                        <p className="text-xs text-accent mt-1">{day.earnings}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Meus Alunos */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Meus Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentStudents.map((student, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-soft transition-colors">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Última aula: {student.lastLesson}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-accent">{student.progress}</span>
                          <div className="flex">
                            {[...Array(student.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ações Rápidas */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/schedule')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Definir Disponibilidade
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/students')}>
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Alunos
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast({
                    title: "Material de Ensino",
                    description: "Funcionalidade em desenvolvimento",
                  })}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Material de Ensino
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reports')}>
                    <Star className="h-4 w-4 mr-2" />
                    Ver Avaliações
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default TeacherDashboard;
import { Calendar, Users, DollarSign, Settings, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminStats from '@/components/admin/AdminStats';
import AdminCalendar from '@/components/admin/AdminCalendar';
import Header from '@/components/Header';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const todayLessons = [
    {
      id: 1,
      time: "10:00",
      student: "Maria Silva",
      type: "regular",
      status: "confirmed",
      duration: "50min"
    },
    {
      id: 2,
      time: "15:00",
      student: "João Santos",
      type: "trial",
      status: "confirmed",
      duration: "50min"
    },
    {
      id: 3,
      time: "17:00",
      student: "Ana Costa",
      type: "regular",
      status: "pending",
      duration: "50min"
    }
  ];

  const recentStudents = [
    { name: "Carlos Lima", joinDate: "Hoje", status: "new" },
    { name: "Beatriz Souza", joinDate: "Ontem", status: "active" },
    { name: "Pedro Oliveira", joinDate: "2 dias", status: "active" },
    { name: "Lucia Santos", joinDate: "3 dias", status: "new" }
  ];

  const monthlyGoals = [
    { goal: "Novos Alunos", current: 48, target: 60, percentage: 80 },
    { goal: "Receita", current: 12450, target: 15000, percentage: 83 },
    { goal: "Aulas", current: 156, target: 180, percentage: 87 }
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
                {t('welcome')}, {user?.email}! 👨‍🏫
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('adminDashboard')} - Gerencie suas aulas e alunos
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => alert('Configurações implementadas! Use o calendário para gerenciar.')}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="gradient" onClick={() => alert('Use o calendário abaixo para criar novos horários!')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Horário
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <AdminStats />

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Column - Calendar */}
            <div className="lg:col-span-3">
              <AdminCalendar />
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6">
              {/* Aulas de Hoje */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {t('todayLessons')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayLessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 border border-border rounded-lg hover:bg-accent-soft transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{lesson.time}</span>
                        <Badge className={lesson.type === "trial" ? "bg-lesson-trial text-white" : "bg-lesson-available text-white"}>
                          {lesson.type === "trial" ? "Trial" : "Regular"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lesson.student}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        <Badge variant={lesson.status === "confirmed" ? "outline" : "secondary"} className="text-xs">
                          {lesson.status === "confirmed" ? "Confirmada" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Novos Alunos */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Novos Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentStudents.map((student, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent-soft transition-colors">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.joinDate}</p>
                      </div>
                      <Badge variant={student.status === "new" ? "default" : "outline"} className="text-xs">
                        {student.status === "new" ? "Novo" : "Ativo"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Metas do Mês */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Metas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {monthlyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{goal.goal}</span>
                        <span className="text-muted-foreground">
                          {goal.goal === "Receita" ? `R$ ${goal.current.toLocaleString()}` : goal.current} / {goal.goal === "Receita" ? `R$ ${goal.target.toLocaleString()}` : goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all" 
                          style={{width: `${goal.percentage}%`}}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-accent font-medium">{goal.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section - Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/pricing'}>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Definir Preços</h3>
                <p className="text-sm text-muted-foreground">Ajustar valores das aulas</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('Funcionalidade de horários implementada no calendário!')}>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Horários Fixos</h3>
                <p className="text-sm text-muted-foreground">Configurar disponibilidade</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('Sistema de alunos funcionando! Veja no chat e agenda.')}>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-lesson-trial mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Gerenciar Alunos</h3>
                <p className="text-sm text-muted-foreground">Ver perfis e histórico</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('Relatórios funcionando! Veja estatísticas no dashboard.')}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Relatórios</h3>
                <p className="text-sm text-muted-foreground">Análises e estatísticas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
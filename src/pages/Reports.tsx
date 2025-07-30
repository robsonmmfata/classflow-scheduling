import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Reports = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const monthlyData = [
    { month: 'Jan', revenue: 2400, lessons: 45, students: 12 },
    { month: 'Fev', revenue: 3200, lessons: 58, students: 15 },
    { month: 'Mar', revenue: 2800, lessons: 52, students: 14 },
    { month: 'Abr', revenue: 3800, lessons: 68, students: 18 },
    { month: 'Mai', revenue: 4200, lessons: 75, students: 20 },
    { month: 'Jun', revenue: 3900, lessons: 70, students: 19 },
  ];

  const lessonTypes = [
    { name: 'Aulas Regulares', value: 68, color: '#8884d8' },
    { name: 'Aulas Trial', value: 22, color: '#82ca9d' },
    { name: 'Aulas de Reposição', value: 10, color: '#ffc658' },
  ];

  const weeklyData = [
    { day: 'Seg', lessons: 12 },
    { day: 'Ter', lessons: 8 },
    { day: 'Qua', lessons: 15 },
    { day: 'Qui', lessons: 10 },
    { day: 'Sex', lessons: 14 },
    { day: 'Sab', lessons: 6 },
    { day: 'Dom', lessons: 3 },
  ];

  const handleExport = () => {
    toast({
      title: "Relatório exportado",
      description: "Seu relatório foi exportado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Relatórios
              </h1>
              <p className="text-muted-foreground mt-2">
                Análises e estatísticas detalhadas
              </p>
            </div>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-2xl font-bold text-foreground">R$ 18.400</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-green-500 mt-2">+15% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Aulas</p>
                    <p className="text-2xl font-bold text-foreground">328</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-blue-500 mt-2">+12% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                    <p className="text-2xl font-bold text-foreground">98</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-sm text-purple-500 mt-2">+8% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-foreground">94%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-green-500 mt-2">+2% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Receita Mensal */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição de Tipos de Aula */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Tipos de Aula</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={lessonTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lessonTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Evolução de Alunos */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Evolução de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Aulas por Dia da Semana */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Aulas por Dia da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="lessons" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
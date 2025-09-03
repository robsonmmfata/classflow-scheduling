import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/contexts/StudentsContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Reports = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { students, lessons } = useStudents();

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [lessonTypes, setLessonTypes] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateReportsData();
  }, [students, lessons]);

  const generateReportsData = async () => {
    try {
      // Generate monthly data based on real lessons
      const monthlyStats = generateMonthlyStats();
      setMonthlyData(monthlyStats);

      // Generate lesson types distribution
      const typesData = generateLessonTypesData();
      setLessonTypes(typesData);

      // Generate weekly data
      const weeklyStats = generateWeeklyStats();
      setWeeklyData(weeklyStats);

    } catch (error) {
      console.error('Error generating reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthlyStats = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.scheduled_date);
        return lessonDate.getMonth() === date.getMonth() && 
               lessonDate.getFullYear() === date.getFullYear();
      });

      const revenue = monthLessons.reduce((sum, lesson) => sum + (lesson.price_paid || 0), 0);
      const studentsCount = new Set(monthLessons.map(l => l.student_id)).size;

      last6Months.push({
        month: monthName,
        revenue: Number(revenue.toFixed(2)),
        lessons: monthLessons.length,
        students: studentsCount
      });
    }
    
    return last6Months;
  };

  const generateLessonTypesData = () => {
    const regularLessons = lessons.filter(l => l.notes !== 'trial').length;
    const trialLessons = lessons.filter(l => l.notes === 'trial').length;
    const makeupLessons = lessons.filter(l => l.status === 'cancelled').length;

    return [
      { name: 'Aulas Regulares', value: regularLessons, color: '#8884d8' },
      { name: 'Aulas Trial', value: trialLessons, color: '#82ca9d' },
      { name: 'Aulas Canceladas', value: makeupLessons, color: '#ffc658' },
    ];
  };

  const generateWeeklyStats = () => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    
    return daysOfWeek.map((day, index) => {
      const dayLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.scheduled_date);
        return lessonDate.getDay() === index;
      });
      
      return { day, lessons: dayLessons.length };
    });
  };

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  // Calculate real-time stats
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalLessons = lessons.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const completedLessons = lessons.filter(l => l.status === 'completed').length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const exportPDF = () => {
    try {
      const doc = new jsPDF();

      doc.text('Relatório Mensal', 14, 16);
      autoTable(doc, {
        startY: 20,
        head: [['Mês', 'Receita', 'Aulas', 'Alunos']],
        body: monthlyData.map(d => [d.month, d.revenue, d.lessons, d.students]),
      });
      doc.save('relatorio_mensal.pdf');
      toast({
        title: "PDF Exportado",
        description: "O relatório mensal foi exportado com sucesso para PDF.",
      });
      console.log("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro na Exportação",
        description: `Não foi possível exportar o PDF. Erro: ${(error as Error).message}. Verifique a instalação e compatibilidade de 'jspdf' e 'jspdf-autotable'.`,
        variant: "destructive",
      });
    }
  };

  const exportXLS = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(monthlyData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório Mensal');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, 'relatorio_mensal.xlsx');
      toast({
        title: "XLS Exportado",
        description: "O relatório mensal foi exportado com sucesso para XLS.",
      });
      console.log("XLS exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar XLS:", error);
      toast({
        title: "Erro na Exportação",
        description: `Não foi possível exportar o XLS. Erro: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                {t("reports")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t("reportsDesc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportPDF}>
                <Download className="h-4 w-4 mr-2" />
                {t("exportPDF")}
              </Button>
              <Button onClick={exportXLS}>
                <Download className="h-4 w-4 mr-2" />
                {t("exportXLS")}
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">{t("totalRevenue")}</p>
                     <p className="text-2xl font-bold text-foreground">R$ {totalRevenue.toLocaleString()}</p>
                   </div>
                   <DollarSign className="h-8 w-8 text-green-500" />
                 </div>
                <p className="text-sm text-green-500 mt-2">+15% {t("vs_previous_month")}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">{t("totalLessons")}</p>
                     <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                   </div>
                   <Calendar className="h-8 w-8 text-blue-500" />
                 </div>
                <p className="text-sm text-blue-500 mt-2">+12% {t("vs_previous_month")}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">{t("activeStudents")}</p>
                     <p className="text-2xl font-bold text-foreground">{activeStudents}</p>
                   </div>
                   <Users className="h-8 w-8 text-purple-500" />
                 </div>
                <p className="text-sm text-purple-500 mt-2">+8% {t("vs_previous_month")}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">{t("completionRate")}</p>
                     <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                   </div>
                   <TrendingUp className="h-8 w-8 text-green-500" />
                 </div>
                <p className="text-sm text-green-500 mt-2">+2% {t("vs_previous_month")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Receita Mensal */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>{t("monthlyRevenue")}</CardTitle>
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
                <CardTitle>{t("lessonTypes")}</CardTitle>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <CardTitle>{t("studentEvolution")}</CardTitle>
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
                <CardTitle>{t("weeklyLessons")}</CardTitle>
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

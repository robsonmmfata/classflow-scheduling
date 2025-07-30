import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importa o plugin jspdf-autotable
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']; // Define cores para o PieChart

  const weeklyData = [
    { day: 'Seg', lessons: 12 },
    { day: 'Ter', lessons: 8 },
    { day: 'Qua', lessons: 15 },
    { day: 'Qui', lessons: 10 },
    { day: 'Sex', lessons: 14 },
    { day: 'Sab', lessons: 6 },
    { day: 'Dom', lessons: 3 },
  ];

  const exportPDF = () => {
    try {
      const doc = new jsPDF();

      // IMPORTANTE: O plugin 'jspdf-autotable' modifica o protótipo de jsPDF
      // ao ser importado. Se 'autoTable' não for encontrado aqui, isso indica um
      // problema com a forma como o plugin está sendo carregado/bundlado em seu ambiente.
      // Isso NÃO é um erro de código dentro desta função, mas um problema de ambiente.
      if (typeof (jsPDF.prototype as any).autoTable === 'undefined') {
        throw new Error("Plugin 'jspdf-autotable' não foi carregado corretamente. A função 'autoTable' não está disponível no jsPDF. Isso geralmente ocorre devido a problemas de ambiente/bundling ou incompatibilidade de versões. Por favor, siga os passos de limpeza de cache e reinstalação das dependências.");
      }

      doc.text('Relatório Mensal', 14, 16);
      (doc as any).autoTable({ // O 'as any' é para TypeScript, indica que autoTable existe em tempo de execução
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
        description: `Não foi possível exportar o PDF. Erro: ${(error as Error).message}`,
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
                Relatórios
              </h1>
              <p className="text-muted-foreground mt-2">
                Análises e estatísticas detalhadas
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como PDF
              </Button>
              <Button onClick={exportXLS}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como XLS
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

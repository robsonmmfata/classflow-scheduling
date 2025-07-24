import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminStats = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('totalStudents'),
      value: '48',
      change: '+12%',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('monthlyRevenue'),
      value: 'R$ 12.450',
      change: '+8%',
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: t('todayLessons'),
      value: '6',
      change: 'Normal',
      icon: Calendar,
      color: 'text-lesson-trial',
      bgColor: 'bg-lesson-trial/10'
    },
    {
      title: 'Taxa de Conversão',
      value: '68%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <span className="text-xs text-accent bg-accent-soft px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
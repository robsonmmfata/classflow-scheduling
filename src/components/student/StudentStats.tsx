import { Calendar, Clock, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const StudentStats = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('totalLessons'),
      value: '12',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: t('lessonsThisMonth'),
      value: '4',
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: t('nextLesson'),
      value: 'Hoje 15:00',
      icon: Clock,
      color: 'text-lesson-trial',
      bgColor: 'bg-lesson-trial/10'
    },
    {
      title: 'Avaliação Média',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
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
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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

export default StudentStats;
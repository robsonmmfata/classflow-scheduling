import { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStudents } from '@/contexts/StudentsContext';
import Header from '@/components/Header';

const Students = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { students, lessons, isLoading } = useStudents();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStudentLessonsCount = (studentId: string) => {
    return lessons.filter(lesson => lesson.student_id === studentId).length;
  };

  const getNextLesson = (studentId: string) => {
    const studentLessons = lessons
      .filter(lesson => lesson.student_id === studentId && lesson.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
    
    return studentLessons[0] ? `${studentLessons[0].scheduled_date} ${studentLessons[0].scheduled_time}` : null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active');
      case 'trial': return t('trial');
      case 'inactive': return t('inactive');
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-8 w-8 text-primary" />
                  {t('manageStudentsTitle')}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t('manageStudentsDesc')}
                </p>
            </div>
          </div>

          {/* Filtros */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchByName')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-md"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="trial">{t('trial')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Alunos */}
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {student.name.charAt(0)}
                      </div>
                       <div>
                         <h3 className="font-semibold text-lg">{student.name}</h3>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                           <div className="flex items-center gap-1">
                             <Mail className="h-4 w-4" />
                             {student.email}
                           </div>
                           {student.phone && (
                             <div className="flex items-center gap-1">
                               <Phone className="h-4 w-4" />
                               {student.phone}
                             </div>
                           )}
                         </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(student.status)} text-white`}>
                        {getStatusText(student.status)}
                      </Badge>
                       <div className="text-right">
                         <p className="text-sm font-medium">{getStudentLessonsCount(student.id)} {t('lessons')}</p>
                         <p className="text-xs text-muted-foreground">{student.remaining_lessons} restantes</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                     <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4 text-sm">
                         <span className="text-muted-foreground">Status: <span className="text-accent font-medium">{getStatusText(student.status)}</span></span>
                         {getNextLesson(student.id) && (
                           <div className="flex items-center gap-1">
                             <Calendar className="h-4 w-4 text-muted-foreground" />
                             <span className="text-muted-foreground">{t('nextLesson')}: {getNextLesson(student.id)}</span>
                           </div>
                         )}
                       </div>
                      <div className="flex gap-2">
                         {student.phone && (
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => window.open(`https://wa.me/${student.phone.replace(/\D/g, '')}`, '_blank')}
                           >
                             WhatsApp
                           </Button>
                         )}
                        <Button size="sm" variant="outline">
                          {t('viewProfile')}
                        </Button>
                        <Button size="sm" variant="default">
                          {t('scheduleLesson')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{t('noStudentsFound')}</h3>
                <p className="text-muted-foreground">{t('adjustSearchFilters')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
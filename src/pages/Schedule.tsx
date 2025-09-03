import { useState, useEffect } from 'react';
import { Calendar, Clock, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

const Schedule = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [workingHours, setWorkingHours] = useState({
    start: '08:00',
    end: '19:00'
  });

  const [fixedSlots, setFixedSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newSlot, setNewSlot] = useState({
    day: '',
    time: '',
    duration: 50
  });

  useEffect(() => {
    loadScheduleData();
  }, [user]);

  const loadScheduleData = async () => {
    if (!user?.id) return;

    try {
      // Load schedule settings
      const { data: settings } = await supabase
        .from('schedule_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settings) {
        setWorkingHours({
          start: settings.work_start_time,
          end: settings.work_end_time
        });
      }

      // Load fixed schedules
      const { data: schedules } = await supabase
        .from('fixed_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week, time');

      if (schedules) {
        setFixedSlots(schedules);
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const days = [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')];

  const handleAddSlot = async () => {
    if (!newSlot.day || !newSlot.time || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from('fixed_schedules')
        .insert({
          user_id: user.id,
          day_of_week: newSlot.day,
          time: newSlot.time,
          duration_minutes: newSlot.duration
        })
        .select()
        .single();

      if (error) throw error;

      setFixedSlots([...fixedSlots, data]);
      setNewSlot({ day: '', time: '', duration: 50 });
      
      toast({
        title: t('scheduleAdded'),
        description: t('scheduleAddedDesc'),
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o horário.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fixed_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFixedSlots(fixedSlots.filter(slot => slot.id !== id));
      
      toast({
        title: t('scheduleRemoved'),
        description: t('scheduleRemovedDesc'),
      });
    } catch (error) {
      console.error('Error removing schedule:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o horário.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      // Save or update schedule settings
      const { error } = await supabase
        .from('schedule_settings')
        .upsert({
          user_id: user.id,
          work_start_time: workingHours.start,
          work_end_time: workingHours.end
        });

      if (error) throw error;

      toast({
        title: t('configurationsSaved'),
        description: t('configurationsSavedDesc'),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              {t('fixedSchedules')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('configureAvailability')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurações Gerais */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>{t('workingHours')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start">{t('start')}</Label>
                  <Input
                    id="start"
                    type="time"
                    value={workingHours.start}
                    onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">{t('end')}</Label>
                  <Input
                    id="end"
                    type="time"
                    value={workingHours.end}
                    onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Adicionar Novo Horário */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>{t('addFixedSchedule')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="day">{t('dayOfWeek')}</Label>
                  <select 
                    id="day"
                    className="w-full p-2 border border-border rounded-md"
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                  >
                    <option value="">{t('selectDay')}</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t('time')}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">{t('duration')}</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot({...newSlot, duration: Number(e.target.value)})}
                  />
                </div>
                <Button onClick={handleAddSlot} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addSchedule')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Horários Fixos */}
          <Card className="shadow-lg border-0 mt-8">
            <CardHeader>
              <CardTitle>{t('configuredSchedules')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fixedSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                     <div className="flex items-center gap-4">
                       <Badge variant="outline">{slot.day_of_week}</Badge>
                       <div className="flex items-center gap-2">
                         <Clock className="h-4 w-4 text-muted-foreground" />
                         <span className="font-medium">{slot.time}</span>
                       </div>
                       <span className="text-sm text-muted-foreground">{slot.duration_minutes} min</span>
                     </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveSlot(slot.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleSave} className="w-full mt-6">
                <Save className="h-4 w-4 mr-2" />
                {t('saveConfigurations')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
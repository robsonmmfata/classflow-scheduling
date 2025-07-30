import { useState } from 'react';
import { Calendar, Clock, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Schedule = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [workingHours, setWorkingHours] = useState({
    start: '08:00',
    end: '19:00'
  });

  const [fixedSlots, setFixedSlots] = useState([
    { id: 1, day: 'Segunda', time: '08:00', duration: 50 },
    { id: 2, day: 'Segunda', time: '09:00', duration: 50 },
    { id: 3, day: 'Terça', time: '14:00', duration: 50 },
  ]);

  const [newSlot, setNewSlot] = useState({
    day: '',
    time: '',
    duration: 50
  });

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleAddSlot = () => {
    if (newSlot.day && newSlot.time) {
      setFixedSlots([...fixedSlots, {
        id: Date.now(),
        ...newSlot
      }]);
      setNewSlot({ day: '', time: '', duration: 50 });
      toast({
        title: "Horário adicionado",
        description: "Novo horário fixo adicionado com sucesso!",
      });
    }
  };

  const handleRemoveSlot = (id: number) => {
    setFixedSlots(fixedSlots.filter(slot => slot.id !== id));
    toast({
      title: "Horário removido",
      description: "Horário fixo removido com sucesso!",
    });
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Seus horários fixos foram atualizados!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Horários Fixos
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure sua disponibilidade semanal
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurações Gerais */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Horário de Trabalho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Início</Label>
                  <Input
                    id="start"
                    type="time"
                    value={workingHours.start}
                    onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Fim</Label>
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
                <CardTitle>Adicionar Horário Fixo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Dia da Semana</Label>
                  <select 
                    id="day"
                    className="w-full p-2 border border-border rounded-md"
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                  >
                    <option value="">Selecione um dia</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot({...newSlot, duration: Number(e.target.value)})}
                  />
                </div>
                <Button onClick={handleAddSlot} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Horário
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Horários Fixos */}
          <Card className="shadow-lg border-0 mt-8">
            <CardHeader>
              <CardTitle>Horários Configurados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fixedSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{slot.day}</Badge>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{slot.duration} min</span>
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
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
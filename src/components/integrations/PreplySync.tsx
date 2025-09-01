import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, RefreshCw, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreplyLesson {
  id: string;
  student_name: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'completed';
  subject: string;
}

export const PreplySync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lessons, setLessons] = useState<PreplyLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [preplyEmail, setPreplyEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    checkPreplyConnection();
  }, []);

  const checkPreplyConnection = () => {
    const savedEmail = localStorage.getItem('preply_email');
    const savedToken = localStorage.getItem('preply_token');
    
    if (savedEmail && savedToken) {
      setPreplyEmail(savedEmail);
      setApiToken(savedToken);
      setIsConnected(true);
    }
  };

  const connectPreply = async () => {
    if (!preplyEmail || !apiToken) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o email e token da API do Preply.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would validate the credentials with Preply API
      // For now, we'll simulate the connection
      
      setTimeout(() => {
        localStorage.setItem('preply_email', preplyEmail);
        localStorage.setItem('preply_token', apiToken);
        setIsConnected(true);
        setLoading(false);
        
        toast({
          title: "Preply Conectado!",
          description: "Sua conta do Preply foi sincronizada com sucesso.",
        });
        
        // Auto-sync after connection
        syncPreplyLessons();
      }, 2000);

    } catch (error) {
      console.error('Preply connection error:', error);
      setLoading(false);
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível conectar com o Preply. Verifique suas credenciais.",
        variant: "destructive",
      });
    }
  };

  const syncPreplyLessons = async () => {
    setSyncStatus('syncing');
    try {
      // This would fetch lessons from Preply API
      // For now, we'll simulate some lessons
      
      const mockLessons: PreplyLesson[] = [
        {
          id: 'preply_1',
          student_name: 'Maria Silva',
          start_time: '2024-01-15T10:00:00',
          end_time: '2024-01-15T11:00:00',
          status: 'confirmed',
          subject: 'Portuguese Conversation'
        },
        {
          id: 'preply_2',
          student_name: 'John Smith',
          start_time: '2024-01-15T15:00:00',
          end_time: '2024-01-15T16:00:00',
          status: 'confirmed',
          subject: 'Business Portuguese'
        },
        {
          id: 'preply_3',
          student_name: 'Anna Johnson',
          start_time: '2024-01-15T18:00:00',
          end_time: '2024-01-15T19:00:00',
          status: 'pending',
          subject: 'Portuguese Grammar'
        }
      ];

      setTimeout(() => {
        setLessons(mockLessons);
        setSyncStatus('success');
        toast({
          title: "Sincronização Completa",
          description: `${mockLessons.length} aulas encontradas no Preply.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Preply sync error:', error);
      setSyncStatus('error');
      toast({
        title: "Erro na Sincronização",
        description: "Não foi possível sincronizar com o Preply.",
        variant: "destructive",
      });
    }
  };

  const disconnectPreply = () => {
    localStorage.removeItem('preply_email');
    localStorage.removeItem('preply_token');
    setIsConnected(false);
    setLessons([]);
    setSyncStatus('idle');
    setPreplyEmail("");
    setApiToken("");
    
    toast({
      title: "Preply Desconectado",
      description: "A sincronização com o Preply foi desativada.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary', 
      completed: 'outline'
    } as const;

    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status === 'confirmed' ? 'Confirmada' : 
         status === 'pending' ? 'Pendente' :
         'Concluída'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Integração Preply
        </CardTitle>
        <CardDescription>
          Sincronize suas aulas do Preply para evitar conflitos de horários
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>

          {isConnected && (
            <div className="space-x-2">
              <Button
                onClick={syncPreplyLessons}
                disabled={syncStatus === 'syncing'}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                Sincronizar
              </Button>
              
              <Button
                onClick={disconnectPreply}
                size="sm"
                variant="destructive"
              >
                Desconectar
              </Button>
            </div>
          )}
        </div>

        {!isConnected && (
          <div className="space-y-4 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Configuração do Preply</span>
            </div>
            
            <div className="grid gap-3">
              <div>
                <Label htmlFor="preply-email">Email do Preply</Label>
                <Input
                  id="preply-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={preplyEmail}
                  onChange={(e) => setPreplyEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="preply-token">Token da API</Label>
                <Input
                  id="preply-token"
                  type="password"
                  placeholder="Token da API do Preply"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Encontre seu token em: Preply → Configurações → Integração API
                </p>
              </div>
            </div>
            
            <Button
              onClick={connectPreply}
              disabled={loading || !preplyEmail || !apiToken}
              className="w-full"
            >
              {loading ? 'Conectando...' : 'Conectar com Preply'}
            </Button>
          </div>
        )}

        {isConnected && lessons.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">
              Aulas do Preply Hoje ({lessons.length})
            </h4>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-muted p-3 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{lesson.student_name}</div>
                    {getStatusBadge(lesson.status)}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{lesson.subject}</div>
                    <div>
                      {new Date(lesson.start_time).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(lesson.end_time).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isConnected && syncStatus === 'success' && lessons.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Nenhuma aula do Preply encontrada para hoje
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-medium text-blue-800 mb-1">Como obter o Token da API:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Acesse sua conta do Preply</li>
            <li>Vá em Configurações → Integração</li>
            <li>Gere um novo token de API</li>
            <li>Cole o token no campo acima</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
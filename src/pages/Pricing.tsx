import { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Pricing = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [prices, setPrices] = useState({
    trial: 5,
    package4: 15,
    package8: 13,
    quarterly: 12
  });

  const handleSave = () => {
    toast({
      title: "Preços atualizados",
      description: "Os novos preços foram salvos com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              Definir Preços
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure os valores das aulas e pacotes
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Configuração de Preços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trial">Aula Experimental (USD)</Label>
                  <Input
                    id="trial"
                    type="number"
                    value={prices.trial}
                    onChange={(e) => setPrices({...prices, trial: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package4">Pacote 4 Aulas (USD por aula)</Label>
                  <Input
                    id="package4"
                    type="number"
                    value={prices.package4}
                    onChange={(e) => setPrices({...prices, package4: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package8">Pacote 8 Aulas (USD por aula)</Label>
                  <Input
                    id="package8"
                    type="number"
                    value={prices.package8}
                    onChange={(e) => setPrices({...prices, package8: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quarterly">Pacote Trimestral (USD por aula)</Label>
                  <Input
                    id="quarterly"
                    type="number"
                    value={prices.quarterly}
                    onChange={(e) => setPrices({...prices, quarterly: Number(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Preços
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
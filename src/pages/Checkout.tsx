import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PaymentSelector } from '@/components/PaymentSelector';
import Header from '@/components/Header';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [packageType, setPackageType] = useState<string>('');

  useEffect(() => {
    const urlPackage = searchParams.get('package');
    const storedPackage = localStorage.getItem('selectedPackage');
    
    const selectedPackage = urlPackage || storedPackage;
    
    if (!selectedPackage) {
      navigate('/');
      return;
    }

    // Clear stored package if we got it from URL
    if (urlPackage && storedPackage) {
      localStorage.removeItem('selectedPackage');
    }
    
    setPackageType(selectedPackage);
  }, [searchParams, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para acessar o checkout.
            </p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full mt-4"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packageType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Carregando informações do pacote...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePaymentSuccess = (paymentData: any) => {
    // Store payment info and redirect to success page
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    navigate('/payment-success');
  };

  const studentInfo = {
    name: user.email || 'Usuário',
    email: user.email || '',
    phone: ''
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Finalizar Compra
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{studentInfo.name}</p>
                    <p className="text-sm text-muted-foreground">Nome completo</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{studentInfo.email}</p>
                    <p className="text-sm text-muted-foreground">Email de contato</p>
                  </div>
                </div>
                
                {studentInfo.phone && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{studentInfo.phone}</p>
                      <p className="text-sm text-muted-foreground">Telefone (opcional)</p>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-1">Informação importante:</p>
                  <p className="text-blue-800">
                    Suas informações são seguras e serão usadas apenas para processar 
                    seu pagamento e agendar suas aulas.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <div>
              <PaymentSelector
                packageType={packageType as any}
                studentInfo={studentInfo}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
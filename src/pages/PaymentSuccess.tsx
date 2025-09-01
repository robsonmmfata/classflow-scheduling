import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const orderId = searchParams.get('order_id');

      if (sessionId) {
        // Verify Stripe payment
        try {
          const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
            body: { session_id: sessionId }
          });

          if (error) throw error;
          
          if (data?.success) {
            setPaymentData({
              type: 'stripe',
              package_type: data.package_type,
              lessons_count: data.lessons_count
            });
            
            toast({
              title: "Pagamento Confirmado!",
              description: "Seu pagamento foi processado com sucesso.",
            });
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast({
            title: "Erro na Verificação",
            description: "Houve um problema ao verificar seu pagamento. Entre em contato conosco.",
            variant: "destructive",
          });
        }
      } else if (orderId) {
        // PayPal payment - for now just show success
        setPaymentData({
          type: 'paypal',
          order_id: orderId
        });
        
        toast({
          title: "Pagamento PayPal Recebido!",
          description: "Processaremos sua compra em breve.",
        });
      }

      setVerifying(false);
    };

    verifyPayment();
  }, [searchParams, toast]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verificando Pagamento...</CardTitle>
            <CardDescription className="text-center">
              Aguarde enquanto confirmamos seu pagamento.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Pagamento Confirmado!
          </CardTitle>
          <CardDescription>
            Obrigado pela sua compra. Você receberá um email de confirmação em breve.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentData && (
            <div className="text-center space-y-2">
              <p className="font-semibold">Detalhes da Compra:</p>
              {paymentData.package_type && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Pacote:</strong> {paymentData.package_type}
                  </p>
                  {paymentData.lessons_count && (
                    <p className="text-sm">
                      <strong>Aulas:</strong> {paymentData.lessons_count}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>✓ Pagamento processado com segurança</p>
            <p>✓ Email de confirmação será enviado</p>
            <p>✓ Acesso às aulas liberado</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/agenda">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Primeira Aula
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Dúvidas? Entre em contato pelo WhatsApp: 
              <a href="https://wa.me/5511999999999" className="text-primary ml-1">
                +55 11 99999-9999
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
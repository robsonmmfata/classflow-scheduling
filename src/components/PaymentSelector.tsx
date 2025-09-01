import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentSelectorProps {
  packageType: 'trial' | 'package4' | 'package8' | 'monthly';
  studentInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  isGuest?: boolean;
  onPaymentSuccess?: (paymentData: any) => void;
}

export const PaymentSelector = ({ 
  packageType, 
  studentInfo, 
  isGuest = false, 
  onPaymentSuccess 
}: PaymentSelectorProps) => {
  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const packageInfo = {
    trial: {
      name: t('trialLesson'),
      price: '$25',
      description: t('descriptionTrial'),
      lessons: 1
    },
    package4: {
      name: t('package4'),
      price: '$180',
      description: t('descriptionPackage4'),
      lessons: 4
    },
    package8: {
      name: t('package8'),
      price: '$320',
      description: t('descriptionPackage8'),
      lessons: 8
    },
    monthly: {
      name: t('monthlyPlan'),
      price: '$480',
      description: t('descriptionQuarterly'),
      lessons: 12
    }
  };

  const currentPackage = packageInfo[packageType];

  const handleStripePayment = async () => {
    setLoading('stripe');
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: {
          packageType,
          studentInfo,
          isGuest
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar o pagamento via Stripe. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePayPalPayment = async () => {
    setLoading('paypal');
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: {
          packageType,
          studentInfo
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open PayPal checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar o pagamento via PayPal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-between">
          {currentPackage.name}
          {packageType === 'package8' && (
            <Badge variant="secondary">{t('mostPopular')}</Badge>
          )}
        </CardTitle>
        <CardDescription>{currentPackage.description}</CardDescription>
        <div className="text-3xl font-bold text-primary">
          {currentPackage.price}
        </div>
        <p className="text-sm text-muted-foreground">
          {currentPackage.lessons} {currentPackage.lessons === 1 ? 'aula' : 'aulas'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-semibold">Escolha sua forma de pagamento:</h4>
          
          <Button
            onClick={handleStripePayment}
            disabled={loading !== null}
            className="w-full"
            variant="default"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading === 'stripe' ? 'Processando...' : 'Pagar com Cartão de Crédito'}
          </Button>

          <Button
            onClick={handlePayPalPayment}
            disabled={loading !== null}
            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
            variant="secondary"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {loading === 'paypal' ? 'Processando...' : 'Pagar com PayPal'}
          </Button>
        </div>

        <Separator />
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Pagamento 100% seguro</p>
          <p>✓ SSL Criptografado</p>
          <p>✓ Política de cancelamento flexível</p>
        </div>

        {studentInfo && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Dados do aluno:</p>
            <p className="text-xs">{studentInfo.name}</p>
            <p className="text-xs">{studentInfo.email}</p>
            {studentInfo.phone && <p className="text-xs">{studentInfo.phone}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
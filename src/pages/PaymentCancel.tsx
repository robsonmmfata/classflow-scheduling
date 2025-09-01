import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentCancel = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Pagamento Cancelado
          </CardTitle>
          <CardDescription>
            Sua transação foi cancelada. Nenhuma cobrança foi realizada.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>• Não se preocupe, não foi cobrado nada</p>
            <p>• Você pode tentar novamente quando quiser</p>
            <p>• Seus dados estão seguros</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/pricing">
                <CreditCard className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              Precisa de Ajuda?
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Problemas técnicos no pagamento?</p>
              <p>• Dúvidas sobre os pacotes?</p>
              <p>• Quer agendar uma aula experimental grátis?</p>
            </div>
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              Métodos de pagamento aceitos: Cartão de crédito, PayPal, PIX
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
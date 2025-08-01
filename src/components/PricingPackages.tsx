import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const PricingPackages = () => {
  const packages = [
    {
      id: "trial",
      name: "Aula Experimental",
      price: "US$ 5",
      originalPrice: "",
      description: "Experimente nossa metodologia",
      icon: Star,
      popular: false,
      features: [
        "1 aula de 25 minutos",
        "Material didático incluído",
        
    
      ],
      buttonText: "Agendar Experimental",
      buttonVariant: "trial" as const
    },
    {
      id: "package-4",
      name: "Pacote 4 Aulas",
      price: "US$ 60",
      originalPrice: "",
      description: "Ideal para começar",
      icon: Zap,
      popular: true,
      features: [
        "4 aulas de 50 minutos",
        "US$ 15 por aula",
        "Material didático incluído"
    
        
      ],
      buttonText: "Comprar Pacote",
      buttonVariant: "gradient" as const
    },
    {
      id: "package-8",
      name: "Pacote 8 Aulas",
      price: "US$ 104",
      originalPrice: "",
      description: "Melhor custo-benefício",
      icon: Crown,
      popular: false,
      features: [
        "8 aulas de 50 minutos",
        "US$ 13 por aula",
        "Material didático incluído",
        "2 aulas bônus"
      ],
      buttonText: "Comprar Pacote",
      buttonVariant: "success" as const
    },
    {
      id: "quarterly",
      name: "Plano Trimestral",
      price: "US$ 144",
      originalPrice: "",
      description: "Máximo aproveitamento",
      icon: Crown,
      popular: false,
      features: [
        "12 aulas trimestrais",
        "US$ 12 por aula",
        "Material didático premium"
  
      ],
      buttonText: "Assinar Plano",
      buttonVariant: "gradient" as const
    }
  ];

  return (
    <section id="pacotes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pacotes e Planos
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para seu aprendizado
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            return (
              <Card 
                key={pkg.id} 
                className={`relative border-2 transition-all duration-smooth hover:shadow-lg ${
                  pkg.popular 
                    ? 'border-primary shadow-glow bg-gradient-card' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center space-y-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    pkg.popular ? 'bg-gradient-primary' : 'bg-primary'
                  }`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    {pkg.id === "monthly" && (
                      <p className="text-sm text-muted-foreground">/mês</p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={pkg.buttonVariant} 
                    className="w-full"
                    size="lg"
                  >
                    {pkg.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            Aceita cartão de crédito, PIX, PayPal e transferência bancária
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Dúvidas sobre pagamento?
            </Button>
            <Button variant="ghost">
              Política de cancelamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPackages;
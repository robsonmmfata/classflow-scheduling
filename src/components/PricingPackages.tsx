import React from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingPackages = () => {
  const { t } = useLanguage();

  const packages = [
    {
      id: "trial",
      name: t("trialLesson"),
      price: "US$ 5",
      originalPrice: "",
      description: t("descriptionTrial"),
      icon: Star,
      popular: false,
      features: [
        t("oneLesson25min"),
        t("materialIncluded"),
      ],
      buttonText: t("scheduleExperimental"),
      buttonVariant: "trial" as const
    },
    {
      id: "package-4",
      name: t("package4"),
      price: "US$ 60",
      originalPrice: "",
      description: t("descriptionPackage4"),
      icon: Zap,
      popular: true,
      features: [
        t("fourLessons50min"),
        t("price15perLesson"),
        t("materialIncluded")
      ],
      buttonText: t("buyPackage"),
      buttonVariant: "gradient" as const
    },
    {
      id: "package-8",
      name: t("package8"),
      price: "US$ 104",
      originalPrice: "",
      description: t("descriptionPackage8"),
      icon: Crown,
      popular: false,
      features: [
        t("eightLessons50min"),
        t("price13perLesson"),
        t("materialIncluded"),
      ],
      buttonText: t("buyPackage"),
      buttonVariant: "success" as const
    },
    {
      id: "quarterly",
      name: "Plano Trimestral",
      price: "US$ 144",
      originalPrice: "",
      description: t("descriptionQuarterly"),
      icon: Crown,
      popular: false,
      features: [
        t("twelveQuarterlyLessons"),
        t("price12perLesson"),
        t("premiumMaterial")
      ],
      buttonText: t("subscribePlan"),
      buttonVariant: "gradient" as const
    }
  ];

  return (
    <React.Fragment>
      <div id="pacotes" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("packagesPlans")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("choosePlan")}
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
                      {t("mostPopular")}
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
          {t("paymentMethods")}
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline">
            {t("paymentQuestions")}
          </Button>
          <Button variant="ghost">
            {t("cancellationPolicy")}
          </Button>
        </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PricingPackages;

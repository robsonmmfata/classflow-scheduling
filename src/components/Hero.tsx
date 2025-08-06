import { Calendar, Clock, CheckCircle, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('scheduleOnlineLessons')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="gradient" size="lg">
                <Calendar className="h-5 w-5" />
                {t('scheduleTrialLesson')}
              </Button>
              <Button variant="outline" size="lg">
                {t('viewAvailableHours')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{t('flexibleHours')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{t('freeCancellation')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{t('qualifiedTeachers')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="mt-8">
              <Card className="overflow-hidden border-0 shadow-lg">
                <img 
                  src="/aulaonline.jpg" 
                  alt="Aula online" 
                  className="w-full h-auto object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

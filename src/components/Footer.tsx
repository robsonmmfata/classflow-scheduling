import { MessageCircle, Mail, Instagram, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-[150px] h-[150px] rounded-lg flex items-center justify-center">
                <img
                  src="/Fundotrasparentepequeno.png"
                  alt="Logo Brazuca Portuguese Language"
                  className="object-contain w-[250px] h-[250px]"
                />
              </div>
            </div>
            <p className="text-muted-foreground">
              {t('footerDescription')}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('services')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('privateLessons')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('trialLesson')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('packages')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('monthlyPlan')}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('support')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('helpCenter')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('cancellationPolicy')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('termsOfUse')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('privacy')}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('contact')}</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent border-muted-foreground text-background hover:bg-primary hover:text-white"
                onClick={() => window.open('https://wa.me/5521999999999', '_blank')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent border-muted-foreground text-background hover:bg-primary hover:text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-transparent border-muted-foreground text-background hover:bg-primary hover:text-white"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Brazuca Language Portuguese. {t('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

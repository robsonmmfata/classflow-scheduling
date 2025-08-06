import { useState, useEffect } from "react";
import { Globe, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LocationLanguageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const { setLanguage, language } = useLanguage();

  useEffect(() => {
    // Check if user has already seen this modal
    const hasSeenModal = localStorage.getItem('hasSeenLocationModal');
    if (!hasSeenModal) {
      detectLocationAndLanguage();
    }
  }, [language]);

  const detectLocationAndLanguage = async () => {
    try {
      // Get browser language
      const browserLang = navigator.language.toLowerCase();
      let suggestedLang = 'pt';
      let location = 'Brasil';

      if (browserLang.includes('en')) {
        suggestedLang = 'en';
        location = 'United States';
      } else if (browserLang.includes('es')) {
        suggestedLang = 'es';
        location = 'España';
      } else if (browserLang.includes('pt')) {
        suggestedLang = 'pt';
        location = 'Brasil';
      }

      // Try to get more precise location using geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Simulate location detection based on coordinates
              const { latitude } = position.coords;
              
              if (latitude > 50) {
                location = 'United States';
                suggestedLang = 'en';
              } else if (latitude > 35 && latitude < 50) {
                location = 'España';
                suggestedLang = 'es';
              } else {
                location = 'Brasil';
                suggestedLang = 'pt';
              }
              
              setDetectedLocation(location);
              setDetectedLanguage(suggestedLang);
              
              // Only show modal if detected language is different from current
              if (suggestedLang !== language) {
                setIsOpen(true);
              }
            } catch (error) {
              console.log('Geolocation error:', error);
              setDetectedLocation(location);
              setDetectedLanguage(suggestedLang);
              if (suggestedLang !== language) {
                setIsOpen(true);
              }
            }
          },
          () => {
            // Fallback to browser language detection
            setDetectedLocation(location);
            setDetectedLanguage(suggestedLang);
            if (suggestedLang !== language) {
              setIsOpen(true);
            }
          }
        );
      } else {
        setDetectedLocation(location);
        setDetectedLanguage(suggestedLang);
        if (suggestedLang !== language) {
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage as any);
    setIsOpen(false);
    localStorage.setItem('hasSeenLocationModal', 'true');
  };

  const handleKeepCurrent = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenLocationModal', 'true');
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'es': return 'Español';
      case 'pt': return 'Português';
      default: return 'Português';
    }
  };

  const getLocationFlag = (location: string) => {
    switch (location) {
      case 'United States': return '🇺🇸';
      case 'España': return '🇪🇸';
      case 'Brasil': return '🇧🇷';
      default: return '🇧🇷';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localização Detectada
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{getLocationFlag(detectedLocation)}</div>
            <p className="text-muted-foreground">
              Detectamos que você está em: <strong>{detectedLocation}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Gostaria de mudar o idioma para <strong>{getLanguageName(detectedLanguage)}</strong>?
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleLanguageChange(detectedLanguage)}
              className="w-full"
              variant="default"
            >
              <Globe className="h-4 w-4 mr-2" />
              Sim, mudar para {getLanguageName(detectedLanguage)}
            </Button>
            
            <Button
              onClick={handleKeepCurrent}
              variant="outline"
              className="w-full"
            >
              Manter Português
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            Você pode alterar o idioma a qualquer momento no menu
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationLanguageModal;
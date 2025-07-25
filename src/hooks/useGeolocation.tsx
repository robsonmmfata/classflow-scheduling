import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GeolocationData {
  country: string;
  region: string;
  timezone: string;
  language: string;
}

export const useGeolocation = () => {
  const { setLanguage } = useLanguage();
  const [locationData, setLocationData] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Detectar idioma do navegador
        const browserLanguage = navigator.language || 'pt';
        const languageCode = browserLanguage.split('-')[0];

        // Mapear códigos de idioma
        const languageMap: { [key: string]: 'pt' | 'en' | 'es' } = {
          'pt': 'pt',
          'en': 'en', 
          'es': 'es',
          'fr': 'en', // Francês -> Inglês
          'de': 'en', // Alemão -> Inglês
          'it': 'en', // Italiano -> Inglês
        };

        const detectedLanguage = languageMap[languageCode] || 'en';

        // Simular dados de geolocalização (em produção, usar API real)
        const mockLocationData: GeolocationData = {
          country: 'Brasil',
          region: 'São Paulo',
          timezone: 'America/Sao_Paulo',
          language: detectedLanguage
        };

        setLocationData(mockLocationData);
        
        // Mostrar alerta perguntando sobre o idioma
        const confirmLanguage = window.confirm(
          `Detectamos que você está no ${mockLocationData.country}. ` +
          `Gostaria de usar o site em ${
            detectedLanguage === 'pt' ? 'Português' :
            detectedLanguage === 'es' ? 'Español' : 'English'
          }?`
        );

        if (confirmLanguage) {
          setLanguage(detectedLanguage);
        }

      } catch (error) {
        console.error('Erro ao detectar localização:', error);
        // Fallback para português
        setLocationData({
          country: 'Brasil',
          region: 'Unknown',
          timezone: 'America/Sao_Paulo',
          language: 'pt'
        });
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, [setLanguage]);

  return { locationData, loading };
};
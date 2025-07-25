import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          {t('pageNotFound')}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {t('pageNotFoundDescription')}
        </p>
        <Button 
          variant="gradient" 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          {t('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
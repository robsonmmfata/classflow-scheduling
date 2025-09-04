import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError(t.emailRequired || 'Email é obrigatório');
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t.invalidEmail || 'Email inválido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call - simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock: check if email exists (simulate 90% success rate)
      const emailExists = Math.random() > 0.1;
      
      if (!emailExists) {
        setError(t.emailNotFound || 'Email não encontrado em nosso sistema');
        return;
      }
      
      setEmailSent(true);
      toast({
        title: t.emailSent || 'Email enviado',
        description: t.passwordResetEmailSent || 'Instruções para redefinir sua senha foram enviadas para seu email.',
      });
    } catch (error) {
      setError(t.genericError || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">{t.emailSent || 'Email Enviado'}</CardTitle>
            <CardDescription>
              {t.passwordResetEmailSent || 'Instruções para redefinir sua senha foram enviadas para seu email.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              {t.checkEmailInstructions || 'Verifique sua caixa de entrada e clique no link para redefinir sua senha. O link expira em 1 hora.'}
            </div>
            
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.backToLogin || 'Voltar ao Login'}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                {t.resendEmail || 'Enviar novamente'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl">{t.forgotPassword || 'Esqueceu sua senha?'}</CardTitle>
          <CardDescription>
            {t.forgotPasswordDescription || 'Digite seu email para receber instruções de redefinição de senha'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'border-destructive' : ''}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t.sending || 'Enviando...'}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t.sendResetEmail || 'Enviar Email de Recuperação'}
                </>
              )}
            </Button>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.backToLogin || 'Voltar ao Login'}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
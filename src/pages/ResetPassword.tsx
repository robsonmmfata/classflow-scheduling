import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Mock token validation
    if (!token) {
      setTokenValid(false);
      return;
    }
    
    // Simulate token validation (90% success rate)
    const isValid = Math.random() > 0.1;
    setTokenValid(isValid);
  }, [token]);

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) {
      errors.push(t.passwordMinLength || 'Senha deve ter pelo menos 8 caracteres');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push(t.passwordLowercase || 'Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push(t.passwordUppercase || 'Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push(t.passwordNumber || 'Senha deve conter pelo menos um número');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError(t.passwordRequired || 'Senha é obrigatória');
      return;
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t.passwordMismatch || 'Senhas não coincidem');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call - simulate password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResetComplete(true);
      toast({
        title: t.passwordResetSuccess || 'Senha redefinida com sucesso',
        description: t.passwordResetSuccessDesc || 'Sua senha foi atualizada. Faça login com sua nova senha.',
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(t.genericError || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">
              {t.invalidToken || 'Link Inválido'}
            </CardTitle>
            <CardDescription>
              {t.invalidTokenDescription || 'O link de redefinição de senha é inválido ou expirou.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {t.invalidTokenDetails || 'Este link pode ter expirado ou já foi usado. Solicite um novo link de redefinição de senha.'}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button className="w-full">
                  {t.requestNewLink || 'Solicitar Novo Link'}
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.backToLogin || 'Voltar ao Login'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">
              {t.passwordResetSuccess || 'Senha Redefinida!'}
            </CardTitle>
            <CardDescription>
              {t.passwordResetSuccessDesc || 'Sua senha foi atualizada com sucesso.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              {t.redirectingToLogin || 'Redirecionando para o login em alguns segundos...'}
            </div>
            
            <Link to="/login">
              <Button className="w-full">
                {t.goToLogin || 'Ir para Login'}
              </Button>
            </Link>
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
          <CardTitle className="text-2xl">{t.resetPassword || 'Redefinir Senha'}</CardTitle>
          <CardDescription>
            {t.resetPasswordDescription || 'Digite sua nova senha'}
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
              <Label htmlFor="password">{t.newPassword || 'Nova Senha'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.enterNewPassword || 'Digite sua nova senha'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={error ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t.confirmNewPassword || 'Confirme sua nova senha'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={error ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{t.passwordRequirements || 'Requisitos da senha:'}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t.passwordMinLength || 'Mínimo 8 caracteres'}</li>
                <li>{t.passwordLowercase || 'Uma letra minúscula'}</li>
                <li>{t.passwordUppercase || 'Uma letra maiúscula'}</li>
                <li>{t.passwordNumber || 'Um número'}</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t.updating || 'Atualizando...'}
                </>
              ) : (
                t.updatePassword || 'Atualizar Senha'
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

export default ResetPassword;
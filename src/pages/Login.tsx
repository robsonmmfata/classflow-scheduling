import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { loginSchema, type LoginForm } from '@/lib/validations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { LoadingButton } from '@/components/ui/loading-button';
import LanguageSelector from '@/components/LanguageSelector';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, user, profile } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  if (user) {
    const redirectPath = 
      profile?.role === 'admin' ? '/admin' : 
      profile?.role === 'teacher' ? '/teacher' : 
      '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const {
    values,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    getFieldError,
    isFieldInvalid,
  } = useFormValidation<LoginForm>({
    schema: loginSchema,
    initialValues: { email: 'aluno@teste.com', password: '123456' },
    onSubmit: async (formData) => {
      const success = await login(formData.email, formData.password);
      if (!success) {
        throw new Error('Email ou senha incorretos');
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Brazuca School Language</CardTitle>
            <h2 className="text-xl text-foreground mt-2">{t.welcomeBack}</h2>
            <p className="text-muted-foreground">{t.loginToAccount}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => setFieldTouched('email')}
                className={isFieldInvalid('email') ? 'border-destructive' : ''}
                placeholder="aluno@teste.com"
              />
              {getFieldError('email') && (
                <p className="text-destructive text-sm">{getFieldError('email')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={(e) => setValue('password', e.target.value)}
                  onBlur={() => setFieldTouched('password')}
                  className={isFieldInvalid('password') ? 'border-destructive' : ''}
                  placeholder="123456"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {getFieldError('password') && (
                <p className="text-destructive text-sm">{getFieldError('password')}</p>
              )}
            </div>
            
            <LoadingButton 
              type="submit" 
              loading={isSubmitting || isLoading}
              className="w-full" 
            >
              {t.login}
            </LoadingButton>
            
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t.dontHaveAccount}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t.createAccount}
              </Link>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-accent-soft rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Usuários de Teste:</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Aluno:</strong> aluno@teste.com / 123456</p>
              <p><strong>Professor:</strong> professor@teste.com / 123456</p>
              <p><strong>Admin:</strong> admin@teste.com / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
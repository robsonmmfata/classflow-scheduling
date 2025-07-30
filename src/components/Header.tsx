import { Calendar, BookOpen, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { user, logout, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/5521999999999', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/Fundotrasparentepequeno.png"
                alt="Logo EduScheduler"
                width={82}
                height={82}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-foreground">Brazuca Portuguese School</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#agenda" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('schedule')}
            </Link>
            <Link to="/#minhas-aulas" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('myLessons')}
            </Link>
            <Link to="/#pacotes" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('packages')}
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleWhatsApp}
              className="text-muted-foreground hover:text-foreground"
            >
              {t('contact')}
            </Button>
          </nav>
          
          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <Button variant="ghost" size="icon" onClick={handleWhatsApp}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(
                    profile?.role === 'admin' ? '/admin' : 
                    profile?.role === 'teacher' ? '/teacher' : 
                    '/dashboard'
                  )}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  <User className="h-4 w-4 mr-2" />
                  {t('login')}
                </Button>
                <Button variant="gradient" onClick={() => navigate('/register')}>
                  {t('register')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
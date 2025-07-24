import { Calendar, BookOpen, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">EduScheduler</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#agenda" className="text-muted-foreground hover:text-foreground transition-colors">
              Agenda
            </a>
            <a href="#minhas-aulas" className="text-muted-foreground hover:text-foreground transition-colors">
              Minhas Aulas
            </a>
            <a href="#pacotes" className="text-muted-foreground hover:text-foreground transition-colors">
              Pacotes
            </a>
            <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <User className="h-4 w-4" />
              Entrar
            </Button>
            <Button variant="gradient">
              Cadastrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
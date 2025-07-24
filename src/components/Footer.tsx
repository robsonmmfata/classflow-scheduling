import { MessageCircle, Mail, Instagram, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">EduScheduler</h3>
            </div>
            <p className="text-muted-foreground">
              Plataforma completa para agendamento de aulas particulares online.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Serviços</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Aulas Particulares</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Aula Experimental</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pacotes de Aulas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Planos Mensais</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Suporte</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Cancelamento</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Contato</h4>
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
            © 2024 EduScheduler. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
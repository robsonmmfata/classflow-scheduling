import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const FeedbackSystem = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasFeedback, setHasFeedback] = useState(false);

  const handleSubmitFeedback = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Por favor, selecione uma avaliação e escreva um comentário.");
      return;
    }
    
    // Simular envio do feedback
    setHasFeedback(true);
    alert("Feedback enviado com sucesso! Obrigado pela sua avaliação.");
  };

  if (hasFeedback) {
    return (
      <Card className="bg-gradient-card border-accent shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="text-accent border-accent px-4 py-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback Enviado
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Obrigado por compartilhar sua experiência! Seu feedback é muito importante para nós.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Deixe um feedback sobre as aulas com o seu professor
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compartilhe sua experiência geral com as aulas (feedback único)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating System */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Avaliação Geral *</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-colors"
              >
                <Star 
                  className={`h-8 w-8 ${
                    star <= rating 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-muted-foreground hover:text-yellow-400'
                  }`} 
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Muito insatisfeito"}
              {rating === 2 && "Insatisfeito"}
              {rating === 3 && "Neutro"}
              {rating === 4 && "Satisfeito"}
              {rating === 5 && "Muito satisfeito"}
            </p>
          )}
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Comentário sobre as aulas *</label>
          <Textarea 
            placeholder="Compartilhe sua experiência com as aulas, metodologia do professor, progresso no aprendizado, qualidade do material, etc..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] resize-none"
            required
          />
          <p className="text-xs text-muted-foreground">
            Campo obrigatório - Mínimo 20 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          variant="gradient" 
          className="w-full"
          onClick={handleSubmitFeedback}
          disabled={rating === 0 || comment.trim().length < 20}
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Feedback
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSystem;
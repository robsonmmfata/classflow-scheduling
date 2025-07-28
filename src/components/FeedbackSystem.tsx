import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useToast } from "@/hooks/use-toast";

const FeedbackSystem = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { hasFeedback, submitFeedback, getFeedbackByStudent } = useFeedback();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userHasFeedback = user ? hasFeedback(user.id) : false;
  const existingFeedback = user ? getFeedbackByStudent(user.id) : undefined;

  const handleSubmitFeedback = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para deixar feedback",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0 || comment.trim().length < 20) {
      toast({
        title: "Feedback incompleto",
        description: "Por favor, selecione uma avaliação e escreva um comentário com pelo menos 20 caracteres.",
        variant: "destructive"
      });
      return;
    }

    submitFeedback(user.id, user.email, rating, comment);
    toast({
      title: "Feedback enviado!",
      description: "Obrigado por avaliar nossas aulas. Seu feedback é muito importante!",
    });
    setRating(0);
    setComment("");
  };

  if (userHasFeedback && existingFeedback) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Badge variant="outline" className="bg-accent-soft text-accent border-accent">
              ✓ Feedback Enviado
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
            Obrigado pelo seu feedback!
          </h3>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Sua avaliação:</span>
              <div className="flex text-yellow-500">
                {[...Array(existingFeedback.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{existingFeedback.comment}"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Enviado em {existingFeedback.timestamp.toLocaleDateString()}
            </p>
          </div>
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
            Campo obrigatório - Mínimo 20 caracteres ({comment.length}/20)
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
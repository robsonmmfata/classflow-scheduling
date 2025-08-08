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
        title: t('loginRequired'),
        description: t('loginToLeaveFeedback'),
        variant: "destructive"
      });
      return;
    }

    if (rating === 0 || comment.trim().length < 20) {
      toast({
        title: t('incompleteFeedback'),
        description: t('incompleteFeedbackDesc'),
        variant: "destructive"
      });
      return;
    }

    submitFeedback(user.id, user.email, rating, comment);
    toast({
      title: t('feedbackSubmitted'),
      description: t('feedbackThanks'),
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
              ✓ {t('feedbackSent')}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
            {t('thankYouForFeedback')}
          </h3>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">{t('yourRating')}:</span>
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
              {t('sentOn')} {existingFeedback.timestamp.toLocaleDateString()}
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
          {t('leaveFeedbackAbout')}
        </CardTitle>
  <p className="text-sm text-muted-foreground">
          {t('shareExperience')} {t('feedbackUnique')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating System */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('generalEvaluation')} *</label>
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
              {rating === 1 && t('veryDissatisfied')}
              {rating === 2 && t('dissatisfied')}
              {rating === 3 && t('neutral')}
              {rating === 4 && t('satisfied')}
              {rating === 5 && t('verySatisfied')}
            </p>
          )}
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('commentOnLessons')} *</label>
          <Textarea 
            placeholder={t('feedbackPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] resize-none"
            required
          />
          <p className="text-xs text-muted-foreground">
            {t('requiredFieldMinChars')} ({comment.length}/20)
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
        {t('sendFeedback')}
      </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSystem;
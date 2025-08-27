import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Confetti, Trophy, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import tymfloIcon from "@/assets/tymflo-icon.png";

interface CompletionCelebrationProps {
  day: number;
  streak: number;
  onClose: () => void;
}

export function CompletionCelebration({ day, streak, onClose }: CompletionCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getMilestoneMessage = () => {
    if (day === 1) return "🎉 Welcome to your entrepreneurial journey!";
    if (day === 7) return "🔥 One week strong! You're building momentum!";
    if (day === 30) return "🚀 30 days! You're officially a habit builder!";
    if (day === 60) return "💪 60 days! You're in the zone now!";
    if (day === 90) return "🏆 90 DAYS! You've transformed your business!";
    if (streak >= 7) return `🔥 ${streak}-day streak! You're on fire!`;
    return "✨ Great work! Another step closer to success!";
  };

  const getMotivationalMessage = () => {
    if (day <= 30) {
      return "Every expert was once a beginner. You're laying the foundation for something amazing.";
    } else if (day <= 60) {
      return "Momentum is building! Small consistent actions create massive results.";
    } else {
      return "You're in the final stretch! Your persistence is about to pay off.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md mx-auto shadow-2xl border-2 border-accent ${showConfetti ? 'celebration-animation' : ''}`}>
        <CardContent className="p-6 text-center relative overflow-hidden">
          {/* Confetti Background */}
          {showConfetti && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-6xl">🎉</div>
              <div className="text-4xl absolute top-4 left-4">✨</div>
              <div className="text-4xl absolute top-4 right-4">🌟</div>
              <div className="text-4xl absolute bottom-4 left-4">🎊</div>
              <div className="text-4xl absolute bottom-4 right-4">🎈</div>
            </div>
          )}
          
          <div className="relative z-10">
            <img src={tymfloIcon} alt="TymFlo" className="w-16 h-16 mx-auto mb-4" />
            
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Trophy className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-primary">Day {day} Complete!</h2>
              <Trophy className="w-6 h-6 text-accent" />
            </div>

            <p className="text-lg font-semibold text-foreground mb-2">
              {getMilestoneMessage()}
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              {getMotivationalMessage()}
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-accent mr-1" />
                  <span className="text-2xl font-bold text-accent">{streak}</span>
                </div>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-accent mr-1" />
                  <span className="text-2xl font-bold text-accent">{day}</span>
                </div>
                <span className="text-xs text-muted-foreground">Days Total</span>
              </div>
            </div>

            <Button 
              onClick={onClose} 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              data-testid="button-close-celebration"
            >
              Continue Your Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
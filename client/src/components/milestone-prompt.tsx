import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Gift, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import tymfloIcon from "@/assets/tymflo-icon.png";
import { useAudio } from "@/hooks/use-audio";

interface MilestonePromptProps {
  milestone: number;
  onClose: () => void;
}

export function MilestonePrompt({ milestone, onClose }: MilestonePromptProps) {
  const [showPayment, setShowPayment] = useState(false);
  const { playMilestone } = useAudio();

  const getMilestoneContent = () => {
    switch (milestone) {
      case 7:
        return {
          title: "🔥 7-Day Streak Unlocked!",
          message: "You've proven you're serious about building your business. This consistency is what separates successful entrepreneurs from dreamers.",
          suggestion: "Consider supporting our mission to help more founders like you succeed.",
          paymentSuggestion: "$7 for your 7-day commitment"
        };
      case 30:
        return {
          title: "🚀 30 Days of Entrepreneurial Growth!",
          message: "You've built a habit that most people only dream about. You're transforming from someone with an idea to someone taking action every day.",
          suggestion: "Your progress is inspiring! Help us create more resources for aspiring entrepreneurs.",
          paymentSuggestion: "$30 for your 30-day transformation"
        };
      case 60:
        return {
          title: "💪 60 Days of Business Building!",
          message: "You're in the top 5% of entrepreneurs who actually follow through. Your dedication is remarkable and your business is taking shape.",
          suggestion: "You've gotten serious value from this program. Consider investing in our continued development.",
          paymentSuggestion: "$60 for your 60-day dedication"
        };
      case 90:
        return {
          title: "🏆 90 Days Complete - You're a Founder!",
          message: "You've done what 95% of people with business ideas never do - you took consistent action for 90 straight days. You're no longer someone with an idea, you're an entrepreneur.",
          suggestion: "You've built something amazing. Help us help the next generation of founders.",
          paymentSuggestion: "$90 for your complete transformation"
        };
      default:
        return {
          title: "🌟 Amazing Progress!",
          message: "Your consistency is building something bigger than you realize.",
          suggestion: "Consider supporting our mission to help more entrepreneurs succeed.",
          paymentSuggestion: "Pay what feels right for the value"
        };
    }
  };

  const content = getMilestoneContent();

  // Play milestone sound when component mounts
  useEffect(() => {
    playMilestone();
  }, [playMilestone]);

  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-accent">
          <CardContent className="p-6 text-center">
            <img src={tymfloIcon} alt="TymFlo" className="w-16 h-16 mx-auto mb-4" />
            
            <h2 className="text-xl font-bold text-primary mb-4">Pay What You Think Is Fair</h2>
            
            <p className="text-sm text-muted-foreground mb-6">
              We believe in value-based pricing. Choose an amount that reflects the value you've received from Founder's First 90.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="h-16 flex flex-col" data-testid="payment-coffee">
                <Coffee className="w-5 h-5 mb-1" />
                <span className="font-semibold">$5</span>
                <span className="text-xs">Buy us coffee</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" data-testid="payment-suggested">
                <Heart className="w-5 h-5 mb-1 text-red-500" />
                <span className="font-semibold">${milestone}</span>
                <span className="text-xs">Suggested</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" data-testid="payment-generous">
                <Gift className="w-5 h-5 mb-1" />
                <span className="font-semibold">${milestone * 2}</span>
                <span className="text-xs">Generous supporter</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" data-testid="payment-custom">
                <span className="font-semibold">Custom</span>
                <span className="text-xs">You choose</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Secure payment powered by Stripe. Your support helps us create more resources for entrepreneurs.
            </p>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={onClose} className="flex-1" data-testid="button-maybe-later">
                Maybe Later
              </Button>
              <Button 
                onClick={() => window.open('https://buy.stripe.com/payment-link', '_blank')} 
                className="flex-1 bg-accent hover:bg-accent/90"
                data-testid="button-continue-payment"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-accent">
        <CardContent className="p-6 text-center">
          <img src={tymfloIcon} alt="TymFlo" className="w-16 h-16 mx-auto mb-4" />
          
          <h2 className="text-xl font-bold text-primary mb-2">{content.title}</h2>
          
          <p className="text-sm text-muted-foreground mb-4">
            {content.message}
          </p>

          <div className="bg-accent/10 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-foreground mb-2">
              {content.suggestion}
            </p>
            <p className="text-xs text-muted-foreground">
              Suggested: {content.paymentSuggestion}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="ghost" onClick={onClose} className="flex-1" data-testid="button-not-now">
              Not Right Now
            </Button>
            <Button 
              onClick={() => setShowPayment(true)} 
              className="flex-1 bg-accent hover:bg-accent/90"
              data-testid="button-show-payment"
            >
              <Heart className="w-4 h-4 mr-1" />
              Support Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
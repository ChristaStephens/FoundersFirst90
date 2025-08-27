import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Target, 
  Star,
  Zap,
  Trophy,
  Building2,
  BookOpen,
  Sparkles,
  Gift
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ComponentType<{ className?: string }>;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    type: 'click' | 'scroll' | 'highlight' | 'animate';
    element?: string;
  };
  reward?: {
    type: 'tokens' | 'badge' | 'unlock';
    amount?: number;
    item?: string;
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Startup Journey!',
    description: 'You\'re about to embark on a 90-day adventure to build your first business. Let\'s explore the tools that will help you succeed.',
    target: 'app-container',
    icon: Star,
    position: 'center',
    reward: { type: 'tokens', amount: 10 }
  },
  {
    id: 'daily-mission',
    title: 'Your Daily Mission',
    description: 'Each day brings a new mission designed to move your startup forward. Complete these to build real business momentum.',
    target: 'daily-mission',
    icon: Target,
    position: 'top',
    action: { type: 'highlight', element: 'daily-mission' },
    reward: { type: 'tokens', amount: 5 }
  },
  {
    id: 'tabs-navigation',
    title: 'Navigate Your Journey',
    description: 'Use these tabs to access different aspects of your startup journey. Today shows missions, Build tracks progress, Learn provides insights, and Goals manages finances.',
    target: 'tab-navigation',
    icon: BookOpen,
    position: 'bottom',
    action: { type: 'animate', element: 'tabs' }
  },
  {
    id: 'startup-building',
    title: 'Watch Your Empire Grow',
    description: 'Every completed mission builds a part of your startup empire. Click on buildings to see what you\'ve accomplished!',
    target: 'startup-building',
    icon: Building2,
    position: 'top',
    action: { type: 'highlight', element: 'building-foundation' },
    reward: { type: 'tokens', amount: 15 }
  },
  {
    id: 'token-system',
    title: 'Earn Rewards',
    description: 'Complete missions to earn Founder Coins and Vision Gems. Use these to unlock decorations and celebrate your progress!',
    target: 'token-balance',
    icon: Zap,
    position: 'bottom',
    reward: { type: 'tokens', amount: 20 }
  },
  {
    id: 'progress-tracking',
    title: 'Track Your Success',
    description: 'Keep an eye on your completion rate, streak days, and overall progress. Consistency is key to building a successful startup!',
    target: 'progress-dashboard',
    icon: Trophy,
    position: 'right',
    reward: { type: 'badge', item: 'Tutorial Master' }
  },
  {
    id: 'ready-to-start',
    title: 'You\'re Ready to Build!',
    description: 'Now you know the basics. Start with Day 1\'s mission and begin building your startup empire. Remember: every great business started with a single step.',
    target: 'complete-mission-btn',
    icon: Sparkles,
    position: 'center',
    reward: { type: 'unlock', item: 'Entrepreneur Badge' }
  }
];

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ isVisible, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState<{ tokens: number; badges: string[] }>({ tokens: 0, badges: [] });

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Handle step navigation
  const nextStep = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    
    setIsAnimating(true);
    
    // Apply step action
    if (step.action) {
      performStepAction(step.action);
    }
    
    // Award reward
    if (step.reward) {
      awardReward(step.reward);
    }
    
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  const previousStep = () => {
    if (isFirstStep) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const performStepAction = (action: TourStep['action']) => {
    if (!action) return;
    
    switch (action.type) {
      case 'highlight':
        if (action.element) {
          const element = document.querySelector(`[data-testid="${action.element}"]`);
          if (element) {
            element.classList.add('animate-pulse', 'ring-4', 'ring-yellow-400');
            setTimeout(() => {
              element.classList.remove('animate-pulse', 'ring-4', 'ring-yellow-400');
            }, 2000);
          }
        }
        break;
      case 'animate':
        if (action.element) {
          const element = document.querySelector(`[data-testid="${action.element}"]`);
          if (element) {
            element.classList.add('animate-bounce');
            setTimeout(() => {
              element.classList.remove('animate-bounce');
            }, 1000);
          }
        }
        break;
      case 'scroll':
        if (action.element) {
          const element = document.querySelector(`[data-testid="${action.element}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;
    }
  };

  const awardReward = (reward: TourStep['reward']) => {
    if (!reward) return;
    
    switch (reward.type) {
      case 'tokens':
        setEarnedRewards(prev => ({
          ...prev,
          tokens: prev.tokens + (reward.amount || 0)
        }));
        break;
      case 'badge':
        if (reward.item) {
          setEarnedRewards(prev => ({
            ...prev,
            badges: [...prev.badges, reward.item!]
          }));
        }
        break;
    }
  };

  // Auto-highlight target element
  useEffect(() => {
    if (!isVisible || !step.target) return;
    
    const element = document.querySelector(`[data-testid="${step.target}"]`);
    if (element) {
      element.classList.add('relative', 'z-50');
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      element.style.borderRadius = '8px';
      
      return () => {
        element.classList.remove('relative', 'z-50');
        element.style.boxShadow = '';
        element.style.borderRadius = '';
      };
    }
  }, [currentStep, isVisible, step.target]);

  if (!isVisible) return null;

  const IconComponent = step.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className={`
          w-full max-w-md relative transition-all duration-500 shadow-2xl
          ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
        `}>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-2 right-2 z-10"
            data-testid="tour-close"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <CardContent className="pt-6 pb-4">
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {tourSteps.length}</span>
                <Badge variant="outline" className="text-xs">
                  Tutorial
                </Badge>
              </div>
              <Progress value={((currentStep + 1) / tourSteps.length) * 100} className="h-2" />
            </div>
            
            {/* Step Content */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
              
              {/* Reward Preview */}
              {step.reward && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-yellow-800">
                    <Gift className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {step.reward.type === 'tokens' && `+${step.reward.amount} Founder Coins`}
                      {step.reward.type === 'badge' && `Earn: ${step.reward.item}`}
                      {step.reward.type === 'unlock' && `Unlock: ${step.reward.item}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={isFirstStep}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={nextStep}
                size="sm"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                data-testid="tour-next"
              >
                {isLastStep ? 'Start Building!' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
                {isLastStep && <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Skip Option */}
            {!isLastStep && (
              <div className="text-center mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Skip tutorial
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Reward Notifications */}
      {earnedRewards.tokens > 0 && (
        <div className="fixed top-4 right-4 z-60 animate-fade-in">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2 text-green-800">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{earnedRewards.tokens} Founder Coins earned!
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('completed-onboarding', false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      // Show onboarding after a brief delay
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const restartOnboarding = () => {
    setHasCompletedOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding
  };
}
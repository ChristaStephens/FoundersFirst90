import { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { useQuery } from '@tanstack/react-query';
import { DailyMission } from '@/components/daily-mission';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { BottomNavigation } from '@/components/bottom-navigation';
import { CalendarSplash } from '@/components/calendar-splash';
import { DailyNotes, PreviousDayReview } from '@/components/daily-notes';
import { BuildingProgress } from '@/components/building-progress';
import { CompletionCelebration } from '@/components/completion-celebration';
import { MilestonePrompt } from '@/components/milestone-prompt';
import { EnhancedProgressBar } from '@/components/enhanced-progress-bar';
import { TokenBalance } from '@/components/TokenBalance';
import { DailyChallenges } from '@/components/DailyChallenges';
import { MoodTracker } from '@/components/MoodTracker';
import MissionBasedBuilding from '@/components/MissionBasedBuilding';
import InteractiveBuilding from '@/components/InteractiveBuilding';
import SkillProgressTracker from '@/components/SkillProgressTracker';
import OnboardingTour, { useOnboarding } from '@/components/OnboardingTour';
import EnhancedIntegration from '@/components/EnhancedIntegration';
import { MicroLearning } from '@/components/MicroLearning';
import CustomChallenges from '@/components/CustomChallenges';
import { FinancialGoalWizard } from '@/components/FinancialGoalWizard';
import { useProgress, useLocalProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import missions from '@/data/missions.json';
import { Mission } from '@/types/mission';
import tymfloIcon from '@/assets/tymflo-icon.png';
import tymfloWordmark from '@/assets/tymflo-wordmark.png';
import { Crown, Lock, Calendar, Sparkles, Building2, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrivacyPolicy from './privacy-policy';
import TermsOfService from './terms-of-service';
import Support from './support';

export default function Home() {
  const [activeTab, setActiveTab] = useState('today');
  const [currentPage, setCurrentPage] = useState('home');
  const [, setLocation] = useLocation();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedDay, setCelebratedDay] = useState(0);
  const [showMilestonePrompt, setShowMilestonePrompt] = useState(false);
  const [milestoneDay, setMilestoneDay] = useState(0);
  const { 
    progress, 
    completions, 
    achievements, 
    completeDay, 
    saveNotes, 
    isLoading, 
    isCompletingDay, 
    isSavingNotes 
  } = useProgress();
  
  const {
    showCalendarSplash,
    hideCalendarSplash,
    currentNotes,
    setCurrentNotes,
    currentReflections,
    setCurrentReflections
  } = useLocalProgress();
  
  // Get subscription status
  const { data: subscriptionData } = useQuery<{
    subscriptionStatus: string;
    subscriptionPlan: string;
    trialEndsAt?: string;
    subscriptionEndsAt?: string;
    hasAccess: boolean;
  }>({
    queryKey: ['/api/subscription/status'],
    retry: false,
  });

  // Check for milestone achievements
  useEffect(() => {
    if (!progress) return;
    
    const milestones = [7, 30, 60, 90];
    const shouldShowMilestone = milestones.find(milestone => 
      progress.currentDay >= milestone && 
      !localStorage.getItem(`milestone_shown_${milestone}`)
    );

    if (shouldShowMilestone) {
      setMilestoneDay(shouldShowMilestone);
      setShowMilestonePrompt(true);
      localStorage.setItem(`milestone_shown_${shouldShowMilestone}`, 'true');
    }
  }, [progress?.currentDay]);

  // Page routing
  if (currentPage === 'support') {
    return <Support onBack={() => setCurrentPage('home')} />;
  }
  
  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentPage('home')} />;
  }
  
  if (currentPage === 'terms') {
    return <TermsOfService onBack={() => setCurrentPage('home')} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Progress value={undefined} className="w-32 h-2 mb-4 mx-auto" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load progress</p>
      </div>
    );
  }

  const currentMission = missions.find((mission) => mission.day === progress.currentDay) as Mission | undefined;
  const currentDayCompletion = completions.find(c => c.day === progress.currentDay);
  const previousDayCompletion = completions.find(c => c.day === progress.currentDay - 1);
  const isCurrentDayCompleted = currentDayCompletion?.completed || false;
  
  // Access control logic
  const hasAccess = subscriptionData?.hasAccess || progress.currentDay <= 7; // Free access to first 7 days
  const subscriptionStatus = subscriptionData?.subscriptionStatus || 'free';
  const isTrialing = subscriptionStatus === 'trialing';
  const needsUpgrade = progress.currentDay > 7 && !hasAccess;

  const handleMissionComplete = () => {
    completeDay({
      day: progress.currentDay,
      notes: currentNotes,
      reflections: currentReflections
    });
    
    // Show celebration
    setCelebratedDay(progress.currentDay);
    setShowCelebration(true);
  };

  const handleSaveNotes = () => {
    saveNotes({
      day: progress.currentDay,
      notes: currentNotes,
      reflections: currentReflections
    });
  };

  const getProgressPercentage = () => {
    return Math.round((progress.totalCompletedDays / 90) * 100);
  };

  const renderTodayTab = () => (
    <div className="animate-fadeIn pb-4">
      {/* Enhanced Progress Overview */}
      <div className="p-4">
        <EnhancedProgressBar 
          currentDay={progress.currentDay}
          totalDays={90}
          streak={progress.streak}
          completedToday={isCurrentDayCompleted}
        />
      </div>

      {/* Daily Challenges */}
      <div className="px-4 mb-4">
        <DailyChallenges />
      </div>
      
      {/* Custom Challenges */}
      <div className="px-4 mb-4">
        <CustomChallenges />
      </div>

      {/* Subscription Status Bar */}
      {isTrialing && subscriptionData?.trialEndsAt && (
        <div className="mx-4 mb-4">
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Premium Trial Active
                  </p>
                  <p className="text-xs text-orange-700">
                    Trial ends {new Date(subscriptionData.trialEndsAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setLocation('/subscription')}
                  className="ml-auto bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                  data-testid="button-upgrade-trial"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Mission */}
      <div className="p-4">
        {needsUpgrade ? (
          <Card className="shadow-lg border-2 border-[#FF6B35]/20 bg-gradient-to-br from-[#FF6B35]/5 to-purple-500/5">
            <CardContent className="p-8 text-center">
              <div className="relative">
                <Lock className="w-16 h-16 text-[#FF6B35] mx-auto mb-6" />
                <div className="absolute -top-2 -right-2 bg-[#FF6B35] rounded-full p-2">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-[#FF6B35] bg-clip-text text-transparent">
                Unlock Your Full Journey
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You've completed your free preview! Upgrade to Premium to continue your 90-day transformation and access the complete founder's toolkit.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">What you'll unlock:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• {90 - progress.currentDay + 1} more days of expert missions</li>
                  <li>• Community features & accountability partners</li>
                  <li>• Advanced progress analytics</li>
                  <li>• Export your complete journey</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setLocation('/subscription')}
                  className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8"
                  data-testid="button-upgrade-premium"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <Badge variant="outline" className="border-green-600 text-green-600 px-3 py-1">
                  7-Day Free Trial
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Start with a free trial, no credit card required
              </p>
            </CardContent>
          </Card>
        ) : currentMission ? (
          <DailyMission
            mission={currentMission}
            isCompleted={isCurrentDayCompleted}
            onComplete={handleMissionComplete}
            currentDay={progress.currentDay}
          />
        ) : (
          <Card className="shadow-sm border border-border bg-gradient-to-br from-success/10 to-accent/10">
            <CardContent className="p-8 text-center">
              <img src={tymfloIcon} alt="TymFlo" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">🎉 Congratulations, Founder! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                You've completed all 90 days of Founder's First 90! You've transformed from idea to action, and hopefully from startup dream to real business.
              </p>
              <div className="bg-accent/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-foreground">
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </p>
                <p className="text-xs text-muted-foreground mt-1">- Winston Churchill</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep building, keep growing, and remember - this is just the beginning of your entrepreneurial journey!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Previous Day Review */}
      {previousDayCompletion && (
        <div className="p-4">
          <PreviousDayReview 
            previousDay={{
              day: previousDayCompletion.day,
              notes: previousDayCompletion.notes,
              reflections: previousDayCompletion.reflections,
              completed: previousDayCompletion.completed,
              completedAt: previousDayCompletion.completedAt
            }}
          />
        </div>
      )}

      {/* Daily Notes */}
      <div className="p-4">
        <DailyNotes
          day={progress.currentDay}
          notes={currentNotes}
          reflections={currentReflections}
          onNotesChange={setCurrentNotes}
          onReflectionsChange={setCurrentReflections}
          onSave={handleSaveNotes}
          isCompleted={isCurrentDayCompleted}
          isSaving={isSavingNotes}
        />
      </div>

      {/* Building Progress */}
      <div className="p-4">
        <BuildingProgress 
          level={progress.buildingLevel}
          completedDays={progress.totalCompletedDays}
        />
      </div>

      {/* Motivational Quote */}
      <div className="p-4">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
          <p className="text-sm text-foreground font-medium mb-1">
            {progress.currentDay <= 30 
              ? "Every expert was once a beginner. Every pro was once an amateur." 
              : progress.currentDay <= 60 
              ? "Success is the sum of small efforts repeated day-in and day-out."
              : "You are closer than you think. Keep pushing forward."}
          </p>
          <p className="text-xs text-muted-foreground">- Daily Motivation</p>
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="animate-fadeIn p-4 space-y-4">
      <BuildingProgress 
        level={progress.buildingLevel}
        completedDays={progress.totalCompletedDays}
      />
      
      <ProgressDashboard
        progress={{
          ...progress,
          completedDays: completions.filter(c => c.completed).map(c => c.day)
        }}
        achievements={achievements}
        progressPercentage={getProgressPercentage()}
      />
    </div>
  );

  const renderStartupTab = () => (
    <div className="animate-fadeIn p-4 space-y-6" data-testid="startup-building">
      <EnhancedIntegration />
      <InteractiveBuilding />
      <SkillProgressTracker />
      <FinancialGoalWizard />
    </div>
  );

  const renderLearningTab = () => (
    <div className="animate-fadeIn p-4 space-y-4">
      <MicroLearning />
    </div>
  );

  const renderSettingsTab = () => (
    <div className="animate-fadeIn p-4 space-y-4">
      {/* Profile Section */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Your Journey</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Started</span>
              <span className="text-sm font-medium text-foreground" data-testid="start-date">
                {new Date(progress.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Day</span>
              <span className="text-sm font-medium text-foreground" data-testid="current-day">
                Day {progress.currentDay} of 90
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="text-sm font-medium text-foreground" data-testid="completion-rate">
                {Math.round((progress.totalCompletedDays / Math.max(progress.currentDay - 1, 1)) * 100) || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Target Completion</span>
              <span className="text-sm font-medium text-foreground" data-testid="target-date">
                {new Date(new Date(progress.startDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Support</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentPage('support')}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
              data-testid="help-button"
            >
              <span className="text-sm text-foreground">Help & FAQ</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button 
              onClick={() => setCurrentPage('support')}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
              data-testid="contact-button"
            >
              <span className="text-sm text-foreground">Contact Support</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button 
              onClick={() => setCurrentPage('support')}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
              data-testid="feedback-button"
            >
              <span className="text-sm text-foreground">Send Feedback</span>
              <span className="text-muted-foreground">→</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Legal</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentPage('privacy')}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
              data-testid="privacy-button"
            >
              <span className="text-sm text-foreground">Privacy Policy</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button 
              onClick={() => setCurrentPage('terms')}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
              data-testid="terms-button"
            >
              <span className="text-sm text-foreground">Terms of Service</span>
              <span className="text-muted-foreground">→</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Testing Tools (Dev Only) */}
      <Card className="shadow-sm border border-orange-200 bg-orange-50/50">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">🧪 Testing Tools</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => setLocation('/subscription')}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              data-testid="test-subscription"
            >
              Subscription Page
            </button>
            <button 
              onClick={() => {
                // Simulate needing upgrade (day 8+)
                localStorage.setItem('testMode', 'needsUpgrade');
                window.location.reload();
              }}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              data-testid="test-upgrade-prompt"
            >
              Upgrade Prompt
            </button>
            <button 
              onClick={() => {
                // Trigger discount (3+ visits)
                const visits = [
                  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
                  new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toDateString(),
                  new Date().toDateString()
                ];
                localStorage.setItem('subscriptionVisits', JSON.stringify(visits));
                localStorage.removeItem('discountOffered');
                setLocation('/subscription');
              }}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              data-testid="test-discount"
            >
              $10 Discount
            </button>
            <button 
              onClick={() => {
                // Show trial status
                setLocation('/subscription');
              }}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              data-testid="test-trial"
            >
              Free Trial
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button 
              onClick={() => {
                // Clear all test data
                localStorage.removeItem('testMode');
                localStorage.removeItem('subscriptionVisits');
                localStorage.removeItem('discountOffered');
                localStorage.removeItem('milestone_shown_7');
                localStorage.removeItem('milestone_shown_30');
                localStorage.removeItem('milestone_shown_60');
                localStorage.removeItem('milestone_shown_90');
                window.location.reload();
              }}
              className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
              data-testid="test-reset"
            >
              Reset Test Data
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Progress */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Reset</h2>
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
            className="w-full py-3"
            data-testid="reset-progress-button"
          >
            Reset All Progress
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will permanently delete all your progress and cannot be undone.
          </p>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card className="shadow-sm border border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">💳 Subscription</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="text-sm font-semibold text-green-600">Premium Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="text-sm font-semibold">Founder's Premium</span>
            </div>
            <div className="pt-2">
              <Button 
                onClick={() => setLocation('/subscription')}
                variant="outline" 
                className="w-full text-xs"
                data-testid="manage-subscription"
              >
                Manage Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-foreground min-h-screen" data-testid="app-container">
      {/* Onboarding Tour */}
      <OnboardingTour 
        isVisible={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
      
      {/* Mood Tracker */}
      <MoodTracker />
      
      {/* Calendar Splash Screen */}
      <CalendarSplash
        isOpen={showCalendarSplash}
        onClose={hideCalendarSplash}
        streak={progress.streak}
        bestStreak={progress.bestStreak}
        completedDays={completions.map(c => ({
          day: c.day,
          completed: c.completed,
          completedAt: c.completedAt
        }))}
        currentDay={progress.currentDay}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="group hover-wiggle">
              <h1 className="text-xl font-bold text-primary transition-all duration-300 group-hover:text-purple-600 group-hover:scale-105" data-testid="app-title">
                Founder's First 90
              </h1>
              <p className="text-xs text-muted-foreground font-light transition-all duration-300 group-hover:text-purple-500">
                by TymFlo
              </p>
            </div>
            <div className="flex items-center space-x-2 group hover-lift">
              <img 
                src={tymfloIcon} 
                alt="TymFlo" 
                className="w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:animate-float hover-rotate" 
              />
              <div className="text-right group-hover:animate-wiggle">
                <div className="text-sm font-medium text-foreground transition-all duration-300 group-hover:text-primary" data-testid="header-current-day">
                  Day {progress.currentDay}
                </div>
                <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-primary/70">
                  of 90
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Token Balance Display */}
      <div className="max-w-md mx-auto px-4 py-3">
        <TokenBalance />
      </div>

      {/* Main Content with Colorful Tabs */}
      <main className="max-w-md mx-auto pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mx-4 mb-4 bg-white border border-purple-200 rounded-xl p-1 shadow-lg" data-testid="tab-navigation">
            <TabsTrigger 
              value="today" 
              className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs transition-all duration-300 hover:scale-105 hover-lift" 
              data-testid="tab-today"
            >
              <Calendar className="w-4 h-4 group-data-[state=active]:animate-wiggle group-hover:animate-float transition-transform duration-200" />
              <div className="absolute inset-0 rounded-lg bg-pink-500/20 opacity-0 group-data-[state=active]:opacity-100 pointer-events-none"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="startup" 
              className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-xs transition-all duration-300 hover:scale-105 hover-lift" 
              data-testid="tab-build"
            >
              <Building2 className="w-4 h-4 group-data-[state=active]:animate-heartbeat group-hover:animate-float transition-transform duration-200" />
              <div className="absolute inset-0 rounded-lg bg-blue-500/20 opacity-0 group-data-[state=active]:opacity-100 pointer-events-none"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="learning" 
              className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg text-xs transition-all duration-300 hover:scale-105 hover-lift" 
              data-testid="tab-learn"
            >
              <BookOpen className="w-4 h-4 group-data-[state=active]:animate-jello group-hover:animate-float transition-transform duration-200" />
              <div className="absolute inset-0 rounded-lg bg-green-500/20 opacity-0 group-data-[state=active]:opacity-100 pointer-events-none"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg text-xs transition-all duration-300 hover:scale-105 hover-lift" 
              data-testid="tab-progress"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:animate-sparkle group-hover:animate-float transition-transform duration-200" />
              <div className="absolute inset-0 rounded-lg bg-orange-500/20 opacity-0 group-data-[state=active]:opacity-100 pointer-events-none"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="group relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-700 data-[state=active]:text-white rounded-lg text-xs transition-all duration-300 hover:scale-105 hover-lift" 
              data-testid="tab-goals"
            >
              <Crown className="w-4 h-4 group-data-[state=active]:animate-wiggle group-hover:animate-float transition-transform duration-200" />
              <div className="absolute inset-0 rounded-lg bg-gray-500/20 opacity-0 group-data-[state=active]:opacity-100 pointer-events-none"></div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-0">
            {renderTodayTab()}
          </TabsContent>
          
          <TabsContent value="startup" className="mt-0">
            {renderStartupTab()}
          </TabsContent>
          
          <TabsContent value="learning" className="mt-0">
            {renderLearningTab()}
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            {renderProgressTab()}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            {renderSettingsTab()}
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'community') {
            setLocation('/community');
          } else if (tab === 'store') {
            setLocation('/store');
          } else {
            setActiveTab(tab);
          }
        }} 
      />
      
      {/* Celebration Modal */}
      {showCelebration && (
        <CompletionCelebration
          day={celebratedDay}
          streak={progress.streak}
          onClose={() => setShowCelebration(false)}
        />
      )}
      
      {/* Milestone Prompt Modal */}
      {showMilestonePrompt && (
        <MilestonePrompt
          milestone={milestoneDay}
          onClose={() => setShowMilestonePrompt(false)}
        />
      )}
    </div>
  );
}

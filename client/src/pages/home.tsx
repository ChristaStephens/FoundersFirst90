import { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { DailyMission } from '@/components/daily-mission';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { BottomNavigation } from '@/components/bottom-navigation';
import { CalendarSplash } from '@/components/calendar-splash';
import { DailyNotes, PreviousDayReview } from '@/components/daily-notes';
import { BuildingProgress } from '@/components/building-progress';
import { CompletionCelebration } from '@/components/completion-celebration';
import { MilestonePrompt } from '@/components/milestone-prompt';
import { EnhancedProgressBar } from '@/components/enhanced-progress-bar';
import { useProgress, useLocalProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import missions from '@/data/missions.json';
import { Mission } from '@/types/mission';
import tymfloIcon from '@/assets/tymflo-icon.png';
import tymfloWordmark from '@/assets/tymflo-wordmark.png';

export default function Home() {
  const [activeTab, setActiveTab] = useState('today');
  const [, setLocation] = useLocation();
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

      {/* Today's Mission */}
      <div className="p-4">
        {currentMission ? (
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
              className="flex items-center justify-between w-full text-left"
              data-testid="help-button"
            >
              <span className="text-sm text-foreground">Help & FAQ</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button 
              className="flex items-center justify-between w-full text-left"
              data-testid="contact-button"
            >
              <span className="text-sm text-foreground">Contact Support</span>
              <span className="text-muted-foreground">→</span>
            </button>
            <button 
              className="flex items-center justify-between w-full text-left"
              data-testid="feedback-button"
            >
              <span className="text-sm text-foreground">Send Feedback</span>
              <span className="text-muted-foreground">→</span>
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
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
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
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary" data-testid="app-title">Founder's First 90</h1>
              <p className="text-xs text-muted-foreground font-light">by TymFlo</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={tymfloIcon} alt="TymFlo" className="w-8 h-8" />
              <div className="text-right">
                <div className="text-sm font-medium text-foreground" data-testid="header-current-day">
                  Day {progress.currentDay}
                </div>
                <div className="text-xs text-muted-foreground">of 90</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {activeTab === 'today' && renderTodayTab()}
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'community') {
            setLocation('/community');
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

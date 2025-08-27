import { useState } from 'react';
import { DailyMission } from '@/components/daily-mission';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { BottomNavigation } from '@/components/bottom-navigation';
import { useProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import missions from '@/data/missions.json';
import { Mission } from '@/types/mission';

export default function Home() {
  const [activeTab, setActiveTab] = useState('today');
  const { progress, achievements, completeDay, isDayCompleted, getProgressPercentage, resetProgress } = useProgress();

  const currentMission = missions.find((mission: Mission) => mission.day === progress.currentDay);
  const isCurrentDayCompleted = isDayCompleted(progress.currentDay);

  const handleMissionComplete = () => {
    completeDay(progress.currentDay);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  const renderTodayTab = () => (
    <div className="animate-fadeIn pb-4">
      {/* Header Progress Overview */}
      <div className="p-4">
        <Card className="shadow-sm border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">Your Progress</h2>
              <span className="text-2xl animate-pulse-subtle">🔥</span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span data-testid="header-progress-percentage">{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            
            <div className="flex justify-between text-center">
              <div>
                <div className="text-lg font-bold text-primary" data-testid="header-current-streak">{progress.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent" data-testid="header-completed-days">{progress.completedDays.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-secondary" data-testid="header-best-streak">{progress.bestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Mission */}
      <div className="p-4">
        {currentMission ? (
          <DailyMission
            mission={currentMission}
            isCompleted={isCurrentDayCompleted}
            onComplete={handleMissionComplete}
          />
        ) : (
          <Card className="shadow-sm border border-border">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-foreground mb-2">Congratulations!</h2>
              <p className="text-muted-foreground">
                You've completed all 90 days of Founder's First 90!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Motivational Quote */}
      <div className="p-4">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
          <p className="text-sm text-foreground font-medium mb-1">
            "The best time to plant a tree was 20 years ago. The second best time is now."
          </p>
          <p className="text-xs text-muted-foreground">- Daily Motivation</p>
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="animate-fadeIn p-4">
      <ProgressDashboard
        progress={progress}
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
                {Math.round((progress.completedDays.length / progress.currentDay) * 100) || 0}%
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
            onClick={handleResetProgress}
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
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary" data-testid="app-title">Founder's First 90</h1>
              <p className="text-xs text-muted-foreground font-light">by TymFlo</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-accent text-2xl animate-pulse-subtle">☀️</div>
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
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProgress, Achievement } from "@/types/mission";

interface ProgressDashboardProps {
  progress: UserProgress;
  achievements: Achievement[];
  progressPercentage: number;
}

export function ProgressDashboard({ progress, achievements, progressPercentage }: ProgressDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">Your Progress</h2>
            <span className="text-2xl animate-pulse-subtle">🔥</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span data-testid="progress-percentage">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          </div>
          
          {/* Stats Row */}
          <div className="flex justify-between text-center">
            <div>
              <div className="text-lg font-bold text-primary" data-testid="current-streak">{progress.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent" data-testid="completed-days">{progress.completedDays.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary" data-testid="best-streak">{progress.bestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">This Week's Progress</h2>
          
          {/* Week Calendar */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2 font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar Days - showing current week */}
            {Array.from({ length: 7 }, (_, i) => {
              const dayNumber = progress.currentDay - (progress.currentDay % 7) + i + 1;
              const isCompleted = progress.completedDays.includes(dayNumber);
              const isCurrent = dayNumber === progress.currentDay;
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  data-testid={`calendar-day-${dayNumber}`}
                >
                  {dayNumber <= 90 ? dayNumber : ''}
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            {progress.streak >= 7 ? "Perfect week! 🔥 Keep the momentum going." : "Keep building your streak! 💪"}
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Achievements</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-lg p-3 text-center border ${
                  achievement.unlocked
                    ? 'bg-accent/10 border-accent/20'
                    : 'bg-muted border-border opacity-50'
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-semibold text-foreground">{achievement.title}</div>
                <div className="text-xs text-muted-foreground">
                  {achievement.unlocked ? 'Completed' : `${achievement.requirement} Days`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Timeline */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-4">Your Journey</h2>
          
          <div className="space-y-4 custom-scrollbar max-h-64 overflow-y-auto">
            {progress.completedDays.slice(-10).reverse().map((day) => (
              <div key={day} className="flex items-start space-x-3" data-testid={`journey-day-${day}`}>
                <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-success-foreground text-xs font-bold">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Day {day} Mission</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            ))}
            
            {progress.completedDays.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Complete your first mission to start your journey timeline!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

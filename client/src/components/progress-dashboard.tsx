import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProgress, Achievement } from "@/types/mission";

interface ProgressDashboardProps {
  progress: UserProgress;
  achievements: Achievement[];
  progressPercentage: number;
  completions?: any[]; // Add completions to get the actual completed days
}

export function ProgressDashboard({ progress, achievements, progressPercentage, completions = [] }: ProgressDashboardProps) {
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
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`day-header-${index}`} className="text-center text-xs text-muted-foreground py-2 font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar Days - showing current week */}
            {Array.from({ length: 7 }, (_, i) => {
              // Today is Friday Aug 29, and we're on day 9
              // So if today (Friday) = day 9, then the days should be:
              // Sunday = day 7, Monday = day 8, Tuesday = day 9, Wednesday = day 10, Thursday = day 11, Friday = day 9, Saturday = day 10
              // Wait, that doesn't make sense. Let me recalculate...
              
              // If today is Friday and we're on day 9, then:
              // Day 1 was Thursday of last week (Aug 21)
              // This week: Sun=day 6, Mon=day 7, Tue=day 8, Wed=day 9, Thu=day 10, Fri=day 9, Sat=day 10
              // Actually, the issue is we need to show TODAY (Friday) as day 9
              
              const today = new Date(); // Friday Aug 29, 2025
              const todayDayOfWeek = today.getDay(); // 5 (Friday)
              const currentDay = progress.currentDay; // 9
              
              // Calculate what day number each day of THIS week should be
              // If today (Friday = 5) is day 9, then:
              // Sunday (0) = day 9 - 5 = day 4
              // Monday (1) = day 9 - 4 = day 5  
              // Tuesday (2) = day 9 - 3 = day 6
              // Wednesday (3) = day 9 - 2 = day 7
              // Thursday (4) = day 9 - 1 = day 8
              // Friday (5) = day 9 = day 9
              // Saturday (6) = day 9 + 1 = day 10
              
              const dayNumber = currentDay - todayDayOfWeek + i;
              const validDayNumber = Math.max(1, Math.min(90, dayNumber));
              
              // Check if this day is completed using the completions array
              const isCompleted = completions.some(c => c.day === validDayNumber && c.completed);
              const isCurrent = validDayNumber === progress.currentDay;
              const isFuture = validDayNumber > progress.currentDay;
              const isInRange = validDayNumber >= 1 && validDayNumber <= 90;
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${
                    !isInRange
                      ? 'bg-transparent'
                      : isCompleted
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isFuture
                      ? 'bg-muted/30 text-muted-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  data-testid={`calendar-day-${validDayNumber}`}
                >
                  {isInRange ? validDayNumber : ''}
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

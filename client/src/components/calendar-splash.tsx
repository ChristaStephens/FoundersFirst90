import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Flame, Trophy, Star } from "lucide-react";
import { format, isAfter, isSameDay, startOfDay, subDays } from "date-fns";

interface CalendarSplashProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  bestStreak: number;
  completedDays: DayCompletion[];
  currentDay: number;
}

interface DayCompletion {
  day: number;
  completed: boolean;
  completedAt?: Date;
}

export function CalendarSplash({ 
  isOpen, 
  onClose, 
  streak, 
  bestStreak, 
  completedDays,
  currentDay 
}: CalendarSplashProps) {
  
  // Generate last 30 days for calendar view
  const generateCalendarDays = () => {
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dayNum = currentDay - i;
      const completion = completedDays.find(d => d.day === dayNum);
      
      days.push({
        date,
        dayNumber: dayNum,
        isCompleted: completion?.completed || false,
        isToday: isSameDay(date, today),
        isFuture: isAfter(date, today) || dayNum > currentDay,
        completedAt: completion?.completedAt
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-500";
    if (streak >= 21) return "text-orange-500"; 
    if (streak >= 14) return "text-blue-500";
    if (streak >= 7) return "text-green-500";
    return "text-gray-500";
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "🔥 Legendary Founder!";
    if (streak >= 21) return "⭐ Elite Entrepreneur!";
    if (streak >= 14) return "💪 Strong Momentum!";
    if (streak >= 7) return "🚀 Building Habits!";
    if (streak >= 3) return "📈 Getting Started!";
    return "💡 Begin Your Journey!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-gradient-to-b from-primary/5 to-accent/5" data-testid="calendar-splash-dialog">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className={`h-8 w-8 ${getStreakColor(streak)}`} />
              <span className="text-3xl font-bold text-foreground" data-testid="streak-count">
                {streak}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Day Streak</h2>
            <p className="text-sm text-muted-foreground" data-testid="streak-message">
              {getStreakMessage(streak)}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="border-primary/20">
              <CardContent className="p-3 text-center">
                <Trophy className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground" data-testid="best-streak">
                  {bestStreak}
                </p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20">
              <CardContent className="p-3 text-center">
                <Star className="h-5 w-5 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground" data-testid="completed-count">
                  {completedDays.filter(d => d.completed).length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Last 30 Days</span>
            </div>
            
            <div className="grid grid-cols-10 gap-1" data-testid="calendar-grid">
              {calendarDays.map((day, index) => (
                <div
                  key={`calendar-day-${index}`}
                  className={`
                    aspect-square rounded-sm flex items-center justify-center text-xs transition-all
                    ${day.isCompleted 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : day.isToday 
                      ? 'bg-accent/50 text-accent-foreground border border-accent' 
                      : day.isFuture 
                      ? 'bg-muted/30 text-muted-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                  title={`Day ${day.dayNumber}: ${format(day.date, 'MMM dd')}`}
                  data-testid={`calendar-day-${day.dayNumber}`}
                >
                  {day.isCompleted ? '✓' : day.dayNumber > 0 ? day.dayNumber % 10 : ''}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-accent/50 border border-accent rounded-sm"></div>
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-muted rounded-sm"></div>
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose} 
            className="w-full"
            data-testid="calendar-close-button"
          >
            Continue Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
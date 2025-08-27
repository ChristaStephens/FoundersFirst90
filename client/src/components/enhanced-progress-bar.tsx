import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy } from "lucide-react";

interface EnhancedProgressBarProps {
  currentDay: number;
  totalDays: number;
  streak: number;
  completedToday: boolean;
}

export function EnhancedProgressBar({ 
  currentDay, 
  totalDays = 90, 
  streak, 
  completedToday 
}: EnhancedProgressBarProps) {
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);
  
  const getProgressColor = () => {
    if (progressPercentage < 25) return "from-red-400 to-orange-500";
    if (progressPercentage < 50) return "from-orange-400 to-yellow-500";
    if (progressPercentage < 75) return "from-yellow-400 to-green-500";
    return "from-green-400 to-emerald-600";
  };

  const getMotivationalText = () => {
    if (progressPercentage === 100) return "Journey Complete! 🎉";
    if (progressPercentage >= 90) return "Almost there! The finish line is in sight!";
    if (progressPercentage >= 75) return "In the home stretch! You're a champion!";
    if (progressPercentage >= 50) return "Halfway there! Momentum is building!";
    if (progressPercentage >= 25) return "Getting into your groove! Keep pushing!";
    return "Every expert was once a beginner. You've got this!";
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Your Progress</h3>
          </div>
          <div className="flex items-center space-x-2">
            {streak > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Flame className="w-3 h-3 mr-1" />
                {streak} day streak
              </Badge>
            )}
            <Badge variant="outline">
              <Target className="w-3 h-3 mr-1" />
              {currentDay}/{totalDays}
            </Badge>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative mb-3">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} progress-bar transition-all duration-1000 ease-out relative`}
              style={{ 
                width: `${progressPercentage}%`,
                '--target-width': `${progressPercentage}%`
              } as any}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </div>
          </div>
          
          {/* Milestone markers */}
          <div className="absolute top-0 left-1/4 w-1 h-4 bg-white/50 rounded"></div>
          <div className="absolute top-0 left-1/2 w-1 h-4 bg-white/50 rounded"></div>
          <div className="absolute top-0 left-3/4 w-1 h-4 bg-white/50 rounded"></div>
        </div>

        {/* Progress Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-primary mb-1">
            {Math.round(progressPercentage)}% Complete
          </p>
          <p className="text-sm text-muted-foreground">
            {getMotivationalText()}
          </p>
        </div>

        {/* Milestone Progress */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { day: 7, label: "Week 1", icon: "🎯" },
            { day: 30, label: "Month 1", icon: "🚀" },
            { day: 60, label: "Month 2", icon: "💪" },
            { day: 90, label: "Complete", icon: "🏆" }
          ].map((milestone) => (
            <div
              key={milestone.day}
              className={`p-2 rounded-lg transition-all ${
                currentDay >= milestone.day
                  ? "bg-accent/20 text-accent-foreground border border-accent/30"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <div className="text-lg mb-1">{milestone.icon}</div>
              <div className="text-xs font-medium">{milestone.label}</div>
              <div className="text-xs opacity-80">Day {milestone.day}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent } from "@/components/ui/card";

interface BuildingProgressProps {
  level: number;
  completedDays: number;
}

export function BuildingProgress({ level, completedDays }: BuildingProgressProps) {
  const getBuildingStage = (level: number) => {
    if (level <= 15) return { stage: "Foundation", emoji: "🏗️", color: "text-amber-600" };
    if (level <= 30) return { stage: "Ground Floor", emoji: "🏢", color: "text-blue-600" };
    if (level <= 45) return { stage: "Second Floor", emoji: "🏢", color: "text-green-600" };
    if (level <= 60) return { stage: "Third Floor", emoji: "🏬", color: "text-purple-600" };
    if (level <= 75) return { stage: "Top Floors", emoji: "🏪", color: "text-pink-600" };
    return { stage: "Skyscraper", emoji: "🏙️", color: "text-gradient" };
  };

  const building = getBuildingStage(level);
  const nextMilestone = Math.ceil(level / 15) * 15;
  const progress = ((level % 15) / 15) * 100;

  const getBuildingLevels = (currentLevel: number) => {
    const levels = [];
    const completedFloors = Math.floor(currentLevel / 15);
    const progressInCurrentFloor = (currentLevel % 15) / 15;
    
    for (let i = 0; i < 6; i++) {
      const isBuilt = i < completedFloors;
      const isCurrentLevel = i === completedFloors;
      const isFuture = i > completedFloors;
      
      let className = '';
      let style = { width: `${Math.max(30 + i * 10, 30)}px` };
      
      if (isBuilt) {
        // Completed floors - solid and colorful
        className = `h-10 mx-1 rounded-sm transition-all duration-700 shadow-lg
          ${i % 2 === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}
          border-2 border-white/20 animate-bounce-subtle`;
      } else if (isCurrentLevel) {
        // Currently building floor - animated construction
        const buildProgress = progressInCurrentFloor * 100;
        className = `h-10 mx-1 rounded-sm transition-all duration-500 relative overflow-hidden
          bg-gradient-to-r from-amber-200 to-amber-300 border-2 border-amber-400
          animate-pulse shadow-md`;
        style = { 
          ...style, 
          backgroundImage: `linear-gradient(to right, 
            hsl(43, 89%, 70%) 0%, 
            hsl(43, 89%, 70%) ${buildProgress}%, 
            hsl(43, 30%, 85%) ${buildProgress}%, 
            hsl(43, 30%, 85%) 100%)`
        };
      } else if (isFuture) {
        // Future floors - blueprint style
        className = `h-8 mx-1 rounded-sm transition-all duration-500 opacity-40
          bg-transparent border-2 border-dashed border-slate-400`;
      }
      
      levels.push(
        <div
          key={i}
          className={className}
          style={style}
        >
          {/* Construction effects for current level */}
          {isCurrentLevel && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <div className="absolute top-0 right-1 text-xs text-amber-700 animate-bounce">🔨</div>
            </>
          )}
          
          {/* Windows for completed floors */}
          {isBuilt && (
            <div className="absolute inset-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" 
                       style={{ animationDelay: `${idx * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return levels.reverse(); // Stack from bottom up
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Your Startup Building</h3>
          <span className="text-2xl" data-testid="building-emoji">{building.emoji}</span>
        </div>
        
        {/* Building Visualization */}
        <div className="mb-4">
          <div className="flex flex-col items-center justify-end h-32 bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900 dark:to-green-900 rounded-lg p-4">
            {getBuildingLevels(level)}
            <div className="w-full h-2 bg-amber-600 rounded-sm mt-1" /> {/* Ground */}
          </div>
        </div>

        {/* Progress Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Current Stage:</span>
            <span className={`text-sm font-bold ${building.color}`} data-testid="building-stage">
              {building.stage}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Days Completed:</span>
            <span className="text-sm font-bold text-accent" data-testid="building-days">
              {completedDays}/90
            </span>
          </div>

          {level < 90 && (
            <>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to next level</span>
                <span>{nextMilestone - level} days to go</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  data-testid="building-progress-bar"
                />
              </div>
            </>
          )}

          {level >= 90 && (
            <div className="text-center p-2 bg-success/10 rounded-lg">
              <p className="text-sm font-medium text-success-foreground">
                🎉 Congratulations! Your startup empire is complete!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
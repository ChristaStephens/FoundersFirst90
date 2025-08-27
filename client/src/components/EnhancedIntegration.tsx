import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Zap, 
  Building2, 
  Star,
  Trophy,
  Sparkles,
  TrendingUp,
  Target,
  Crown,
  Rocket
} from 'lucide-react';

interface SkillToBuilding {
  skillId: string;
  buildingId: string;
  name: string;
  description: string;
  unlockedAtDay: number;
  skillLevel: number;
  buildingUnlocked: boolean;
}

const skillToBuildingMappings: SkillToBuilding[] = [
  {
    skillId: 'vision',
    buildingId: 'foundation',
    name: 'Vision Foundation',
    description: 'Your elevator pitch becomes the foundation of your startup empire',
    unlockedAtDay: 1,
    skillLevel: 1,
    buildingUnlocked: false
  },
  {
    skillId: 'customer-research',
    buildingId: 'customer-wing',
    name: 'Customer Research Wing',
    description: 'Understanding customers builds your research capabilities',
    unlockedAtDay: 2,
    skillLevel: 1,
    buildingUnlocked: false
  },
  {
    skillId: 'digital-marketing',
    buildingId: 'digital-storefront',
    name: 'Digital Storefront',
    description: 'Marketing skills create your online presence',
    unlockedAtDay: 3,
    skillLevel: 1,
    buildingUnlocked: false
  },
  {
    skillId: 'product-development',
    buildingId: 'product-lab',
    name: 'Product Development Lab',
    description: 'Building products requires dedicated development space',
    unlockedAtDay: 5,
    skillLevel: 1,
    buildingUnlocked: false
  }
];

export default function EnhancedIntegration() {
  const { data: progress } = useQuery({ queryKey: ['/api/progress'] });
  const [justLeveledUp, setJustLeveledUp] = useState<string | null>(null);
  const [buildingJustUnlocked, setBuildingJustUnlocked] = useState<string | null>(null);

  const completedDays = progress?.totalCompletedDays || 0;
  
  // Calculate current state
  const activeConnections = skillToBuildingMappings.map(mapping => {
    const skillCompleted = completedDays >= mapping.unlockedAtDay;
    const buildingUnlocked = completedDays >= mapping.unlockedAtDay;
    const currentSkillLevel = Math.min(Math.floor(completedDays / 15) + 1, 5); // Level up every 15 days
    
    return {
      ...mapping,
      skillLevel: currentSkillLevel,
      buildingUnlocked,
      isActive: skillCompleted
    };
  });

  // Detect new level ups and building unlocks
  useEffect(() => {
    const newLevelUp = activeConnections.find(conn => 
      conn.skillLevel > 1 && completedDays % 15 === 0
    );
    
    const newBuilding = activeConnections.find(conn => 
      conn.buildingUnlocked && completedDays === conn.unlockedAtDay
    );

    if (newLevelUp) {
      setJustLeveledUp(newLevelUp.skillId);
      setTimeout(() => setJustLeveledUp(null), 3000);
    }

    if (newBuilding) {
      setBuildingJustUnlocked(newBuilding.buildingId);
      setTimeout(() => setBuildingJustUnlocked(null), 3000);
    }
  }, [completedDays]);

  const totalProgress = activeConnections.filter(conn => conn.isActive).length;
  const maxProgress = skillToBuildingMappings.length;

  return (
    <div className="space-y-6">
      {/* Real-Time Progress Connection */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="absolute top-2 right-2">
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="w-5 h-5 text-purple-600" />
            Startup Building Progress
          </CardTitle>
          <p className="text-sm text-gray-600">
            Watch your skills directly build your startup empire
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Empire Completion</span>
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                {totalProgress}/{maxProgress} Buildings
              </Badge>
            </div>
            <Progress 
              value={(totalProgress / maxProgress) * 100} 
              className="h-3 mb-2"
            />
            <p className="text-xs text-gray-600">
              Complete missions to level up skills and unlock new buildings
            </p>
          </div>

          {/* Active Connections */}
          <div className="space-y-3">
            {activeConnections.map((connection, index) => {
              const isLevelingUp = justLeveledUp === connection.skillId;
              const isBuildingNew = buildingJustUnlocked === connection.buildingId;
              
              return (
                <div 
                  key={connection.skillId}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border transition-all duration-500
                    ${connection.isActive 
                      ? 'bg-white border-green-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                    }
                    ${isLevelingUp ? 'animate-pulse bg-yellow-50 border-yellow-300' : ''}
                    ${isBuildingNew ? 'animate-bounce bg-blue-50 border-blue-300' : ''}
                  `}
                  data-testid={`skill-building-connection-${connection.skillId}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Skill Icon */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${connection.isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : 'bg-gray-300'
                      }
                    `}>
                      {connection.skillLevel}
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`
                        w-6 h-0.5 
                        ${connection.isActive ? 'bg-green-400' : 'bg-gray-300'}
                      `} />
                      <div className={`
                        w-0 h-0 border-l-4 border-t-2 border-b-2 border-t-transparent border-b-transparent
                        ${connection.isActive ? 'border-l-green-400' : 'border-l-gray-300'}
                      `} />
                    </div>
                    
                    {/* Building Icon */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${connection.buildingUnlocked 
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white' 
                        : 'bg-gray-200 text-gray-400'
                      }
                    `}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    
                    {/* Connection Info */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {connection.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {connection.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="text-right">
                    {connection.isActive ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        Day {connection.unlockedAtDay}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Level Up Indicator */}
                  {isLevelingUp && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                      Level Up!
                    </div>
                  )}
                  
                  {/* Building Unlocked Indicator */}
                  {isBuildingNew && (
                    <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      Building Unlocked!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone Preview */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <h3 className="font-medium text-amber-800 mb-1">Next Milestone</h3>
            {(() => {
              const nextConnection = activeConnections.find(conn => !conn.isActive);
              if (nextConnection) {
                return (
                  <div>
                    <p className="text-sm text-amber-700 mb-2">
                      {nextConnection.name}
                    </p>
                    <Badge variant="outline" className="text-amber-800 border-amber-400">
                      Unlocks in {nextConnection.unlockedAtDay - completedDays} days
                    </Badge>
                  </div>
                );
              } else {
                return (
                  <p className="text-sm text-amber-700">
                    All buildings unlocked! You're building an empire! 🏆
                  </p>
                );
              }
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-gray-800 mb-3 text-center">Engagement Boost</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              data-testid="explore-skills"
            >
              <Star className="w-4 h-4" />
              View Skills
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              data-testid="explore-building"
            >
              <Building2 className="w-4 h-4" />
              Explore Empire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
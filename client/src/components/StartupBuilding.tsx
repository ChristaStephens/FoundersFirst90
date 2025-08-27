import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Sparkles, 
  Trees, 
  Sun, 
  Users, 
  TrendingUp, 
  Star, 
  Zap,
  Gem,
  Crown,
  Palette,
  Rocket
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useQuery } from '@tanstack/react-query';

interface StartupDecoration {
  id: string;
  name: string;
  type: 'building' | 'environment' | 'achievement' | 'special';
  cost: number;
  tokenType: 'founder_coins' | 'vision_gems';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  unlockRequirement?: {
    type: 'missions_completed' | 'streak_days' | 'tokens_earned';
    value: number;
  };
  colors: {
    from: string;
    to: string;
  };
}

const decorationItems: StartupDecoration[] = [
  {
    id: 'basic-office',
    name: 'Cozy Startup Office',
    type: 'building',
    cost: 0,
    tokenType: 'founder_coins',
    icon: Building2,
    description: 'Your humble beginning workspace',
    colors: { from: 'from-gray-400', to: 'to-gray-600' }
  },
  {
    id: 'modern-office',
    name: 'Modern Office Space',
    type: 'building',
    cost: 75,
    tokenType: 'founder_coins',
    icon: Building2,
    description: 'Sleek office with glass walls and modern furniture',
    unlockRequirement: { type: 'missions_completed', value: 10 },
    colors: { from: 'from-blue-400', to: 'to-blue-600' }
  },
  {
    id: 'tech-hub',
    name: 'Tech Innovation Hub',
    type: 'building',
    cost: 150,
    tokenType: 'founder_coins',
    icon: Building2,
    description: 'High-tech workspace with smart boards and AI assistants',
    unlockRequirement: { type: 'missions_completed', value: 25 },
    colors: { from: 'from-purple-400', to: 'to-purple-600' }
  },
  {
    id: 'unicorn-hq',
    name: 'Unicorn Headquarters',
    type: 'building',
    cost: 5,
    tokenType: 'vision_gems',
    icon: Building2,
    description: 'Prestigious headquarters of a billion-dollar startup',
    unlockRequirement: { type: 'missions_completed', value: 50 },
    colors: { from: 'from-pink-400', to: 'to-purple-600' }
  },
  {
    id: 'garden-view',
    name: 'Garden View',
    type: 'environment',
    cost: 30,
    tokenType: 'founder_coins',
    icon: Trees,
    description: 'Beautiful garden view from your office window',
    colors: { from: 'from-green-400', to: 'to-green-600' }
  },
  {
    id: 'city-skyline',
    name: 'City Skyline View',
    type: 'environment',
    cost: 60,
    tokenType: 'founder_coins',
    icon: Building2,
    description: 'Inspiring city skyline energizes your work',
    unlockRequirement: { type: 'streak_days', value: 7 },
    colors: { from: 'from-indigo-400', to: 'to-indigo-600' }
  },
  {
    id: 'ocean-view',
    name: 'Ocean View Paradise',
    type: 'environment',
    cost: 2,
    tokenType: 'vision_gems',
    icon: Sun,
    description: 'Serene ocean view for ultimate inspiration',
    unlockRequirement: { type: 'streak_days', value: 14 },
    colors: { from: 'from-cyan-400', to: 'to-blue-600' }
  },
  {
    id: 'team-expansion',
    name: 'Growing Team',
    type: 'achievement',
    cost: 45,
    tokenType: 'founder_coins',
    icon: Users,
    description: 'Your startup team is expanding with talented people',
    unlockRequirement: { type: 'missions_completed', value: 15 },
    colors: { from: 'from-orange-400', to: 'to-orange-600' }
  },
  {
    id: 'revenue-growth',
    name: 'Revenue Growth Chart',
    type: 'achievement',
    cost: 80,
    tokenType: 'founder_coins',
    icon: TrendingUp,
    description: 'Your revenue chart shows impressive growth',
    unlockRequirement: { type: 'missions_completed', value: 30 },
    colors: { from: 'from-emerald-400', to: 'to-emerald-600' }
  },
  {
    id: 'success-trophy',
    name: 'Success Trophy',
    type: 'achievement',
    cost: 3,
    tokenType: 'vision_gems',
    icon: Crown,
    description: 'A prestigious award for your entrepreneurial excellence',
    unlockRequirement: { type: 'missions_completed', value: 45 },
    colors: { from: 'from-yellow-400', to: 'to-yellow-600' }
  },
  {
    id: 'inspiration-board',
    name: 'Inspiration Board',
    type: 'special',
    cost: 25,
    tokenType: 'founder_coins',
    icon: Sparkles,
    description: 'A board filled with motivational quotes and success stories',
    colors: { from: 'from-pink-400', to: 'to-pink-600' }
  },
  {
    id: 'rainbow-theme',
    name: 'Rainbow Energy Theme',
    type: 'special',
    cost: 1,
    tokenType: 'vision_gems',
    icon: Palette,
    description: 'Transform your workspace with vibrant rainbow colors',
    unlockRequirement: { type: 'streak_days', value: 5 },
    colors: { from: 'from-purple-400', to: 'to-pink-600' }
  }
];

export function StartupBuilding() {
  const [ownedDecorations, setOwnedDecorations] = useLocalStorage<string[]>('startup-decorations', ['basic-office']);
  const [activeDecorations, setActiveDecorations] = useLocalStorage<string[]>('active-decorations', ['basic-office']);
  
  const { data: progress } = useQuery({ queryKey: ['/api/progress'] });
  const { data: tokens } = useQuery({ queryKey: ['/api/gamification/tokens'] });

  const missionsCompleted = progress?.missionsCompleted || 0;
  const currentStreak = progress?.currentStreak || 0;
  const founderCoins = tokens?.founderCoins || 0;
  const visionGems = tokens?.visionGems || 0;

  const isDecorationUnlocked = (decoration: StartupDecoration) => {
    if (!decoration.unlockRequirement) return true;
    
    const { type, value } = decoration.unlockRequirement;
    switch (type) {
      case 'missions_completed':
        return missionsCompleted >= value;
      case 'streak_days':
        return currentStreak >= value;
      case 'tokens_earned':
        return (founderCoins + visionGems * 10) >= value;
      default:
        return true;
    }
  };

  const canAfford = (decoration: StartupDecoration) => {
    return decoration.tokenType === 'founder_coins' 
      ? founderCoins >= decoration.cost
      : visionGems >= decoration.cost;
  };

  const purchaseDecoration = async (decorationId: string) => {
    const decoration = decorationItems.find(d => d.id === decorationId);
    if (!decoration || ownedDecorations.includes(decorationId) || !canAfford(decoration)) return;

    try {
      // This would typically make an API call to purchase the decoration
      // For now, we'll simulate the purchase locally
      setOwnedDecorations(prev => [...prev, decorationId]);
      setActiveDecorations(prev => [...prev, decorationId]);
      
      // TODO: Make actual API call to deduct tokens
      console.log(`Purchased ${decoration.name} for ${decoration.cost} ${decoration.tokenType}`);
    } catch (error) {
      console.error('Failed to purchase decoration:', error);
    }
  };

  const getStartupVisualization = () => {
    const activeBuildingDecoration = activeDecorations.find(id => 
      decorationItems.find(d => d.id === id)?.type === 'building'
    );
    const activeEnvironmentDecoration = activeDecorations.find(id => 
      decorationItems.find(d => d.id === id)?.type === 'environment'
    );
    
    const buildingDecoration = decorationItems.find(d => d.id === activeBuildingDecoration) || decorationItems[0];
    const environmentDecoration = decorationItems.find(d => d.id === activeEnvironmentDecoration);
    
    return { buildingDecoration, environmentDecoration };
  };

  const { buildingDecoration, environmentDecoration } = getStartupVisualization();

  return (
    <div className="space-y-6">
      {/* Main Startup Visualization */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${buildingDecoration.colors.from} ${buildingDecoration.colors.to} opacity-10`} />
        {environmentDecoration && (
          <div className={`absolute inset-0 bg-gradient-to-tr ${environmentDecoration.colors.from} ${environmentDecoration.colors.to} opacity-20`} />
        )}
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="w-5 h-5 text-purple-600" />
            Your Startup Journey
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4">
          <div className="flex items-center justify-center h-32 bg-white/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <buildingDecoration.icon className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${buildingDecoration.colors.from} ${buildingDecoration.colors.to} bg-clip-text text-transparent`} />
              <h3 className="font-semibold text-gray-800">{buildingDecoration.name}</h3>
              <p className="text-xs text-gray-600">{buildingDecoration.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{missionsCompleted}</div>
              <div className="text-xs text-blue-700">Missions Built</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-green-600">{currentStreak}</div>
              <div className="text-xs text-green-700">Day Streak</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{Math.round(missionsCompleted/90*100)}%</div>
              <div className="text-xs text-purple-700">Complete</div>
            </div>
          </div>
          
          <Progress 
            value={missionsCompleted/90*100} 
            className="h-3 bg-gray-200"
          />
          <p className="text-center text-sm text-gray-600">
            {90 - missionsCompleted} days until your startup launches! 🚀
          </p>
        </CardContent>
      </Card>

      {/* Decoration Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            Startup Decorations Store
          </CardTitle>
          <p className="text-sm text-gray-600">
            Customize your startup building with decorations and upgrades
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {['building', 'environment', 'achievement', 'special'].map(category => {
              const categoryItems = decorationItems.filter(item => item.type === category);
              const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
              
              return (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    {category === 'building' && <Building2 className="w-4 h-4" />}
                    {category === 'environment' && <Trees className="w-4 h-4" />}
                    {category === 'achievement' && <Star className="w-4 h-4" />}
                    {category === 'special' && <Zap className="w-4 h-4" />}
                    {categoryName} Decorations
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categoryItems.map((decoration) => {
                      const owned = ownedDecorations.includes(decoration.id);
                      const unlocked = isDecorationUnlocked(decoration);
                      const affordable = canAfford(decoration);
                      const IconComponent = decoration.icon;

                      return (
                        <div
                          key={decoration.id}
                          className={`relative p-3 border-2 rounded-lg transition-all ${
                            owned 
                              ? 'border-green-300 bg-green-50' 
                              : unlocked 
                                ? 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                                : 'border-gray-100 bg-gray-50 opacity-60'
                          }`}
                        >
                          {owned && (
                            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                              Owned
                            </Badge>
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${decoration.colors.from} ${decoration.colors.to}`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-800 truncate">
                                {decoration.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                {decoration.description}
                              </p>
                              
                              {decoration.unlockRequirement && !unlocked && (
                                <p className="text-xs text-orange-600 mb-2">
                                  Unlock: {decoration.unlockRequirement.value} {decoration.unlockRequirement.type.replace('_', ' ')}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs">
                                  {decoration.tokenType === 'founder_coins' ? (
                                    <span className="text-yellow-600">🪙</span>
                                  ) : (
                                    <Gem className="w-3 h-3 text-purple-600" />
                                  )}
                                  <span className="font-medium">{decoration.cost}</span>
                                </div>
                                
                                {!owned && unlocked && (
                                  <Button
                                    size="sm"
                                    variant={affordable ? "default" : "secondary"}
                                    disabled={!affordable}
                                    onClick={() => purchaseDecoration(decoration.id)}
                                    className="h-7 px-2 text-xs"
                                    data-testid={`buy-${decoration.id}`}
                                  >
                                    {affordable ? 'Buy' : 'Need More'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
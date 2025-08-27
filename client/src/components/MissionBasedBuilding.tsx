import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Users, 
  Globe, 
  MessageSquare, 
  Wrench,
  TrendingUp,
  DollarSign,
  Laptop,
  Cog,
  Rocket,
  Lightbulb,
  Crown,
  Trophy,
  Sparkles
} from 'lucide-react';

interface BuildingComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlockedAtDay: number;
  colors: {
    bg: string;
    border: string;
    text: string;
  };
  position: {
    row: number;
    col: number;
  };
}

const buildingComponents: BuildingComponent[] = [
  {
    id: 'foundation',
    name: 'Foundation & Vision',
    description: 'Your elevator pitch foundation',
    icon: Building2,
    unlockedAtDay: 1,
    colors: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
    position: { row: 5, col: 2 }
  },
  {
    id: 'customers',
    name: 'Customer Base',
    description: 'First 10 potential customers identified',
    icon: Users,
    unlockedAtDay: 2,
    colors: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
    position: { row: 4, col: 1 }
  },
  {
    id: 'digital-storefront',
    name: 'Digital Storefront',
    description: 'Landing page is live',
    icon: Globe,
    unlockedAtDay: 3,
    colors: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
    position: { row: 4, col: 3 }
  },
  {
    id: 'market-research',
    name: 'Market Research Wing',
    description: 'Customer interviews completed',
    icon: MessageSquare,
    unlockedAtDay: 4,
    colors: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
    position: { row: 3, col: 2 }
  },
  {
    id: 'product-lab',
    name: 'Product Development Lab',
    description: 'MVP defined and planned',
    icon: Wrench,
    unlockedAtDay: 5,
    colors: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' },
    position: { row: 3, col: 1 }
  },
  {
    id: 'marketing',
    name: 'Marketing Department',
    description: 'Marketing strategies established',
    icon: TrendingUp,
    unlockedAtDay: 10,
    colors: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
    position: { row: 3, col: 3 }
  },
  {
    id: 'finance',
    name: 'Financial Planning Office',
    description: 'Business model and pricing',
    icon: DollarSign,
    unlockedAtDay: 15,
    colors: { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' },
    position: { row: 2, col: 2 }
  },
  {
    id: 'tech',
    name: 'Technology Infrastructure',
    description: 'Technical foundations built',
    icon: Laptop,
    unlockedAtDay: 20,
    colors: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
    position: { row: 2, col: 1 }
  },
  {
    id: 'operations',
    name: 'Operations Center',
    description: 'Business processes optimized',
    icon: Cog,
    unlockedAtDay: 30,
    colors: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
    position: { row: 2, col: 3 }
  },
  {
    id: 'growth',
    name: 'Growth Engine',
    description: 'Scaling strategies implemented',
    icon: Rocket,
    unlockedAtDay: 45,
    colors: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
    position: { row: 1, col: 2 }
  },
  {
    id: 'innovation',
    name: 'Innovation Hub',
    description: 'R&D and new features',
    icon: Lightbulb,
    unlockedAtDay: 60,
    colors: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
    position: { row: 1, col: 1 }
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Leadership and vision refined',
    icon: Crown,
    unlockedAtDay: 75,
    colors: { bg: 'bg-violet-100', border: 'border-violet-300', text: 'text-violet-700' },
    position: { row: 1, col: 3 }
  },
  {
    id: 'success-tower',
    name: 'Success Tower',
    description: 'Your startup empire complete!',
    icon: Trophy,
    unlockedAtDay: 90,
    colors: { bg: 'bg-gradient-to-r from-yellow-100 to-orange-100', border: 'border-yellow-400', text: 'text-yellow-800' },
    position: { row: 0, col: 2 }
  }
];

export default function MissionBasedBuilding() {
  const { data: progress } = useQuery({ queryKey: ['/api/progress'] });

  if (!progress) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const completedDays = progress.totalCompletedDays || 0;
  const unlockedComponents = buildingComponents.filter(comp => completedDays >= comp.unlockedAtDay);
  const nextComponent = buildingComponents.find(comp => completedDays < comp.unlockedAtDay);

  // Create a 6x4 grid to display the building
  const grid = Array(6).fill(null).map(() => Array(4).fill(null));
  
  // Place components in the grid
  buildingComponents.forEach(component => {
    const { row, col } = component.position;
    if (row >= 0 && row < 6 && col >= 0 && col < 4) {
      grid[row][col] = component;
    }
  });

  const renderBuildingComponent = (component: BuildingComponent | null, rowIndex: number, colIndex: number) => {
    if (!component) {
      return (
        <div 
          key={`${rowIndex}-${colIndex}`}
          className="aspect-square border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 opacity-30"
        />
      );
    }

    const isUnlocked = completedDays >= component.unlockedAtDay;
    const isNext = component === nextComponent;
    const IconComponent = component.icon;

    return (
      <div 
        key={component.id}
        className={`
          aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center text-center transition-all duration-500 relative
          ${isUnlocked 
            ? `${component.colors.bg} ${component.colors.border} ${component.colors.text} animate-fade-in shadow-lg transform scale-100` 
            : isNext
            ? 'bg-amber-50 border-amber-200 text-amber-600 border-dashed animate-pulse'
            : 'bg-gray-100 border-gray-200 text-gray-400 opacity-50'
          }
        `}
        data-testid={`building-component-${component.id}`}
      >
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
        
        {isNext && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        )}
        
        <IconComponent className={`w-6 h-6 mb-1 ${isUnlocked ? '' : 'opacity-40'}`} />
        <span className={`text-xs font-medium leading-tight ${isUnlocked ? '' : 'opacity-40'}`}>
          {component.name}
        </span>
        
        {isNext && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
            Next unlock!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Building Visualization */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-purple-600" />
            Your Startup Building Journey
          </CardTitle>
          <p className="text-sm text-gray-600">
            Each completed mission builds a new part of your startup empire
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4">
          {/* Building Grid */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {grid.map((row, rowIndex) => 
                row.map((component, colIndex) => 
                  renderBuildingComponent(component, rowIndex, colIndex)
                )
              )}
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{unlockedComponents.length}</div>
              <div className="text-xs text-green-700">Components Built</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">{completedDays}</div>
              <div className="text-xs text-blue-700">Days Completed</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-xl font-bold text-purple-600">{Math.round(completedDays/90*100)}%</div>
              <div className="text-xs text-purple-700">Empire Built</div>
            </div>
          </div>
          
          <Progress 
            value={completedDays/90*100} 
            className="h-3 bg-gray-200"
          />
          
          {nextComponent && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-800">
                <strong>Next Building Component:</strong> Complete {nextComponent.unlockedAtDay - completedDays} more {completedDays === nextComponent.unlockedAtDay - 1 ? 'day' : 'days'} to unlock <strong>{nextComponent.name}</strong>
              </p>
            </div>
          )}
          
          {completedDays >= 90 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-bold text-yellow-800">Congratulations! Your startup empire is complete! 🎉</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recently Unlocked Components */}
      {unlockedComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-green-600" />
              Building Components Unlocked
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlockedComponents.slice(-4).map((component) => {
                const IconComponent = component.icon;
                return (
                  <div 
                    key={component.id}
                    className={`p-3 rounded-lg border-2 ${component.colors.bg} ${component.colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className={`w-5 h-5 ${component.colors.text} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${component.colors.text}`}>{component.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Day {component.unlockedAtDay}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
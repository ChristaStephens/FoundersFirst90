import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Zap, 
  Sparkles, 
  Crown,
  Trophy,
  MousePointer,
  Info
} from 'lucide-react';

interface BuildingComponent {
  id: string;
  name: string;
  description: string;
  unlockedAtDay: number;
  position: { x: number; y: number; width: number; height: number };
  color: string;
  hoverColor: string;
  clickEffect?: string;
}

const buildingComponents: BuildingComponent[] = [
  {
    id: 'foundation',
    name: 'Foundation & Vision',
    description: 'Your elevator pitch foundation - the bedrock of your startup',
    unlockedAtDay: 1,
    position: { x: 30, y: 80, width: 40, height: 15 },
    color: 'bg-orange-400',
    hoverColor: 'hover:bg-orange-500',
    clickEffect: 'animate-bounce'
  },
  {
    id: 'customer-wing',
    name: 'Customer Research Wing',
    description: 'Where you discover and understand your target market',
    unlockedAtDay: 2,
    position: { x: 10, y: 65, width: 25, height: 15 },
    color: 'bg-blue-400',
    hoverColor: 'hover:bg-blue-500'
  },
  {
    id: 'digital-storefront',
    name: 'Digital Storefront',
    description: 'Your online presence and landing page',
    unlockedAtDay: 3,
    position: { x: 65, y: 65, width: 25, height: 15 },
    color: 'bg-green-400',
    hoverColor: 'hover:bg-green-500'
  },
  {
    id: 'research-lab',
    name: 'Market Research Lab',
    description: 'Customer interviews and market validation center',
    unlockedAtDay: 4,
    position: { x: 35, y: 50, width: 30, height: 15 },
    color: 'bg-purple-400',
    hoverColor: 'hover:bg-purple-500'
  },
  {
    id: 'product-lab',
    name: 'Product Development Lab',
    description: 'MVP development and product iteration space',
    unlockedAtDay: 5,
    position: { x: 15, y: 35, width: 25, height: 15 },
    color: 'bg-pink-400',
    hoverColor: 'hover:bg-pink-500'
  },
  {
    id: 'marketing-tower',
    name: 'Marketing Tower',
    description: 'Strategic marketing and growth campaigns',
    unlockedAtDay: 10,
    position: { x: 60, y: 35, width: 25, height: 15 },
    color: 'bg-yellow-400',
    hoverColor: 'hover:bg-yellow-500'
  },
  {
    id: 'finance-vault',
    name: 'Financial Vault',
    description: 'Business model and financial planning center',
    unlockedAtDay: 15,
    position: { x: 40, y: 20, width: 20, height: 15 },
    color: 'bg-emerald-400',
    hoverColor: 'hover:bg-emerald-500'
  },
  {
    id: 'tech-hub',
    name: 'Technology Hub',
    description: 'Technical infrastructure and systems',
    unlockedAtDay: 20,
    position: { x: 20, y: 20, width: 20, height: 15 },
    color: 'bg-indigo-400',
    hoverColor: 'hover:bg-indigo-500'
  },
  {
    id: 'operations-center',
    name: 'Operations Center',
    description: 'Business process optimization headquarters',
    unlockedAtDay: 30,
    position: { x: 60, y: 20, width: 20, height: 15 },
    color: 'bg-teal-400',
    hoverColor: 'hover:bg-teal-500'
  },
  {
    id: 'success-tower',
    name: 'Success Tower',
    description: 'The pinnacle of your startup empire!',
    unlockedAtDay: 90,
    position: { x: 42, y: 5, width: 16, height: 15 },
    color: 'bg-gradient-to-t from-yellow-400 to-orange-400',
    hoverColor: 'hover:from-yellow-500 hover:to-orange-500',
    clickEffect: 'animate-pulse'
  }
];

export default function InteractiveBuilding() {
  const { data: progress } = useQuery({ queryKey: ['/api/progress'] });
  const [selectedComponent, setSelectedComponent] = useState<BuildingComponent | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [clickedComponent, setClickedComponent] = useState<string | null>(null);

  const completedDays = progress?.totalCompletedDays || 0;
  const unlockedComponents = buildingComponents.filter(comp => completedDays >= comp.unlockedAtDay);
  const nextComponent = buildingComponents.find(comp => completedDays < comp.unlockedAtDay);

  const handleComponentClick = (component: BuildingComponent) => {
    if (completedDays >= component.unlockedAtDay) {
      setSelectedComponent(component);
      setClickedComponent(component.id);
      
      // Reset click effect after animation
      setTimeout(() => setClickedComponent(null), 1000);
    }
  };

  // Add particles for newly unlocked components
  const [showParticles, setShowParticles] = useState<string | null>(null);
  
  useEffect(() => {
    const justUnlocked = buildingComponents.find(comp => 
      comp.unlockedAtDay === completedDays
    );
    
    if (justUnlocked) {
      setShowParticles(justUnlocked.id);
      setTimeout(() => setShowParticles(null), 3000);
    }
  }, [completedDays]);

  if (!progress) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Building */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-purple-600" />
            Interactive Startup Empire
          </CardTitle>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MousePointer className="w-4 h-4" />
            Click on unlocked buildings to explore them
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {/* Building Visualization */}
          <div className="relative h-96 bg-white/30 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-200 to-transparent" />
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-300 rounded-full animate-pulse" title="Sun" />
            
            {/* Building Components */}
            {buildingComponents.map((component) => {
              const isUnlocked = completedDays >= component.unlockedAtDay;
              const isNext = component === nextComponent;
              const isHovered = hoveredComponent === component.id;
              const isClicked = clickedComponent === component.id;
              const hasParticles = showParticles === component.id;
              
              return (
                <div key={component.id} className="absolute">
                  {/* Component Building */}
                  <div
                    style={{
                      left: `${component.position.x}%`,
                      top: `${component.position.y}%`,
                      width: `${component.position.width}%`,
                      height: `${component.position.height}%`
                    }}
                    className={`
                      relative transition-all duration-300 cursor-pointer border-2 rounded-t-lg
                      ${isUnlocked 
                        ? `${component.color} ${component.hoverColor} border-white/50 shadow-lg transform ${isHovered ? 'scale-105 -translate-y-1' : ''} ${isClicked && component.clickEffect ? component.clickEffect : ''}`
                        : isNext
                        ? 'bg-amber-200 border-amber-300 border-dashed animate-pulse'
                        : 'bg-gray-200 border-gray-300 opacity-40'
                      }
                    `}
                    onMouseEnter={() => setHoveredComponent(component.id)}
                    onMouseLeave={() => setHoveredComponent(null)}
                    onClick={() => handleComponentClick(component)}
                    data-testid={`building-${component.id}`}
                  >
                    {/* Building details */}
                    {isUnlocked && (
                      <>
                        {/* Windows */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-sm" />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-sm" />
                        
                        {/* Success indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </>
                    )}
                    
                    {/* Next building indicator */}
                    {isNext && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full animate-bounce">
                        Day {component.unlockedAtDay}
                      </div>
                    )}
                    
                    {/* Particle effect for newly unlocked */}
                    {hasParticles && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                            style={{
                              left: `${20 + i * 10}%`,
                              top: `${10 + (i % 3) * 20}%`,
                              animationDelay: `${i * 200}ms`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Hover tooltip */}
                  {isHovered && isUnlocked && (
                    <div
                      style={{
                        left: `${component.position.x + component.position.width / 2}%`,
                        top: `${component.position.y - 5}%`
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-full z-20"
                    >
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {component.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Building Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">{unlockedComponents.length}</div>
              <div className="text-xs text-gray-700">Buildings</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{completedDays}</div>
              <div className="text-xs text-gray-700">Days</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{Math.round(completedDays/90*100)}%</div>
              <div className="text-xs text-gray-700">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Component Details */}
      {selectedComponent && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              {selectedComponent.name}
              <Badge variant="outline">Day {selectedComponent.unlockedAtDay}</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-700 mb-4">{selectedComponent.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Unlocked on day {selectedComponent.unlockedAtDay}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedComponent(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Next Unlock Preview */}
      {nextComponent && (
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium text-yellow-800 mb-1">Next Building</h3>
              <p className="text-sm text-yellow-700 mb-2">{nextComponent.name}</p>
              <Badge variant="outline" className="text-yellow-800 border-yellow-400">
                Unlocks in {nextComponent.unlockedAtDay - completedDays} days
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
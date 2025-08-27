import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  MessageSquare, 
  Wrench,
  DollarSign,
  Laptop,
  Cog,
  Rocket,
  Star,
  Zap
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  currentLevel: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  unlockedMissions: number[];
  color: string;
}

const skillDefinitions: Omit<Skill, 'currentLevel' | 'experience' | 'experienceToNext'>[] = [
  {
    id: 'vision',
    name: 'Vision & Strategy',
    icon: Star,
    description: 'Crafting compelling vision and strategy',
    maxLevel: 10,
    unlockedMissions: [1, 5, 15, 30, 45, 60, 75, 90],
    color: 'text-purple-600'
  },
  {
    id: 'customer-research',
    name: 'Customer Research',
    icon: Users,
    description: 'Understanding your target market',
    maxLevel: 8,
    unlockedMissions: [2, 4, 12, 25, 40, 55, 70, 85],
    color: 'text-blue-600'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    icon: Globe,
    description: 'Building online presence and reach',
    maxLevel: 8,
    unlockedMissions: [3, 8, 18, 35, 50, 65, 80],
    color: 'text-green-600'
  },
  {
    id: 'product-development',
    name: 'Product Development',
    icon: Wrench,
    description: 'Building and iterating products',
    maxLevel: 9,
    unlockedMissions: [5, 10, 20, 38, 52, 67, 82],
    color: 'text-orange-600'
  },
  {
    id: 'sales',
    name: 'Sales & Conversion',
    icon: TrendingUp,
    description: 'Converting prospects to customers',
    maxLevel: 7,
    unlockedMissions: [6, 16, 28, 42, 58, 73, 88],
    color: 'text-red-600'
  },
  {
    id: 'finance',
    name: 'Financial Management',
    icon: DollarSign,
    description: 'Managing money and growth',
    maxLevel: 6,
    unlockedMissions: [7, 22, 37, 53, 68, 83],
    color: 'text-emerald-600'
  },
  {
    id: 'technology',
    name: 'Technology & Systems',
    icon: Laptop,
    description: 'Building technical infrastructure',
    maxLevel: 7,
    unlockedMissions: [9, 24, 39, 54, 69, 84],
    color: 'text-indigo-600'
  },
  {
    id: 'operations',
    name: 'Operations & Scale',
    icon: Cog,
    description: 'Optimizing processes for growth',
    maxLevel: 6,
    unlockedMissions: [14, 32, 48, 63, 78],
    color: 'text-teal-600'
  },
  {
    id: 'leadership',
    name: 'Leadership & Team',
    icon: Rocket,
    description: 'Leading and building teams',
    maxLevel: 5,
    unlockedMissions: [26, 44, 61, 76, 89],
    color: 'text-pink-600'
  }
];

export default function SkillProgressTracker() {
  const { data: progress } = useQuery({ queryKey: ['/api/progress'] });
  const [animatingSkills, setAnimatingSkills] = useState<Set<string>>(new Set());

  const calculateSkillProgress = (skill: Omit<Skill, 'currentLevel' | 'experience' | 'experienceToNext'>, completedDays: number): Skill => {
    const completedMissions = skill.unlockedMissions.filter(day => completedDays >= day);
    const currentLevel = Math.min(completedMissions.length, skill.maxLevel);
    const experience = completedMissions.length * 100;
    const experienceToNext = currentLevel < skill.maxLevel ? 100 : 0;
    
    return {
      ...skill,
      currentLevel,
      experience: experience % 100,
      experienceToNext
    };
  };

  const skills = skillDefinitions.map(skill => 
    calculateSkillProgress(skill, progress?.totalCompletedDays || 0)
  );

  // Animate skill level ups
  useEffect(() => {
    if (!progress?.totalCompletedDays) return;
    
    const justLeveledSkills = skills.filter(skill => {
      const missionJustCompleted = skill.unlockedMissions.includes(progress.totalCompletedDays);
      return missionJustCompleted && skill.currentLevel > 0;
    });

    if (justLeveledSkills.length > 0) {
      const newAnimating = new Set(justLeveledSkills.map(skill => skill.id));
      setAnimatingSkills(newAnimating);
      
      setTimeout(() => setAnimatingSkills(new Set()), 3000);
    }
  }, [progress?.totalCompletedDays]);

  const getSkillBadge = (skill: Skill) => {
    if (skill.currentLevel === 0) return null;
    if (skill.currentLevel === skill.maxLevel) return 'Master';
    if (skill.currentLevel >= skill.maxLevel * 0.8) return 'Expert';
    if (skill.currentLevel >= skill.maxLevel * 0.6) return 'Advanced';
    if (skill.currentLevel >= skill.maxLevel * 0.4) return 'Intermediate';
    return 'Beginner';
  };

  if (!progress) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalSkillPoints = skills.reduce((sum, skill) => sum + skill.currentLevel, 0);
  const maxSkillPoints = skills.reduce((sum, skill) => sum + skill.maxLevel, 0);

  return (
    <div className="space-y-6">
      {/* Overall Skill Progress */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-purple-600" />
            Entrepreneurial Skills
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time skill development as you complete missions
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4">
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {totalSkillPoints} / {maxSkillPoints}
            </div>
            <div className="text-sm text-gray-600 mb-2">Total Skill Points</div>
            <Progress 
              value={(totalSkillPoints / maxSkillPoints) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skill Breakdown</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              const isAnimating = animatingSkills.has(skill.id);
              const badge = getSkillBadge(skill);
              
              return (
                <div 
                  key={skill.id}
                  className={`
                    p-4 border-2 rounded-lg transition-all duration-500 relative
                    ${isAnimating 
                      ? 'border-yellow-300 bg-yellow-50 animate-pulse scale-105 shadow-lg' 
                      : skill.currentLevel > 0
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-gray-100 bg-gray-25 opacity-60'
                    }
                  `}
                  data-testid={`skill-${skill.id}`}
                >
                  {isAnimating && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                      Level Up!
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 mb-3">
                    <IconComponent className={`w-5 h-5 ${skill.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800 text-sm">{skill.name}</h4>
                        {badge && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-1 py-0"
                          >
                            {badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">
                        Level {skill.currentLevel} / {skill.maxLevel}
                      </span>
                      {skill.currentLevel < skill.maxLevel && (
                        <span className="text-gray-500">
                          Next: {skill.unlockedMissions.find(day => day > (progress?.totalCompletedDays || 0)) || '?'} days
                        </span>
                      )}
                    </div>
                    
                    <Progress 
                      value={(skill.currentLevel / skill.maxLevel) * 100} 
                      className="h-1.5"
                    />
                    
                    {skill.currentLevel > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {skill.unlockedMissions.slice(0, skill.currentLevel).map(day => (
                          <div 
                            key={day}
                            className="w-2 h-2 bg-green-400 rounded-full"
                            title={`Unlocked at day ${day}`}
                          />
                        ))}
                        {skill.unlockedMissions.slice(skill.currentLevel).slice(0, 3).map(day => (
                          <div 
                            key={day}
                            className="w-2 h-2 bg-gray-200 rounded-full"
                            title={`Unlocks at day ${day}`}
                          />
                        ))}
                      </div>
                    )}
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
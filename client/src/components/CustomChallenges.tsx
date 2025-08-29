import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Target, Trophy, Flame, Star, Clock, CheckCircle } from 'lucide-react';

interface CustomChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'business' | 'health' | 'learning' | 'networking' | 'productivity';
  coinsReward: number;
  gemsReward: number;
  estimatedTime: string;
  isActive: boolean;
  completed: boolean;
}

const suggestionsByCategory = {
  business: [
    { title: 'Research 3 competitors', difficulty: 'easy', coins: 5, gems: 1, time: '30 min' },
    { title: 'Write a business plan section', difficulty: 'medium', coins: 15, gems: 3, time: '1 hour' },
    { title: 'Validate idea with 5 potential customers', difficulty: 'hard', coins: 25, gems: 5, time: '2 hours' },
    { title: 'Create social media content', difficulty: 'easy', coins: 8, gems: 1, time: '20 min' },
    { title: 'Analyze market trends', difficulty: 'medium', coins: 12, gems: 2, time: '45 min' },
  ],
  health: [
    { title: 'Take a 15-minute walk', difficulty: 'easy', coins: 3, gems: 0, time: '15 min' },
    { title: 'Do 30 minutes of exercise', difficulty: 'medium', coins: 10, gems: 2, time: '30 min' },
    { title: 'Prepare a healthy meal', difficulty: 'medium', coins: 8, gems: 1, time: '45 min' },
    { title: 'Meditate for 10 minutes', difficulty: 'easy', coins: 5, gems: 1, time: '10 min' },
  ],
  learning: [
    { title: 'Read industry article', difficulty: 'easy', coins: 6, gems: 1, time: '20 min' },
    { title: 'Complete online course module', difficulty: 'medium', coins: 18, gems: 3, time: '1 hour' },
    { title: 'Watch entrepreneur interview', difficulty: 'easy', coins: 4, gems: 0, time: '30 min' },
    { title: 'Take skill assessment quiz', difficulty: 'medium', coins: 12, gems: 2, time: '25 min' },
  ],
  networking: [
    { title: 'Connect with 3 people on LinkedIn', difficulty: 'easy', coins: 7, gems: 1, time: '15 min' },
    { title: 'Attend virtual networking event', difficulty: 'hard', coins: 20, gems: 4, time: '2 hours' },
    { title: 'Send follow-up message to contact', difficulty: 'easy', coins: 5, gems: 0, time: '10 min' },
    { title: 'Join entrepreneur community', difficulty: 'medium', coins: 15, gems: 2, time: '30 min' },
  ],
  productivity: [
    { title: 'Organize workspace', difficulty: 'easy', coins: 4, gems: 0, time: '20 min' },
    { title: 'Plan tomorrow\'s priorities', difficulty: 'easy', coins: 6, gems: 1, time: '15 min' },
    { title: 'Time-block your schedule', difficulty: 'medium', coins: 10, gems: 2, time: '30 min' },
    { title: 'Complete focused work session', difficulty: 'hard', coins: 20, gems: 3, time: '2 hours' },
  ],
};

export default function CustomChallenges() {
  const [customChallenges, setCustomChallenges] = useLocalStorage<CustomChallenge[]>('custom-challenges', []);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof suggestionsByCategory>('business');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const addChallenge = (suggestion: any) => {
    const newChallenge: CustomChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      title: suggestion.title,
      description: `Complete this ${suggestion.difficulty} challenge to earn rewards`,
      difficulty: suggestion.difficulty,
      category: selectedCategory,
      coinsReward: suggestion.coins,
      gemsReward: suggestion.gems,
      estimatedTime: suggestion.time,
      isActive: true,
      completed: false,
    };

    setCustomChallenges(prev => [...prev, newChallenge]);
    setShowSuggestions(false);
    
    toast({
      title: 'Challenge Added!',
      description: `"${suggestion.title}" added to your daily challenges`,
    });
  };

  const toggleChallenge = (id: string) => {
    setCustomChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, isActive: !challenge.isActive }
          : challenge
      )
    );
  };

  const completeChallenge = (id: string) => {
    const challenge = customChallenges.find(c => c.id === id);
    if (!challenge) return;

    setCustomChallenges(prev => 
      prev.map(c => 
        c.id === id 
          ? { ...c, completed: true }
          : c
      )
    );

    toast({
      title: 'Challenge Completed!',
      description: `Earned ${challenge.coinsReward} coins${challenge.gemsReward > 0 ? ` and ${challenge.gemsReward} gems` : ''}`,
    });
  };

  const removeChallenge = (id: string) => {
    setCustomChallenges(prev => prev.filter(c => c.id !== id));
    toast({
      title: 'Challenge Removed',
      description: 'Challenge removed from your list',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return '💼';
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'networking': return '🤝';
      case 'productivity': return '⚡';
      default: return '🎯';
    }
  };

  const activeChallenges = customChallenges.filter(c => c.isActive && !c.completed);
  const completedToday = customChallenges.filter(c => c.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Custom Daily Challenges</h2>
        <p className="text-gray-600">Create your own challenges to earn more rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{activeChallenges.length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {completedToday.reduce((sum, c) => sum + c.coinsReward + c.gemsReward, 0)}
            </div>
            <div className="text-sm text-gray-600">Rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Challenge Button */}
      <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90" data-testid="add-challenge">
            <Plus className="w-4 h-4 mr-2" />
            Add New Challenge
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Challenge</DialogTitle>
            <DialogDescription>
              Select a category and choose from our suggested challenges
            </DialogDescription>
          </DialogHeader>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(suggestionsByCategory).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category as keyof typeof suggestionsByCategory)}
                className="capitalize"
              >
                {getCategoryIcon(category)} {category}
              </Button>
            ))}
          </div>

          {/* Challenge Suggestions */}
          <div className="space-y-3">
            {suggestionsByCategory[selectedCategory].map((suggestion, index) => (
              <Card key={index} className="border hover:border-[#FF6B35] transition-colors cursor-pointer">
                <CardContent className="p-4" onClick={() => addChallenge(suggestion)}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                    <Badge className={getDifficultyColor(suggestion.difficulty)}>
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {suggestion.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {suggestion.coins} coins
                      </span>
                      {suggestion.gems > 0 && (
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-purple-500" />
                          {suggestion.gems} gems
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF6B35]" />
              Today's Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeChallenges.map(challenge => (
              <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getCategoryIcon(challenge.category)}</span>
                    <h4 className="font-medium text-sm">{challenge.title}</h4>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{challenge.estimatedTime}</span>
                    <span>{challenge.coinsReward} coins</span>
                    {challenge.gemsReward > 0 && <span>{challenge.gemsReward} gems</span>}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => completeChallenge(challenge.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid={`complete-${challenge.id}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeChallenge(challenge.id)}
                    data-testid={`remove-${challenge.id}`}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Challenges */}
      {completedToday.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Trophy className="w-5 h-5" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedToday.map(challenge => (
              <div key={challenge.id} className="flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{challenge.title}</span>
                </div>
                <div className="text-xs text-green-600">
                  +{challenge.coinsReward} coins{challenge.gemsReward > 0 ? ` +${challenge.gemsReward} gems` : ''}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Gem, CheckCircle, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  rewardType: 'founder_coins' | 'vision_gems';
  rewardAmount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  completedAt?: string;
}

interface DailyChallengesData {
  challenges: DailyChallenge[];
  completedCount: number;
  totalCount: number;
}

export function DailyChallenges() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challengesData, isLoading } = useQuery<DailyChallengesData>({
    queryKey: ['/api/gamification/challenges/daily'],
  });

  const completeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      await apiRequest('POST', '/api/gamification/challenges/complete', { challengeId });
    },
    onSuccess: (_, challengeId) => {
      const challenge = challengesData?.challenges.find(c => c.id === challengeId);
      if (challenge) {
        toast({
          title: 'Challenge Complete!',
          description: `You earned ${challenge.rewardAmount} ${
            challenge.rewardType === 'founder_coins' ? 'Founder Coins' : 'Vision Gems'
          }!`,
        });
      }
      // Refresh challenges and token data
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/challenges/daily'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/tokens'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Challenge Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <CardTitle>Daily Challenges</CardTitle>
          </div>
          <CardDescription>Complete challenges to earn bonus tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-300 rounded w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!challengesData || challengesData.challenges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <CardTitle>Daily Challenges</CardTitle>
          </div>
          <CardDescription>Complete challenges to earn bonus tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No challenges available today. Check back tomorrow!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="daily-challenges">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <CardTitle>Daily Challenges</CardTitle>
          </div>
          <Badge variant="secondary" data-testid="challenge-progress">
            {challengesData.completedCount}/{challengesData.totalCount}
          </Badge>
        </div>
        <CardDescription>Complete challenges to earn bonus tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {challengesData.challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`p-3 border rounded-lg transition-all ${
              challenge.completedAt 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-card hover:bg-accent/50'
            }`}
            data-testid={`challenge-${challenge.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getDifficultyIcon(challenge.difficulty)}</span>
                  <h4 className="font-medium text-sm" data-testid={`challenge-title-${challenge.id}`}>
                    {challenge.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 ${getDifficultyColor(challenge.difficulty)} text-white border-none`}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground" data-testid={`challenge-description-${challenge.id}`}>
                  {challenge.description}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {challenge.rewardType === 'founder_coins' ? (
                      <Coins className="h-3 w-3 text-orange-500" />
                    ) : (
                      <Gem className="h-3 w-3 text-purple-500" />
                    )}
                    <span className="text-xs font-medium">
                      +{challenge.rewardAmount} {challenge.rewardType === 'founder_coins' ? 'FC' : 'VG'}
                    </span>
                  </div>
                  
                  {challenge.completedAt && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {!challenge.completedAt && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => completeMutation.mutate(challenge.id)}
                  disabled={completeMutation.isPending}
                  data-testid={`complete-challenge-${challenge.id}`}
                  className="shrink-0"
                >
                  {completeMutation.isPending ? (
                    <>
                      <Clock className="h-3 w-3 mr-1 animate-spin" />
                      Completing
                    </>
                  ) : (
                    'Complete'
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
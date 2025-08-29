import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Clock, Calendar, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimeLockDisplayProps {
  onEndDay?: () => void;
  currentDay: number;
}

export function TimeLockDisplay({ onEndDay, currentDay }: TimeLockDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { data: advancementData, refetch } = useQuery<{
    canAdvance: boolean;
    timeLeft: number;
    nextUnlockTime: string;
    currentDay: number;
  }>({
    queryKey: ['/api/can-advance'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Update countdown timer
  useEffect(() => {
    if (!advancementData?.nextUnlockTime || advancementData.canAdvance) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const unlock = new Date(advancementData.nextUnlockTime).getTime();
      const difference = unlock - now;

      if (difference <= 0) {
        setTimeLeft('');
        refetch(); // Check if we can advance now
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [advancementData, refetch]);

  if (!advancementData) return null;

  if (advancementData.canAdvance) {
    return (
      <Card className="border border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Ready to Continue!</h3>
                <p className="text-sm text-green-600">Your next day is unlocked and waiting</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">
              <Calendar className="w-3 h-3 mr-1" />
              Day {currentDay}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unlockDate = new Date(advancementData.nextUnlockTime);
  const formattedUnlockTime = unlockDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Card className="border border-purple-200 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Building Daily Habits</h3>
              <p className="text-sm text-purple-600">
                Your next day unlocks in <span className="font-mono font-bold">{timeLeft}</span>
              </p>
              <p className="text-xs text-purple-500">
                {formattedUnlockTime}
              </p>
            </div>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">
              <Clock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
            {onEndDay && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEndDay}
                className="text-xs"
                data-testid="end-day-button"
              >
                End Day Early
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-white/50 rounded-lg border border-purple-100">
          <p className="text-xs text-purple-600 text-center">
            💡 This prevents task burnthrough and helps build consistent daily entrepreneurial habits
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
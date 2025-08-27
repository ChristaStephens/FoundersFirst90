import { useQuery } from '@tanstack/react-query';
import { Coins, Gem } from 'lucide-react';

interface TokenData {
  founderCoins: number;
  visionGems: number;
  experiencePoints: number;
  entrepreneurLevel: number;
  streakRestoresUsed: number;
}

export function TokenBalance() {
  const { data: tokenData, isLoading } = useQuery<TokenData>({
    queryKey: ['/api/gamification/tokens'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/20 dark:to-orange-900/20 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-4 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/20 dark:to-orange-900/20 p-3 rounded-lg"
      data-testid="token-balance"
    >
      {/* Founder Coins */}
      <div className="flex items-center gap-2" data-testid="founder-coins-display">
        <div className="p-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm">
          <Coins className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-orange-700 dark:text-orange-300" data-testid="founder-coins-amount">
            {tokenData?.founderCoins || 0}
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400 leading-none">
            Founder Coins
          </span>
        </div>
      </div>

      {/* Vision Gems */}
      <div className="flex items-center gap-2" data-testid="vision-gems-display">
        <div className="p-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-sm">
          <Gem className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300" data-testid="vision-gems-amount">
            {tokenData?.visionGems || 0}
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 leading-none">
            Vision Gems
          </span>
        </div>
      </div>

      {/* Level Display */}
      <div className="flex items-center gap-2 ml-2" data-testid="level-display">
        <div className="p-1 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm">
          <span className="text-xs font-bold text-white px-1">
            L{tokenData?.entrepreneurLevel || 1}
          </span>
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          Entrepreneur
        </span>
      </div>
    </div>
  );
}
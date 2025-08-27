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
      className="flex items-center gap-4 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/20 dark:to-orange-900/20 p-3 rounded-lg hover-lift transition-all duration-300 hover:shadow-lg"
      data-testid="token-balance"
    >
      {/* Founder Coins */}
      <div className="flex items-center gap-2 group hover-wiggle" data-testid="founder-coins-display">
        <div className="p-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm group-hover:animate-heartbeat">
          <Coins className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-110" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-orange-700 dark:text-orange-300 transition-all duration-200 group-hover:text-orange-600 group-hover:scale-105" data-testid="founder-coins-amount">
            {tokenData?.founderCoins || 0}
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400 leading-none transition-all duration-200 group-hover:text-orange-500">
            Founder Coins
          </span>
        </div>
      </div>

      {/* Vision Gems */}
      <div className="flex items-center gap-2 group hover-wiggle" data-testid="vision-gems-display">
        <div className="p-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-sm group-hover:animate-sparkle">
          <Gem className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-110" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300 transition-all duration-200 group-hover:text-purple-600 group-hover:scale-105" data-testid="vision-gems-amount">
            {tokenData?.visionGems || 0}
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 leading-none transition-all duration-200 group-hover:text-purple-500">
            Vision Gems
          </span>
        </div>
      </div>

      {/* Level Display */}
      <div className="flex items-center gap-2 ml-2 group hover-float" data-testid="level-display">
        <div className="p-1 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm group-hover:animate-jello">
          <span className="text-xs font-bold text-white px-1 transition-transform duration-200 group-hover:scale-110">
            L{tokenData?.entrepreneurLevel || 1}
          </span>
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 transition-all duration-200 group-hover:text-emerald-500">
          Entrepreneur
        </span>
      </div>
    </div>
  );
}
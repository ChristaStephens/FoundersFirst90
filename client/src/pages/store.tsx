import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TokenBalance } from '@/components/TokenBalance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Gem, ShoppingCart, Zap, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'streak_tools' | 'power_ups' | 'customization' | 'charity';
  tokenType: 'founder_coins' | 'vision_gems';
  cost: number;
  iconEmoji: string;
  isActive: boolean;
  sortOrder: number;
}

interface TokenData {
  founderCoins: number;
  visionGems: number;
  experiencePoints: number;
  entrepreneurLevel: number;
  streakRestoresUsed: number;
}

interface StoreData {
  items: StoreItem[];
}

export default function Store() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: storeData, isLoading: storeLoading } = useQuery<StoreData>({
    queryKey: ['/api/gamification/store'],
  });

  const { data: tokenData, isLoading: tokenLoading } = useQuery<TokenData>({
    queryKey: ['/api/gamification/tokens'],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest('POST', '/api/gamification/purchase', { itemId });
    },
    onSuccess: () => {
      toast({
        title: 'Purchase Successful!',
        description: 'Your item has been added to your inventory.',
      });
      // Refresh both store and token data
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/store'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gamification/tokens'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Purchase Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const canAfford = (item: StoreItem): boolean => {
    if (!tokenData) return false;
    if (item.tokenType === 'founder_coins') {
      return tokenData.founderCoins >= item.cost;
    } else {
      return tokenData.visionGems >= item.cost;
    }
  };

  const handlePurchase = (item: StoreItem) => {
    if (!canAfford(item)) {
      toast({
        title: 'Insufficient Tokens',
        description: `You need ${item.cost} ${item.tokenType === 'founder_coins' ? 'Founder Coins' : 'Vision Gems'} to purchase this item.`,
        variant: 'destructive',
      });
      return;
    }
    purchaseMutation.mutate(item.id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak_tools': return '🛡️';
      case 'power_ups': return '⚡';
      case 'customization': return '🎨';
      case 'charity': return '❤️';
      default: return '🏆';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'streak_tools': return 'Streak Protection';
      case 'power_ups': return 'Power-Ups';
      case 'customization': return 'Customization';
      case 'charity': return 'Make an Impact';
      default: return 'Items';
    }
  };

  if (storeLoading || tokenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievement Store</h1>
            <p className="text-gray-600 dark:text-gray-300">Spend your tokens to unlock powerful tools and rewards</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-300 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-300 rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const items: StoreItem[] = storeData?.items || [];
  const categories = ['streak_tools', 'power_ups', 'customization', 'charity'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4" data-testid="store-page">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="absolute left-0 top-0 p-2"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingCart className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievement Store</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Spend your tokens to unlock powerful tools, streak protection, and ways to make a positive impact while building your startup!
          </p>
          
          {/* Token Balance */}
          <TokenBalance />
        </div>

        {/* Store Tabs */}
        <Tabs defaultValue="streak_tools" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm" data-testid={`tab-${category}`}>
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {getCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items
                  .filter(item => item.category === category)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <Card 
                      key={item.id} 
                      className={`transition-all hover:shadow-md ${!canAfford(item) ? 'opacity-60' : ''}`}
                      data-testid={`store-item-${item.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-2xl">{item.iconEmoji}</div>
                          <Badge variant={item.tokenType === 'founder_coins' ? 'default' : 'secondary'}>
                            <div className="flex items-center gap-1">
                              {item.tokenType === 'founder_coins' ? (
                                <Coins className="h-3 w-3" />
                              ) : (
                                <Gem className="h-3 w-3" />
                              )}
                              {item.cost}
                            </div>
                          </Badge>
                        </div>
                        <CardTitle className="text-lg" data-testid={`item-name-${item.id}`}>
                          {item.name}
                        </CardTitle>
                        <CardDescription data-testid={`item-description-${item.id}`}>
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford(item) || purchaseMutation.isPending}
                          className="w-full"
                          data-testid={`purchase-button-${item.id}`}
                        >
                          {purchaseMutation.isPending ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-spin" />
                              Purchasing...
                            </>
                          ) : canAfford(item) ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Purchase
                            </>
                          ) : (
                            'Insufficient Tokens'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              {items.filter(item => item.category === category).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No items available in this category</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
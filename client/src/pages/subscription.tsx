import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Crown, Check, Zap, Users, BarChart3, Shield, Clock, ArrowLeft } from 'lucide-react';

// Stripe setup
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment Form Component
function PaymentForm({ plan, clientSecret, onSuccess }: { 
  plan: string; 
  clientSecret: string; 
  onSuccess: () => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription?success=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful!",
        description: "Welcome to Founder's First 90 Premium!",
      });
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : (
          `Subscribe to ${plan === 'yearly' ? 'Annual' : 'Monthly'} Plan`
        )}
      </Button>
    </form>
  );
}

// Countdown Timer Component
function CountdownTimer({ expiry }: { expiry: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiry.getTime() - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  return <span className="font-mono font-bold text-red-600">{timeLeft}</span>;
}

// Discount tracking hook
function useDiscountTracking() {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountExpiry, setDiscountExpiry] = useState<Date | null>(null);

  useEffect(() => {
    // Track visits to subscription page
    const visits = JSON.parse(localStorage.getItem('subscriptionVisits') || '[]');
    const today = new Date().toDateString();
    
    // Add today's visit if not already recorded
    if (!visits.includes(today)) {
      visits.push(today);
      localStorage.setItem('subscriptionVisits', JSON.stringify(visits));
    }

    // Show discount if user has visited 3+ times over different days and hasn't purchased
    const hasActiveDiscount = localStorage.getItem('discountOffered');
    if (visits.length >= 3 && !hasActiveDiscount) {
      setShowDiscount(true);
      // Set 48-hour discount expiry
      const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
      setDiscountExpiry(expiry);
      localStorage.setItem('discountOffered', expiry.toISOString());
    } else if (hasActiveDiscount) {
      const expiry = new Date(hasActiveDiscount);
      if (expiry > new Date()) {
        setShowDiscount(true);
        setDiscountExpiry(expiry);
      }
    }
  }, []);

  return { showDiscount, discountExpiry };
}

export default function SubscriptionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { showDiscount, discountExpiry } = useDiscountTracking();

  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  // Get subscription status
  const { data: subscriptionData, isLoading } = useQuery<{
    subscriptionStatus: string;
    subscriptionPlan: string;
    trialEndsAt?: string;
    subscriptionEndsAt?: string;
    hasAccess: boolean;
  }>({
    queryKey: ['/api/subscription/status'],
    retry: false,
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/start-trial');
    },
    onSuccess: () => {
      toast({
        title: "Trial Started!",
        description: "You now have 7 days of premium access.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create payment mutation  
  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const discountAmount = showDiscount ? 1000 : 0; // $10 discount in cents
      const response = await apiRequest('POST', '/api/create-payment', { 
        discount: discountAmount 
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartTrial = () => {
    startTrialMutation.mutate();
  };

  const handlePurchase = () => {
    createPaymentMutation.mutate();
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setClientSecret('');
    // Clear discount tracking after successful purchase
    localStorage.removeItem('discountOffered');
    localStorage.removeItem('subscriptionVisits');
    queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    toast({
      title: "Welcome to Premium!",
      description: "You now have full access to all features.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full" />
      </div>
    );
  }

  const subscription = subscriptionData;
  const hasAccess = subscription?.hasAccess;
  const isTrialing = subscription?.subscriptionStatus === 'trialing';
  const isActive = subscription?.subscriptionStatus === 'active';

  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <Crown className="w-6 h-6 text-[#FF6B35]" />
                Complete Your Subscription
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {showDiscount ? '$19.99 (Limited time discount!)' : '$29.99'}
              </p>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  plan={selectedPlan || 'monthly'} 
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-[#FF6B35] bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've transformed their ideas into successful businesses
          </p>
        </div>

        {/* Current Status & Management */}
        {hasAccess && (
          <Card className="max-w-md mx-auto mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <Badge variant="outline" className="border-green-600 text-green-600">
                  {isTrialing ? 'Free Trial' : 'Premium Active'}
                </Badge>
              </div>
              <p className="text-sm text-green-700 mb-4">
                {isTrialing && subscription?.trialEndsAt
                  ? `Trial ends ${new Date(subscription.trialEndsAt).toLocaleDateString()}`
                  : 'You have full access to all premium features'
                }
              </p>
              
              {/* Subscription Management Options */}
              <div className="space-y-2">
                {isTrialing && (
                  <Button 
                    onClick={handlePurchase}
                    className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                    data-testid="button-upgrade-to-premium"
                  >
                    Upgrade to Premium Now
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Mock pause subscription
                      toast({
                        title: "Subscription Paused",
                        description: "Your subscription will pause at the end of this billing cycle.",
                      });
                    }}
                    data-testid="button-pause-subscription"
                  >
                    Pause Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Mock cancel subscription
                      toast({
                        title: "Cancellation Requested",
                        description: "Sorry to see you go! Your access continues until period end.",
                        variant: "destructive",
                      });
                    }}
                    data-testid="button-cancel-subscription"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Limited Time Discount Banner */}
        {showDiscount && discountExpiry && !hasAccess && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg mb-8 mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">LIMITED TIME OFFER!</span>
            </div>
            <div className="text-center">
              <p className="mb-2">🎉 Special discount just for you! Get $10 off your purchase</p>
              <p className="text-sm">
                Offer expires in: <CountdownTimer expiry={discountExpiry} />
              </p>
            </div>
          </div>
        )}

        {/* Free Trial CTA */}
        {!hasAccess && !subscription?.trialEndsAt && (
          <Card className="max-w-md mx-auto mb-8 border-[#FF6B35] bg-gradient-to-r from-[#FF6B35]/10 to-purple-500/10">
            <CardContent className="pt-6 text-center">
              <Zap className="w-12 h-12 text-[#FF6B35] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Start Your Free 7-Day Trial</h3>
              <p className="text-sm text-gray-600 mb-4">
                Experience all premium features risk-free. No credit card required.
              </p>
              <Button 
                onClick={handleStartTrial}
                disabled={startTrialMutation.isPending}
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 mb-4"
                data-testid="button-start-trial"
              >
                {startTrialMutation.isPending ? 'Starting Trial...' : 'Start Free Trial'}
              </Button>
              
              {/* What you get with trial */}
              <div className="bg-white/80 rounded-lg p-3 text-left">
                <h4 className="font-semibold text-sm mb-2 text-gray-800">What you'll unlock:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Complete 90-day founder journey</li>
                  <li>• Advanced progress analytics</li>
                  <li>• Achievement store & gamification</li>
                  <li>• Community features & networking</li>
                  <li>• Export your complete progress</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* One-Time Purchase */}
        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-[#FF6B35] bg-gradient-to-br from-[#FF6B35]/5 to-purple-500/5">
            <div className="absolute top-0 right-0 bg-[#FF6B35] text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              One-Time Payment
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Access</CardTitle>
              <div className="text-5xl font-bold text-[#FF6B35] mb-2">
                {showDiscount ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="line-through text-gray-400 text-3xl">$29.99</span>
                    <span>$19.99</span>
                  </div>
                ) : (
                  '$29.99'
                )}
              </div>
              <p className="text-sm text-green-600 font-medium">
                Full 90-day journey • No recurring fees
                {showDiscount && ' • Limited time discount!'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Complete 90-day transformation journey</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Daily missions with expert guidance</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Progress tracking & achievement system</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Full community access & networking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Lifetime access to your progress</span>
                </li>
              </ul>
              <Button 
                onClick={handlePurchase}
                disabled={createPaymentMutation.isPending || hasAccess}
                className="w-full h-12 text-lg bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                data-testid="button-purchase-full-access"
              >
                {createPaymentMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </>
                ) : hasAccess ? (
                  'Access Granted'
                ) : showDiscount ? (
                  'Get Full Access - $19.99 (Save $10!)'
                ) : (
                  'Get Full Access - $29.99'
                )}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Secure payment powered by Stripe • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included in Your Journey?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Community Access</h3>
              <p className="text-gray-600">Connect with fellow entrepreneurs, share wins, and get support when you need it most.</p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[#FF6B35] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
              <p className="text-gray-600">Track your journey with detailed insights and identify patterns in your success.</p>
            </div>
            <div className="text-center">
              <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Full 90-Day Journey</h3>
              <p className="text-gray-600">Access all 90 carefully crafted missions designed to launch your business.</p>
            </div>
          </div>
        </div>

        {/* Debug section for testing (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Simulate 3 visits over different days
                const mockVisits = [
                  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(), // 2 days ago
                  new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toDateString(), // 1 day ago
                  new Date().toDateString() // today
                ];
                localStorage.setItem('subscriptionVisits', JSON.stringify(mockVisits));
                window.location.reload();
              }}
              className="text-xs"
            >
              🧪 Test Discount (Dev Only)
            </Button>
          </div>
        )}

        {/* Testimonial */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The one-time payment made this so accessible. No worrying about monthly fees - just focus on building my business over 90 days."
          </blockquote>
          <cite className="text-gray-600">— Sarah K., TechFlow Founder</cite>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && clientSecret && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Complete Your Purchase</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPayment(false)}
                data-testid="button-close-payment"
              >
                ×
              </Button>
            </div>
            
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                plan="premium" 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess} 
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
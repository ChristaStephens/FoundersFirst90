import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Crown, Check, Zap, Users, BarChart3, Shield } from 'lucide-react';

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

export default function SubscriptionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false);

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

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (plan: 'monthly' | 'yearly') => {
      const response = await apiRequest('POST', '/api/create-subscription', { plan });
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

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    createSubscriptionMutation.mutate(plan);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setClientSecret('');
    setSelectedPlan(null);
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
                {selectedPlan === 'yearly' ? '$49.99/year' : '$9.99/month'}
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-[#FF6B35] bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've transformed their ideas into successful businesses
          </p>
        </div>

        {/* Current Status */}
        {hasAccess && (
          <Card className="max-w-md mx-auto mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <Badge variant="outline" className="border-green-600 text-green-600">
                  {isTrialing ? 'Free Trial' : 'Premium Active'}
                </Badge>
              </div>
              <p className="text-sm text-green-700">
                {isTrialing && subscription?.trialEndsAt
                  ? `Trial ends ${new Date(subscription.trialEndsAt).toLocaleDateString()}`
                  : 'You have full access to all premium features'
                }
              </p>
            </CardContent>
          </Card>
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
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                data-testid="button-start-trial"
              >
                {startTrialMutation.isPending ? 'Starting Trial...' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="relative overflow-hidden border-2 hover:border-purple-500 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <div className="text-4xl font-bold text-purple-600">
                $9.99
                <span className="text-lg text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-600">Perfect for getting started</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Complete 90-day journey</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Full community access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Progress analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan('monthly')}
                disabled={createSubscriptionMutation.isPending || hasAccess}
                className="w-full"
                variant={hasAccess ? "secondary" : "default"}
                data-testid="button-select-monthly"
              >
                {hasAccess ? 'Current Plan' : 'Choose Monthly'}
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative overflow-hidden border-2 border-[#FF6B35] bg-gradient-to-br from-[#FF6B35]/5 to-purple-500/5">
            <div className="absolute top-0 right-0 bg-[#FF6B35] text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              Best Value
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Annual Plan</CardTitle>
              <div className="text-4xl font-bold text-[#FF6B35]">
                $49.99
                <span className="text-lg text-gray-500">/year</span>
              </div>
              <p className="text-sm text-green-600 font-medium">Save $69.89 per year!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Complete 90-day journey</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Full community access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>VIP support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Exclusive content</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleSelectPlan('yearly')}
                disabled={createSubscriptionMutation.isPending || hasAccess}
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                data-testid="button-select-yearly"
              >
                {hasAccess ? 'Current Plan' : 'Choose Annual'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Premium?</h2>
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

        {/* Testimonial */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The community features alone are worth the subscription. Having other founders to bounce ideas off of made all the difference in my journey."
          </blockquote>
          <cite className="text-gray-600">— Sarah K., TechFlow Founder</cite>
        </div>
      </div>
    </div>
  );
}
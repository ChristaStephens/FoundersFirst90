import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, Users, TestTube } from 'lucide-react';

interface BetaEmailCollectorProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => void;
}

export function BetaEmailCollector({ isOpen, onClose, onEmailSubmit }: BetaEmailCollectorProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      // Store email locally for beta testing
      localStorage.setItem('founderBetaEmail', email);
      await onEmailSubmit(email);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting email:', error);
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Welcome to the Beta!</h2>
            <p className="text-green-600">
              You're now part of our exclusive beta testing community. Let's build something amazing together!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Badge className="bg-orange-100 text-orange-800 border-orange-300 mb-4">
              <TestTube className="w-3 h-3 mr-1" />
              Beta Testing
            </Badge>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Join the Founder's First 90 Beta
            </h2>
            
            <p className="text-gray-600 text-sm mb-4">
              You're about to experience the early version of our gamified entrepreneurship platform. 
              Help us shape the future of startup education!
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Beta Features</span>
              </div>
              <ul className="text-xs text-blue-700 text-left space-y-1">
                <li>• Early access to all gamification features</li>
                <li>• Direct feedback channel to developers</li>
                <li>• Influence feature development</li>
                <li>• Free access during beta period</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  data-testid="beta-email-input"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to send you beta updates and gather feedback.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="beta-email-cancel"
              >
                Skip for Now
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                data-testid="beta-email-submit"
              >
                {isSubmitting ? 'Joining...' : 'Join Beta'}
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By joining, you agree to provide feedback and help us improve the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
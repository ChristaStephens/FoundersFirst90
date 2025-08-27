import { ArrowLeft, Mail, MessageCircle, Book, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SupportProps {
  onBack: () => void;
}

export default function Support({ onBack }: SupportProps) {
  const handleEmailSupport = () => {
    window.open('mailto:help@founderfirst90.com?subject=Support Request', '_blank');
  };

  const handleBugReport = () => {
    window.open('mailto:bugs@founderfirst90.com?subject=Bug Report&body=Please describe the issue you encountered:', '_blank');
  };

  const handleFeatureRequest = () => {
    window.open('mailto:feedback@founderfirst90.com?subject=Feature Request&body=I would like to suggest:', '_blank');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-primary">Support & Help</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Quick Contact */}
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Get Help
            </h2>
            <div className="space-y-3">
              <Button
                onClick={handleEmailSupport}
                className="w-full justify-start hover-wiggle"
                variant="outline"
                data-testid="email-support-button"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <p className="text-sm text-muted-foreground">
                Average response time: 24 hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-1">How do I reset my progress?</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Settings tab and click "Reset All Progress" at the bottom of the page.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Can I export my progress data?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Premium users can export their complete journey data including notes and reflections.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">How does the free trial work?</h3>
                <p className="text-sm text-muted-foreground">
                  You get 7 days of free access to all premium features. No credit card required to start.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">What happens after 90 days?</h3>
                <p className="text-sm text-muted-foreground">
                  You'll have completed the core program! You can continue using the tracking features and revisit any missions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Issues */}
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              Report Issues
            </h2>
            <div className="space-y-3">
              <Button
                onClick={handleBugReport}
                className="w-full justify-start hover-wiggle"
                variant="outline"
                data-testid="bug-report-button"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report a Bug
              </Button>
              <Button
                onClick={handleFeatureRequest}
                className="w-full justify-start hover-wiggle"
                variant="outline"
                data-testid="feature-request-button"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Request a Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <p><strong>General Support:</strong> help@founderfirst90.com</p>
                <p><strong>Bug Reports:</strong> bugs@founderfirst90.com</p>
                <p><strong>Feature Requests:</strong> feedback@founderfirst90.com</p>
                <p><strong>Business Inquiries:</strong> business@founderfirst90.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4">App Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Build:</span>
                <span>2024.08.27</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span>Web App</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
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
            <h1 className="text-lg font-bold text-primary">Terms of Service</h1>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-3">Acceptance of Terms</h2>
          <div className="space-y-2 text-sm">
            <p>By accessing and using Founder's First 90, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Service Description</h2>
          <div className="space-y-2 text-sm">
            <p>Founder's First 90 is a gamified daily habit tracking application designed to guide entrepreneurs through their first 90 days of building a business.</p>
            <p>The service includes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Daily missions and entrepreneurial guidance</li>
              <li>Progress tracking and gamification features</li>
              <li>Community features and achievement systems</li>
              <li>Premium subscription content</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Subscription Terms</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Free Trial:</strong> New users receive 7 days of free access to premium features.</p>
            <p><strong>Premium Subscription:</strong> $29.99 one-time payment for lifetime access to all features.</p>
            <p><strong>Refund Policy:</strong> Refunds are available within 30 days of purchase if you're not satisfied with the service.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">User Responsibilities</h2>
          <div className="space-y-2 text-sm">
            <p>You agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate information when creating your account</li>
              <li>Use the service for lawful purposes only</li>
              <li>Not share your account credentials with others</li>
              <li>Respect other users in community features</li>
              <li>Not attempt to reverse engineer or hack the service</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Intellectual Property</h2>
          <div className="space-y-2 text-sm">
            <p>All content, features, and functionality of Founder's First 90 are owned by TymFlo and are protected by copyright, trademark, and other intellectual property laws.</p>
            <p>You retain ownership of any content you create (notes, reflections, etc.) but grant us a license to store and process this data to provide our services.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Limitation of Liability</h2>
          <div className="space-y-2 text-sm">
            <p>Founder's First 90 is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.</p>
            <p>Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Termination</h2>
          <div className="space-y-2 text-sm">
            <p>You may cancel your account at any time. We may terminate or suspend your account for violations of these terms.</p>
            <p>Upon termination, your right to use the service ceases immediately.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <p>For questions about these Terms of Service:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p><strong>Email:</strong> legal@founderfirst90.com</p>
              <p><strong>Support:</strong> help@founderfirst90.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Changes to Terms</h2>
          <div className="space-y-2 text-sm">
            <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or in-app notification.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
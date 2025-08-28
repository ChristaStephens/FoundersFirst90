import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
            <h1 className="text-lg font-bold text-primary">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
          <div className="space-y-2 text-sm">
            <p>We collect information you provide directly to us:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Progress data and daily mission completions</li>
              <li>Notes and reflections you choose to save</li>
              <li>Subscription and payment information</li>
              <li>Account preferences and settings</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
          <div className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>Provide and improve our services</li>
              <li>Track your progress and achievements</li>
              <li>Process payments and subscriptions</li>
              <li>Send important updates about your account</li>
              <li>Analyze usage to improve the app experience</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Data Storage & Security</h2>
          <div className="space-y-2 text-sm">
            <p>Your data is stored securely using industry-standard encryption. We use PostgreSQL databases with regular backups and security monitoring.</p>
            <p>Your progress data is stored locally in your browser and synchronized with our secure servers when you're online.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Third-Party Services</h2>
          <div className="space-y-2 text-sm">
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
              <li><strong>Replit:</strong> Application hosting and database services</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
          <div className="space-y-2 text-sm">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your progress data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <div className="space-y-2 text-sm">
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p><strong>Email:</strong> hello@tymflo.com</p>
              <p><strong>Website:</strong> www.tymflo.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Changes to This Policy</h2>
          <div className="space-y-2 text-sm">
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
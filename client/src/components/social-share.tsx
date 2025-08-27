import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Share2, Twitter, Facebook, Linkedin, Link, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/hooks/use-audio";

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  streak: number;
  achievement?: string;
}

export function SocialShare({ isOpen, onClose, day, streak, achievement }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { playSuccess } = useAudio();

  const getShareText = () => {
    if (achievement) {
      return `🎉 Just hit ${achievement} on my entrepreneurial journey with Founder's First 90! ${day} days strong with a ${streak}-day streak. Building my startup one day at a time! 🚀 #FoundersFirst90 #Entrepreneurship #StartupLife`;
    }
    
    return `🔥 Day ${day} complete! I'm ${streak} days into my entrepreneurial journey with Founder's First 90. Every day I'm getting closer to launching my startup! 💪 #FoundersFirst90 #Entrepreneurship #StartupLife`;
  };

  const shareUrl = "https://tymflo.com/founders-first-90";
  
  const shareText = getShareText();

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    playSuccess();
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    playSuccess();
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    playSuccess();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      playSuccess();
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Share2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Share Your Success!</span>
          </div>
        </DialogTitle>
        
        <Card className="border-none shadow-none">
          <CardContent className="p-0 space-y-4">
            {/* Achievement display */}
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="font-semibold text-lg">Day {day} Complete!</p>
              <p className="text-sm text-muted-foreground">{streak}-day streak</p>
              {achievement && (
                <p className="text-sm font-medium text-accent mt-1">{achievement}</p>
              )}
            </div>

            {/* Preview text */}
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground mb-2">Share text:</p>
              <p>{shareText}</p>
            </div>

            {/* Social sharing buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200"
                data-testid="share-twitter"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                <span>Twitter</span>
              </Button>

              <Button
                onClick={handleFacebookShare}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200"
                data-testid="share-facebook"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </Button>

              <Button
                onClick={handleLinkedInShare}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200"
                data-testid="share-linkedin"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>LinkedIn</span>
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className={`flex items-center space-x-2 ${
                  copied 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "hover:bg-gray-50 hover:border-gray-200"
                }`}
                data-testid="copy-link"
              >
                {copied ? (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>

            {/* Close button */}
            <Button onClick={onClose} variant="secondary" className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
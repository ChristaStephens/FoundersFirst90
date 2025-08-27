import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Users, HelpCircle, TrendingUp, Heart } from "lucide-react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [type, setType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [day, setDay] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (postData: any) => 
      apiRequest("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }),
    onSuccess: () => {
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !title || !content) return;

    createPostMutation.mutate({
      type,
      title,
      content,
      day: day ? parseInt(day) : null,
      isAnonymous,
    });
  };

  const handleClose = () => {
    setType("");
    setTitle("");
    setContent("");
    setDay("");
    setIsAnonymous(false);
    onOpenChange(false);
  };

  const getPostTypeIcon = (postType: string) => {
    switch (postType) {
      case "milestone": return <Sparkles className="w-4 h-4" />;
      case "win": return <TrendingUp className="w-4 h-4" />;
      case "struggle": return <Heart className="w-4 h-4" />;
      case "question": return <HelpCircle className="w-4 h-4" />;
      case "motivation": return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share with the Community</DialogTitle>
          <DialogDescription>
            Connect with fellow entrepreneurs by sharing your journey, challenges, and victories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <div className="space-y-3">
            <Label>What kind of update is this?</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger data-testid="select-post-type">
                <SelectValue placeholder="Choose your post type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milestone">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Milestone - Celebrate an achievement</span>
                  </div>
                </SelectItem>
                <SelectItem value="win">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Win - Share a success story</span>
                  </div>
                </SelectItem>
                <SelectItem value="struggle">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Struggle - Ask for support</span>
                  </div>
                </SelectItem>
                <SelectItem value="question">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span>Question - Need advice</span>
                  </div>
                </SelectItem>
                <SelectItem value="motivation">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Motivation - Inspire others</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day Number (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="day">Day (Optional)</Label>
            <Input
              id="day"
              type="number"
              min="1"
              max="90"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Which day of your journey is this?"
              data-testid="input-day"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title..."
              required
              data-testid="input-title"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience, challenges, insights, or questions with the community..."
              rows={6}
              required
              data-testid="textarea-content"
            />
            <p className="text-xs text-muted-foreground">
              Be authentic and specific. The community thrives on real experiences and genuine connections.
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              data-testid="checkbox-anonymous"
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously (your identity will be hidden)
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!type || !title || !content || createPostMutation.isPending}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-create-post"
            >
              {createPostMutation.isPending ? "Sharing..." : "Share with Community"}
              {type && getPostTypeIcon(type)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
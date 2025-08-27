import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommunityPost } from "@shared/schema";

interface PostCardProps {
  post: CommunityPost & { user: { username: string } };
  onLike: () => void;
  getPostTypeColor: (type: string) => string;
}

export function PostCard({ post, onLike, getPostTypeColor }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200" data-testid={`post-card-${post.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-semibold text-primary text-sm">
                {post.isAnonymous ? "?" : post.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">
                {post.isAnonymous ? "Anonymous Founder" : post.user.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPostTypeColor(post.type)}>
              {post.type}
            </Badge>
            {post.day && (
              <Badge variant="outline">
                Day {post.day}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-semibold mb-2" data-testid={`post-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4 whitespace-pre-wrap" data-testid={`post-content-${post.id}`}>
          {post.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
              data-testid={`button-like-${post.id}`}
            >
              <Heart className="w-4 h-4" />
              {post.likesCount || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
              data-testid={`button-comment-${post.id}`}
            >
              <MessageCircle className="w-4 h-4" />
              {post.commentsCount || 0}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            data-testid={`button-more-${post.id}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
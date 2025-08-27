import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Users, Trophy, Plus, Share2, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { CommunityPost, CommunityStats } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { PostCard } from "@/components/community/post-card";
import { CreatePostDialog } from "@/components/community/create-post-dialog";
import { Leaderboard } from "@/components/community/leaderboard";
import { AccountabilityPartners } from "@/components/community/accountability-partners";

interface CommunityPostWithUser extends CommunityPost {
  user: { username: string };
}

export default function Community() {
  const [selectedTab, setSelectedTab] = useState("feed");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/community/leaderboard"],
  });

  const { data: partnersData } = useQuery({
    queryKey: ["/api/community/partners"],
  });

  const posts = postsData?.posts || [];
  const leaderboard = leaderboardData?.leaderboard || [];
  const partners = partnersData?.partners || [];

  const likeMutation = useMutation({
    mutationFn: (postId: string) => 
      apiRequest(`/api/community/posts/${postId}/like`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "milestone": return "bg-amber-100 text-amber-800";
      case "struggle": return "bg-red-100 text-red-800";
      case "win": return "bg-green-100 text-green-800";
      case "question": return "bg-blue-100 text-blue-800";
      case "motivation": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="flex items-center gap-2"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Journey
            </Button>
            <div></div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Founder Community
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow entrepreneurs on their 90-day journey
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts Shared</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {posts.reduce((sum, post) => sum + (post.likesCount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{leaderboard.length}</div>
              <div className="text-sm text-muted-foreground">Active Founders</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="partners">Accountability</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          {/* Community Feed */}
          <TabsContent value="feed" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Community Feed</h2>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-create-post"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Update
              </Button>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="text-center p-8">
                <Share2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Be the First to Share!</h3>
                <p className="text-muted-foreground mb-4">
                  Start the conversation by sharing your progress, struggles, or wins.
                </p>
                <Button onClick={() => setShowCreatePost(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post: CommunityPostWithUser) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => handleLike(post.id)}
                    getPostTypeColor={getPostTypeColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard leaderboard={leaderboard} />
          </TabsContent>

          {/* Accountability Partners */}
          <TabsContent value="partners" className="mt-6">
            <AccountabilityPartners partners={partners} />
          </TabsContent>

          {/* Milestones */}
          <TabsContent value="milestones" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Community Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts
                    .filter((post: CommunityPostWithUser) => post.type === "milestone")
                    .slice(0, 5)
                    .map((post: CommunityPostWithUser) => (
                      <div key={post.id} className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                        <Badge className="bg-amber-500 text-white">
                          Day {post.day}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {post.isAnonymous ? "Anonymous" : post.user.username}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          {post.likesCount}
                        </div>
                      </div>
                    ))}
                  {posts.filter((post: CommunityPostWithUser) => post.type === "milestone").length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No milestone celebrations yet. Be the first to share your achievement!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Post Dialog */}
        <CreatePostDialog
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
        />
      </div>
    </div>
  );
}
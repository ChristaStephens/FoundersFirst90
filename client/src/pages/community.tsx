import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Share2, Users, Trophy, MessageCircle, Heart, TrendingUp, Star, ArrowLeft } from 'lucide-react';

interface CommunityProfile {
  name: string;
  level: number;
  streak: number;
  completedDays: number;
  achievements: string[];
  bio: string;
}

interface CommunityReply {
  id: string;
  author: string;
  authorLevel: number;
  content: string;
  timestamp: string;
}

interface CommunityPost {
  id: string;
  author: string;
  authorLevel: number;
  content: string;
  timestamp: string;
  likes: number;
  category: 'milestone' | 'tip' | 'motivation' | 'question';
  isLiked?: boolean;
  replies?: CommunityReply[];
}

export default function Community() {
  const { toast } = useToast();
  const [userProgress] = useLocalStorage('userProgress', {});
  const [profile, setProfile] = useLocalStorage<CommunityProfile>('communityProfile', {
    name: 'Founder',
    level: userProgress.entrepreneurLevel || 1,
    streak: userProgress.currentStreak || 0,
    completedDays: userProgress.completedDays || 0,
    achievements: [],
    bio: 'Building my startup one day at a time!'
  });

  const [posts, setPosts] = useLocalStorage<CommunityPost[]>('communityPosts', [
    {
      id: '1',
      author: 'Sarah Chen',
      authorLevel: 15,
      content: 'Just hit day 30! The consistency is really paying off. My business plan is crystal clear now and I\'ve validated my first customer segment. Keep going everyone! 🚀',
      timestamp: '2 hours ago',
      likes: 12,
      category: 'milestone'
    },
    {
      id: '2',
      author: 'Alex Rodriguez',
      authorLevel: 8,
      content: 'Pro tip: I started doing my daily missions first thing in the morning. Game changer! No excuses, no procrastination. What time works best for you?',
      timestamp: '5 hours ago',
      likes: 8,
      category: 'tip'
    },
    {
      id: '3',
      author: 'Maya Patel',
      authorLevel: 22,
      content: 'Struggling with day 45 networking challenge. Any introverts here who found creative ways to connect with potential customers? Would love some advice!',
      timestamp: '1 day ago',
      likes: 15,
      category: 'question'
    },
    {
      id: '4',
      author: 'David Kim',
      authorLevel: 12,
      content: 'Remember: every successful entrepreneur started exactly where you are today. Your current struggle is tomorrow\'s strength. You\'ve got this! 💪',
      timestamp: '2 days ago',
      likes: 24,
      category: 'motivation'
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleShareProgress = () => {
    const shareText = `I'm on day ${profile.completedDays} of my 90-day founder journey! Level ${profile.level} with a ${profile.streak}-day streak. Building my startup empire one mission at a time! 🚀 #FoundersFirst90`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Founder\'s Journey Progress',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied to clipboard!',
        description: 'Share your progress on social media',
      });
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: profile.name,
      authorLevel: profile.level,
      content: newPost,
      timestamp: 'just now',
      likes: 0,
      category: 'tip'
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    setNewPost('');
    
    toast({
      title: 'Posted!',
      description: 'Your message has been shared with the community',
    });
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now().toString(),
      author: profile.name,
      authorLevel: profile.level,
      content: replyText,
      timestamp: 'just now'
    };
    
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, replies: [...(post.replies || []), newReply] }
          : post
      )
    );
    
    toast({
      title: 'Reply Posted!',
      description: 'Your reply has been shared with the community',
    });
    
    setReplyText('');
    setReplyingTo(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return '🎯';
      case 'tip': return '💡';
      case 'motivation': return '💪';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-green-100 text-green-800';
      case 'tip': return 'bg-blue-100 text-blue-800';
      case 'motivation': return 'bg-purple-100 text-purple-800';
      case 'question': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            data-testid="community-back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Founder Community</h1>
            <p className="text-gray-600">Connect with fellow entrepreneurs on their 90-day journey</p>
          </div>
        </div>

        {/* Your Profile Card */}
        <Card className="border-2 border-[#FF6B35]/20 bg-gradient-to-r from-[#FF6B35]/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.bio}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#FF6B35]">Level {profile.level}</div>
                <div className="text-sm text-gray-600">{profile.streak} day streak</div>
              </div>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>{profile.completedDays}/90 days</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>{profile.achievements.length} achievements</span>
              </div>
            </div>

            <Button 
              onClick={handleShareProgress}
              className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90"
              data-testid="share-progress"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share My Progress
            </Button>
          </CardContent>
        </Card>

        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share with the Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share a tip, ask a question, or celebrate a milestone..."
              className="w-full p-3 border rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
              data-testid="new-post-input"
            />
            <Button 
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
              className="w-full"
              data-testid="create-post"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Share with Community
            </Button>
          </CardContent>
        </Card>

        {/* Community Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Community Feed</h2>
          
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author}</span>
                        <Badge variant="outline" className="text-xs">
                          Level {post.authorLevel}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                    </div>
                  </div>
                  
                  <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                    {getCategoryIcon(post.category)} {post.category}
                  </Badge>
                </div>

                <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between pt-2 border-t">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                      post.isLiked 
                        ? 'bg-red-100 text-red-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    data-testid={`like-post-${post.id}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>
                  
                  <button 
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 text-gray-600 transition-colors"
                    data-testid={`reply-${post.id}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                </div>
                
                {/* Replies Display */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#FF6B35] to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {reply.author.charAt(0)}
                          </div>
                          <span className="font-medium text-sm">{reply.author}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {reply.authorLevel}
                          </Badge>
                          <span className="text-xs text-gray-500 ml-auto">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === post.id && (
                  <div className="mt-3 pt-3 border-t bg-gray-50 p-3 rounded-b-lg">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Replying to ${post.author}...`}
                      className="w-full p-2 border rounded text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                      data-testid={`reply-input-${post.id}`}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm"
                        onClick={() => handleReply(post.id)}
                        disabled={!replyText.trim()}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90"
                        data-testid={`send-reply-${post.id}`}
                      >
                        Send Reply
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Engagement Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Community Guidelines
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Share genuine experiences and helpful tips</li>
              <li>• Support fellow founders with encouragement</li>
              <li>• Ask questions - we're all learning together</li>
              <li>• Celebrate milestones and progress</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Medal, Star } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  streak: number;
  totalDays: number;
  rank: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Community Leaderboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Celebrating consistency and dedication in the entrepreneurial journey
          </p>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rankings yet</h3>
              <p className="text-muted-foreground">
                Start your journey and be the first on the leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.username}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  data-testid={`leaderboard-entry-${entry.rank}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getRankBadgeColor(entry.rank)}>
                      #{entry.rank}
                    </Badge>
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold" data-testid={`username-${entry.rank}`}>
                      {entry.username}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {entry.totalDays} days completed
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-primary" data-testid={`streak-${entry.rank}`}>
                        {entry.streak}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        <div>day</div>
                        <div>streak</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Streak Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="font-bold text-amber-700">7 Days</div>
              <div className="text-xs text-amber-600">Committed</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="font-bold text-orange-700">21 Days</div>
              <div className="text-xs text-orange-600">Habit Formed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Medal className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-green-700">60 Days</div>
              <div className="text-xs text-green-600">Dedicated</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="font-bold text-purple-700">90 Days</div>
              <div className="text-xs text-purple-600">Founder</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Users, UserPlus, CheckCircle, Clock, XCircle, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Partner {
  id: string;
  userId: string;
  partnerId: string;
  status: "pending" | "active" | "completed" | "cancelled";
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  partner: {
    username: string;
  };
}

interface AccountabilityPartnersProps {
  partners: Partner[];
}

export function AccountabilityPartners({ partners }: AccountabilityPartnersProps) {
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddPartner = () => {
    if (partnerUsername.trim()) {
      // Handle adding partner logic here
      console.log("Adding partner:", partnerUsername);
      setPartnerUsername("");
      setShowAddPartner(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Accountability Partners
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Partner with fellow founders for mutual support and accountability
              </p>
            </div>
            <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-partner">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Accountability Partner</DialogTitle>
                  <DialogDescription>
                    Enter the username of another founder you'd like to partner with for mutual accountability.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Enter username"
                    value={partnerUsername}
                    onChange={(e) => setPartnerUsername(e.target.value)}
                    data-testid="input-partner-username"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddPartner(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPartner} disabled={!partnerUsername.trim()}>
                      Send Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-primary">How Accountability Partnerships Work</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <UserPlus className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">1. Connect</h4>
              <p className="text-sm text-muted-foreground">Find and invite fellow founders to be your accountability partner</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">2. Check-in</h4>
              <p className="text-sm text-muted-foreground">Regular check-ins to share progress, challenges, and support each other</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">3. Succeed</h4>
              <p className="text-sm text-muted-foreground">Higher success rates through mutual accountability and encouragement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Your Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No partnerships yet</h3>
              <p className="text-muted-foreground mb-4">
                Accountability partners increase your chances of success by 65%!
              </p>
              <Button onClick={() => setShowAddPartner(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Find Your First Partner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`partner-${partner.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {partner.partner.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold" data-testid={`partner-username-${partner.id}`}>
                        {partner.partner.username}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Partnered {formatDistanceToNow(new Date(partner.startedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(partner.status)} data-testid={`partner-status-${partner.id}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(partner.status)}
                        {partner.status}
                      </div>
                    </Badge>
                    
                    {partner.status === "active" && (
                      <Button size="sm" variant="outline" data-testid={`button-message-${partner.id}`}>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Partner Up?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-700">✓ 65% Higher Success Rate</h4>
              <p className="text-sm text-muted-foreground">
                Studies show accountability partners dramatically improve goal completion rates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">✓ Consistent Motivation</h4>
              <p className="text-sm text-muted-foreground">
                Regular check-ins keep you motivated even on difficult days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">✓ Shared Learning</h4>
              <p className="text-sm text-muted-foreground">
                Learn from each other's experiences, mistakes, and victories.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-700">✓ Emotional Support</h4>
              <p className="text-sm text-muted-foreground">
                Having someone who understands your entrepreneurial journey makes all the difference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
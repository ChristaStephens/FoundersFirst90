import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, BookOpen, Target, Lightbulb, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DailyNotesProps {
  day: number;
  notes: string;
  reflections: string;
  onNotesChange: (notes: string) => void;
  onReflectionsChange: (reflections: string) => void;
  onSave: () => void;
  isCompleted: boolean;
  isSaving?: boolean;
}

export function DailyNotes({ 
  day, 
  notes, 
  reflections, 
  onNotesChange, 
  onReflectionsChange, 
  onSave,
  isCompleted,
  isSaving = false
}: DailyNotesProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'reflections'>('notes');
  const [justSaved, setJustSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave();
      setJustSaved(true);
      toast({
        title: "Saved!",
        description: `Your ${activeTab === 'notes' ? 'notes' : 'reflections'} have been saved successfully.`,
        duration: 3000,
      });
      
      // Reset the success indicator after 3 seconds
      setTimeout(() => setJustSaved(false), 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your notes. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="shadow-sm border border-border" data-testid="daily-notes-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Day {day} Notes
          </CardTitle>
          {isCompleted && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Completed
            </Badge>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notes' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid="notes-tab"
          >
            <Target className="h-4 w-4 inline mr-1" />
            Planning Notes
          </button>
          <button
            onClick={() => setActiveTab('reflections')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reflections' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid="reflections-tab"
          >
            <Lightbulb className="h-4 w-4 inline mr-1" />
            Reflections
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Today's Action Plan & Ideas
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Jot down your thoughts, action steps, and key insights as you work through today's mission.
              </p>
              <Textarea
                placeholder="What are your key takeaways? What specific actions will you take today? Any challenges or ideas that came up?"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="min-h-[120px] resize-none"
                data-testid="notes-textarea"
              />
            </div>
          </div>
        )}

        {activeTab === 'reflections' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                End-of-Day Reflections
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                How did today go? What did you accomplish? What will you do differently tomorrow?
              </p>
              <Textarea
                placeholder="What progress did you make today? What challenges did you face? What are you grateful for? How can you improve tomorrow?"
                value={reflections}
                onChange={(e) => onReflectionsChange(e.target.value)}
                className="min-h-[120px] resize-none"
                data-testid="reflections-textarea"
              />
            </div>
          </div>
        )}

        <Separator className="my-4" />
        
        <Button 
          onClick={handleSave}
          className="w-full"
          variant={notes || reflections ? "default" : "outline"}
          disabled={isSaving}
          data-testid="save-notes-button"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : justSaved ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-green-600">Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save {activeTab === 'notes' ? 'Notes' : 'Reflections'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface PreviousDayReviewProps {
  previousDay: {
    day: number;
    notes?: string;
    reflections?: string;
    completed: boolean;
    completedAt?: Date;
  } | null;
}

export function PreviousDayReview({ previousDay }: PreviousDayReviewProps) {
  if (!previousDay || previousDay.day < 1) return null;

  return (
    <Card className="shadow-sm border border-primary/20 bg-primary/5" data-testid="previous-day-review">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Yesterday's Review (Day {previousDay.day})
          {previousDay.completed && (
            <Badge variant="secondary" className="bg-success/10 text-success">
              ✓ Completed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {previousDay.notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <Target className="h-4 w-4" />
              Notes:
            </h4>
            <div className="bg-background p-3 rounded-lg text-sm text-foreground border">
              {previousDay.notes}
            </div>
          </div>
        )}

        {previousDay.reflections && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Reflections:
            </h4>
            <div className="bg-background p-3 rounded-lg text-sm text-foreground border">
              {previousDay.reflections}
            </div>
          </div>
        )}

        {!previousDay.notes && !previousDay.reflections && (
          <p className="text-sm text-muted-foreground italic">
            No notes or reflections recorded for this day.
          </p>
        )}

        {previousDay.completedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Completed on {new Date(previousDay.completedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
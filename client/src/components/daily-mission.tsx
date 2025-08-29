import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Mission } from "@/types/mission";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/hooks/use-audio";

interface ActionPrompt {
  action: string;
  prompt: string;
  type: 'text' | 'number' | 'url' | 'checklist';
  placeholder?: string;
  options?: string[];
}

interface DailyMissionProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: () => void;
  currentDay: number;
}

export function DailyMission({ mission, isCompleted, onComplete, currentDay }: DailyMissionProps) {
  const [stepResponses, setStepResponses] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { playSave, playComplete } = useAudio();

  // Fetch existing step responses for this day
  const { data: dayData } = useQuery({
    queryKey: ['/api/day', currentDay],
    enabled: !!currentDay
  });

  // Initialize step responses from existing data
  useEffect(() => {
    if (dayData && 'completion' in dayData && dayData.completion?.stepResponses) {
      setStepResponses(dayData.completion.stepResponses);
    }
  }, [dayData]);

  // Save step responses
  const saveResponsesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/save-step-responses', {
        day: currentDay,
        stepResponses
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/day', currentDay] });
      setHasChanges(false);
      setJustSaved(true);
      playSave(); // Play save sound
      toast({
        title: "Responses Saved!",
        description: "Your progress has been saved successfully.",
        duration: 3000,
      });
      // Clear the "just saved" state after animation
      setTimeout(() => setJustSaved(false), 3000);
    }
  });

  const handleStepResponse = (stepIndex: number, response: string) => {
    const stepKey = `step${stepIndex + 1}`;
    setStepResponses(prev => ({
      ...prev,
      [stepKey]: response
    }));
    setHasChanges(true);
  };

  const saveResponses = () => {
    saveResponsesMutation.mutate();
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'template': return '📋';
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'tool': return '🔧';
      default: return '📎';
    }
  };

  const getActionPrompts = (mission: Mission, day: number): ActionPrompt[] => {
    // Create specific, measurable prompts based on the mission content
    switch (day) {
      case 1: // Value Proposition
        return [
          {
            action: "Write your one-sentence pitch",
            prompt: "Complete this sentence in 20 words or less:",
            type: 'text',
            placeholder: "I help [target customer] achieve [desired outcome] by [unique solution]"
          },
          {
            action: "Test your pitch clarity",
            prompt: "Who did you test this pitch with? Record their name and feedback:",
            type: 'text',
            placeholder: "Name: [person], Feedback: [did they understand it immediately?]"
          },
          {
            action: "Refine based on feedback",
            prompt: "Write your final, improved one-sentence pitch:",
            type: 'text',
            placeholder: "Your perfected elevator pitch goes here..."
          }
        ];
      case 2: // First 10 Customers
        return [
          {
            action: "List 10 potential customers by name",
            prompt: "Write the actual names and contact info of people who might pay for your solution:",
            type: 'text',
            placeholder: "1. John Smith (john@company.com, 555-1234) - needs [specific problem]\n2. Sarah Johnson (sarah@email.com) - struggles with [issue]\n3. ..."
          },
          {
            action: "Rank by likelihood to buy",
            prompt: "Number your list 1-10 with #1 being most likely to actually pay:",
            type: 'text',
            placeholder: "Most likely: [Name] because [reason]\n2nd: [Name] because [reason]..."
          },
          {
            action: "Choose your first interview target",
            prompt: "Who will you contact first for a customer interview?",
            type: 'text',
            placeholder: "Name and why you chose them as your first interview..."
          }
        ];
      case 3: // Landing Page
        return [
          {
            action: "Share your live landing page URL",
            prompt: "Paste the actual URL where people can see your idea:",
            type: 'url',
            placeholder: "https://yourlandingpage.com"
          },
          {
            action: "Track initial metrics",
            prompt: "How many people have visited and signed up so far?",
            type: 'text',
            placeholder: "Visitors: [number], Signups: [number], Source: [how they found it]"
          },
          {
            action: "List your call-to-action",
            prompt: "What specific action do you want visitors to take?",
            type: 'text',
            placeholder: "e.g., 'Sign up for early access', 'Join the waitlist', 'Book a demo'"
          }
        ];
      case 4: // Customer Interview
        return [
          {
            action: "Record who you interviewed",
            prompt: "Who did you talk to and when?",
            type: 'text',
            placeholder: "Name: [person], Date/time: [when], Duration: [how long]"
          },
          {
            action: "Document their exact pain points",
            prompt: "What specific problems do they face? Use their exact words:",
            type: 'text',
            placeholder: "Quote their exact words about their biggest challenges..."
          },
          {
            action: "Note unexpected insights",
            prompt: "What did you learn that surprised you?",
            type: 'text',
            placeholder: "Something you didn't expect to hear..."
          },
          {
            action: "Plan your next interview",
            prompt: "Who will you interview next and when?",
            type: 'text',
            placeholder: "Next person and scheduled time..."
          }
        ];
      case 5: // MVP Definition
        return [
          {
            action: "List your 3 core features",
            prompt: "What are the 3 most essential features for version 1?",
            type: 'text',
            placeholder: "1. [Feature] - [why essential]\n2. [Feature] - [why essential]\n3. [Feature] - [why essential]"
          },
          {
            action: "Estimate development time",
            prompt: "How long will each feature take to build?",
            type: 'text',
            placeholder: "Feature 1: [X weeks], Feature 2: [X weeks], Feature 3: [X weeks]"
          },
          {
            action: "Define your success metric",
            prompt: "How will you know if your MVP is working?",
            type: 'text',
            placeholder: "Success = [specific number] of [specific action] within [timeframe]"
          }
        ];
      default:
        // Fallback for other days - convert generic steps to specific prompts
        return mission.steps.map((step, index) => ({
          action: `Complete step ${index + 1}`,
          prompt: step,
          type: 'text' as const,
          placeholder: "Describe what you accomplished and what specific results you got..."
        }));
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-border" data-testid="daily-mission">
      {/* Mission Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold" data-testid="mission-title">{mission.title}</h2>
          <div className="flex items-center space-x-1">
            <span className="text-lg opacity-90">Day</span>
            <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {mission.day}
            </div>
          </div>
        </div>
        <p className="text-sm opacity-90 font-light" data-testid="mission-description">
          {mission.description}
        </p>
      </div>

      <CardContent className="p-4">
        {/* Today's Mission */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">Today's Mission:</h3>
          <p className="text-sm text-foreground mb-4 leading-relaxed" data-testid="mission-task">
            {mission.task}
          </p>
        </div>

        {/* Action-Based Tracking */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">Track Your Progress:</h3>
          <div className="space-y-4">
            {getActionPrompts(mission, currentDay).map((actionPrompt, index) => {
              const stepKey = `step${index + 1}`;
              return (
                <div key={index} className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200" data-testid={`action-${index + 1}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-800 mb-1">{actionPrompt.action}</p>
                      <p className="text-xs text-purple-600">{actionPrompt.prompt}</p>
                    </div>
                  </div>
                  <div className="ml-9">
                    {actionPrompt.type === 'url' ? (
                      <input
                        type="url"
                        placeholder={actionPrompt.placeholder}
                        value={stepResponses[stepKey] || ''}
                        onChange={(e) => handleStepResponse(index, e.target.value)}
                        className="w-full p-3 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        data-testid={`input-step-${index + 1}`}
                      />
                    ) : (
                      <Textarea
                        placeholder={actionPrompt.placeholder}
                        value={stepResponses[stepKey] || ''}
                        onChange={(e) => handleStepResponse(index, e.target.value)}
                        className="min-h-[100px] resize-none text-sm border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        data-testid={`input-step-${index + 1}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Save Responses Button */}
          {(hasChanges || justSaved) && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={saveResponses}
                disabled={saveResponsesMutation.isPending}
                variant={justSaved ? "default" : "outline"}
                size="sm"
                data-testid="button-save-responses"
                className={`transition-all duration-300 ${
                  justSaved 
                    ? "bg-green-600 hover:bg-green-700 text-white animate-save-success scale-105 shadow-lg" 
                    : "hover:scale-105"
                }`}
              >
                {saveResponsesMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : justSaved ? (
                  <div className="flex items-center animate-celebration">
                    <CheckCircle2 className="w-4 h-4 mr-1 animate-bounce" />
                    Saved!
                  </div>
                ) : (
                  'Save Responses'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">Resources:</h3>
          <div className="space-y-2">
            {mission.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-secondary/20 transition-colors"
                data-testid={`resource-${index + 1}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getResourceIcon(resource.type)}</span>
                  <span className="text-sm font-medium text-foreground">{resource.title}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Success Criteria */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">Success Criteria:</h3>
          <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3" data-testid="success-criteria">
            {mission.successCriteria}
          </p>
        </div>

        {/* Completion Button */}
        {!isCompleted ? (
          <Button
            onClick={() => {
              playComplete(); // Play completion sound
              onComplete();
            }}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-base hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg"
            data-testid="complete-mission-btn"
          >
            <span className="mr-2">🎯</span>
            Mark Mission Complete
          </Button>
        ) : (
          <div className="w-full bg-success text-success-foreground py-4 rounded-lg font-semibold text-base flex items-center justify-center space-x-2" data-testid="completed-state">
            <span>✅</span>
            <span>Mission Completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

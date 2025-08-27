import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";
import { Mission } from "@/types/mission";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DailyMissionProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: () => void;
  currentDay: number;
}

export function DailyMission({ mission, isCompleted, onComplete, currentDay }: DailyMissionProps) {
  const [stepResponses, setStepResponses] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing step responses for this day
  const { data: dayData } = useQuery({
    queryKey: ['/api/day', currentDay],
    enabled: !!currentDay
  });

  // Initialize step responses from existing data
  useEffect(() => {
    if (dayData?.completion?.stepResponses) {
      setStepResponses(dayData.completion.stepResponses);
    }
  }, [dayData]);

  // Save step responses
  const saveResponsesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/save-step-responses`, {
        method: 'POST',
        body: JSON.stringify({
          day: currentDay,
          stepResponses
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/day', currentDay] });
      setHasChanges(false);
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

  return (
    <Card className="overflow-hidden shadow-sm border border-border">
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

        {/* Steps */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-3">How to do it:</h3>
          <div className="space-y-4">
            {mission.steps.map((step, index) => {
              const stepKey = `step${index + 1}`;
              return (
                <div key={index} className="space-y-2" data-testid={`step-${index + 1}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground flex-1">{step}</p>
                  </div>
                  <div className="ml-9">
                    <Textarea
                      placeholder="Enter your response here..."
                      value={stepResponses[stepKey] || ''}
                      onChange={(e) => handleStepResponse(index, e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
                      data-testid={`input-step-${index + 1}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Save Responses Button */}
          {hasChanges && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={saveResponses}
                disabled={saveResponsesMutation.isPending}
                variant="outline"
                size="sm"
                data-testid="button-save-responses"
              >
                {saveResponsesMutation.isPending ? 'Saving...' : 'Save Responses'}
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
            onClick={onComplete}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors"
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

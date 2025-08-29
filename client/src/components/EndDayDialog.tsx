import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Moon, Sun, Coffee } from 'lucide-react';

interface EndDayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
}

export function EndDayDialog({ isOpen, onClose, currentDay }: EndDayDialogProps) {
  const [customTime, setCustomTime] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const endDayMutation = useMutation({
    mutationFn: async (unlockTime?: string) => {
      const payload = unlockTime ? { customUnlockTime: unlockTime } : {};
      return apiRequest('POST', '/api/end-day', payload);
    },
    onSuccess: (data: any) => {
      const nextUnlockTime = new Date(data.nextUnlockTime).toLocaleString();
      toast({
        title: "Day Ended Successfully! 🌙",
        description: `Your next day unlocks at ${nextUnlockTime}. Rest well!`,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/can-advance'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to end day",
        variant: "destructive",
      });
    },
  });

  const presetTimes = [
    { 
      id: 'morning', 
      label: 'Tomorrow Morning (8 AM)', 
      icon: Sun,
      getTime: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        return tomorrow.toISOString();
      }
    },
    { 
      id: 'afternoon', 
      label: 'Tomorrow Afternoon (2 PM)', 
      icon: Coffee,
      getTime: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);
        return tomorrow.toISOString();
      }
    },
    { 
      id: 'evening', 
      label: 'Tomorrow Evening (6 PM)', 
      icon: Moon,
      getTime: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);
        return tomorrow.toISOString();
      }
    },
    { 
      id: 'default', 
      label: 'Default (18 hours)', 
      icon: Clock,
      getTime: () => ''
    }
  ];

  const handleEndDay = () => {
    let unlockTime = '';
    
    if (selectedPreset && selectedPreset !== 'default') {
      const preset = presetTimes.find(p => p.id === selectedPreset);
      unlockTime = preset?.getTime() || '';
    } else if (customTime) {
      unlockTime = new Date(customTime).toISOString();
    }
    
    endDayMutation.mutate(unlockTime || undefined);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setCustomTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-600" />
            End Day {currentDay}
          </DialogTitle>
          <DialogDescription>
            Choose when you'd like your next day to unlock. This helps build consistent daily habits!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Options</Label>
            <div className="grid grid-cols-1 gap-2">
              {presetTimes.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedPreset === preset.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    data-testid={`preset-${preset.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{preset.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-time" className="text-sm font-medium">
              Or Choose Custom Time
            </Label>
            <Input
              id="custom-time"
              type="datetime-local"
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value);
                setSelectedPreset('');
              }}
              min={new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16)}
              data-testid="custom-time-input"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 hours from now for proper rest
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            data-testid="cancel-end-day"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEndDay}
            disabled={endDayMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="confirm-end-day"
          >
            {endDayMutation.isPending ? 'Ending Day...' : 'End Day'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
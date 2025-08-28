import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Smile, Frown, Meh, Heart, Zap, Coffee, Target, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface MoodEntry {
  date: string;
  mood: string;
  timestamp: number;
}

export function MoodTracker() {
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('founder-mood-entries', []);
  const [lastShown, setLastShown] = useLocalStorage('mood-tracker-last-shown', 0);
  
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    // Show mood tracker once per day on app open
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - lastShown > oneDayMs) {
      const timer = setTimeout(() => {
        setShowMoodDialog(true);
        setLastShown(now);
      }, 1500); // Show after 1.5 seconds to let app load

      return () => clearTimeout(timer);
    }
  }, [lastShown, setLastShown]);

  const moodOptions = [
    { value: 'excited', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Excited & Energized' },
    { value: 'confident', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100', label: 'Confident & Ready' },
    { value: 'focused', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Focused & Determined' },
    { value: 'creative', icon: Lightbulb, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Creative & Inspired' },
    { value: 'neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Neutral & Steady' },
    { value: 'tired', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Tired but Pushing' },
    { value: 'overwhelmed', icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Overwhelmed & Stressed' },
    { value: 'optimistic', icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Optimistic & Hopeful' }
  ];

  const handleSubmitMood = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      timestamp: Date.now()
    };

    setMoodEntries((prev: MoodEntry[]) => [newEntry, ...prev.slice(0, 29)]); // Keep last 30 entries
    setShowMoodDialog(false);
    
    // Reset selection
    setSelectedMood('');
  };

  return (
    <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            How are you feeling today, founder? 💭
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            Track your entrepreneurial journey mood to build better habits
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Mood Selection */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">How are you feeling as a founder today?</h3>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={selectedMood === option.value ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center text-xs ${
                      selectedMood === option.value 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white' 
                        : `${option.bg} ${option.color} border-2 hover:scale-105 transition-transform`
                    }`}
                    onClick={() => setSelectedMood(option.value)}
                    data-testid={`mood-${option.value}`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-center leading-tight">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Button 
            onClick={handleSubmitMood}
            disabled={!selectedMood}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
            data-testid="submit-mood"
          >
            Track My Founder Mood 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
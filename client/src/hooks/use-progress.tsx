import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserProgress {
  id: string;
  userId: string;
  currentDay: number;
  startDate: Date;
  streak: number;
  bestStreak: number;
  buildingLevel: number;
  totalCompletedDays: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyCompletion {
  id: string;
  userId: string;
  day: number;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  reflections?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgressData {
  progress: UserProgress;
  completions: DailyCompletion[];
  achievements: any[];
}

export function useProgress() {
  const queryClient = useQueryClient();

  // Initialize user data on first load
  const initQuery = useQuery({
    queryKey: ['/api/init'],
  });

  // Get progress data
  const progressQuery = useQuery({
    queryKey: ['/api/progress'],
    enabled: initQuery.isSuccess,
  });

  // Complete day mutation
  const completeDayMutation = useMutation({
    mutationFn: async (data: { day: number; notes?: string; reflections?: string }) => {
      const response = await apiRequest('POST', '/api/complete-day', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });

  // Save notes mutation
  const saveNotesMutation = useMutation({
    mutationFn: async (data: { day: number; notes?: string; reflections?: string }) => {
      const response = await apiRequest('POST', '/api/save-notes', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });

  // Get specific day data
  const getDayCompletion = (day: number) => {
    return useQuery({
      queryKey: ['/api/day', day],
      enabled: !!progressQuery.data,
    });
  };

  const data = progressQuery.data as ProgressData | undefined;

  return {
    // Data
    progress: data?.progress,
    completions: data?.completions || [],
    achievements: data?.achievements || [],
    
    // Status
    isLoading: initQuery.isLoading || progressQuery.isLoading,
    isError: initQuery.isError || progressQuery.isError,
    error: initQuery.error || progressQuery.error,
    
    // Actions
    completeDay: completeDayMutation.mutate,
    saveNotes: saveNotesMutation.mutate,
    getDayCompletion,
    
    // Mutation status
    isCompletingDay: completeDayMutation.isPending,
    isSavingNotes: saveNotesMutation.isPending,
  };
}

// Helper hook for managing local state
export function useLocalProgress() {
  const [showCalendarSplash, setShowCalendarSplash] = useState(false);
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentReflections, setCurrentReflections] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedShowSplash = localStorage.getItem('showCalendarSplash');
    if (savedShowSplash === null || savedShowSplash === 'true') {
      setShowCalendarSplash(true);
    }
  }, []);

  const hideCalendarSplash = () => {
    setShowCalendarSplash(false);
    localStorage.setItem('showCalendarSplash', 'false');
  };

  const resetCalendarSplash = () => {
    setShowCalendarSplash(true);
    localStorage.setItem('showCalendarSplash', 'true');
  };

  return {
    showCalendarSplash,
    hideCalendarSplash,
    resetCalendarSplash,
    currentNotes,
    setCurrentNotes,
    currentReflections,
    setCurrentReflections,
  };
}
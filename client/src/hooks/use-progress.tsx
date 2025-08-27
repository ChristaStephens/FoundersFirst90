import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-local-storage';
import { UserProgress, Achievement } from '@/types/mission';

const initialProgress: UserProgress = {
  currentDay: 1,
  completedDays: [],
  streak: 0,
  bestStreak: 0,
  startDate: new Date().toISOString(),
};

const achievements: Achievement[] = [
  {
    id: 'first-week',
    title: 'First Week',
    description: 'Completed your first 7 days',
    icon: '🚀',
    unlocked: false,
    requirement: 7,
  },
  {
    id: 'thirty-days',
    title: '30 Days',
    description: 'Completed 30 days of missions',
    icon: '🎯',
    unlocked: false,
    requirement: 30,
  },
  {
    id: 'sixty-days',
    title: '60 Days',
    description: 'Completed 60 days of missions',
    icon: '💪',
    unlocked: false,
    requirement: 60,
  },
  {
    id: 'founder',
    title: 'Founder',
    description: 'Completed all 90 days',
    icon: '👑',
    unlocked: false,
    requirement: 90,
  },
];

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('founders-first-90-progress', initialProgress);
  const [userAchievements, setUserAchievements] = useLocalStorage<Achievement[]>('founders-first-90-achievements', achievements);

  const completeDay = (day: number) => {
    const today = new Date().toDateString();
    const newCompletedDays = [...progress.completedDays];
    
    if (!newCompletedDays.includes(day)) {
      newCompletedDays.push(day);
      newCompletedDays.sort((a, b) => a - b);
      
      // Calculate new streak
      let newStreak = 1;
      for (let i = day - 1; i >= 1; i--) {
        if (newCompletedDays.includes(i)) {
          newStreak++;
        } else {
          break;
        }
      }
      
      const newProgress: UserProgress = {
        ...progress,
        completedDays: newCompletedDays,
        streak: newStreak,
        bestStreak: Math.max(progress.bestStreak, newStreak),
        lastCompletedDate: today,
        currentDay: Math.max(progress.currentDay, day + 1),
      };
      
      setProgress(newProgress);
      
      // Check for new achievements
      const updatedAchievements = userAchievements.map(achievement => {
        if (!achievement.unlocked && newCompletedDays.length >= achievement.requirement) {
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });
      
      setUserAchievements(updatedAchievements);
    }
  };

  const isDayCompleted = (day: number) => {
    return progress.completedDays.includes(day);
  };

  const getProgressPercentage = () => {
    return Math.round((progress.completedDays.length / 90) * 100);
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    setUserAchievements(achievements);
  };

  return {
    progress,
    achievements: userAchievements,
    completeDay,
    isDayCompleted,
    getProgressPercentage,
    resetProgress,
  };
}

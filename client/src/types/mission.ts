export interface Mission {
  day: number;
  title: string;
  description: string;
  task: string;
  steps: string[];
  resources: {
    title: string;
    url: string;
    type: 'template' | 'video' | 'article' | 'tool';
  }[];
  successCriteria: string;
}

export interface UserProgress {
  currentDay: number;
  completedDays: number[];
  streak: number;
  bestStreak: number;
  startDate: string;
  lastCompletedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCompletionSchema, insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to get demo user ID
  const getDemoUserId = async () => {
    const user = await storage.getUserByUsername('demo');
    return user?.id;
  };

  // Initialize demo user and progress if not exists
  app.get('/api/init', async (req, res) => {
    try {
      // Try to find existing user first
      let user = await storage.getUserByUsername('demo');
      if (!user) {
        // Create new user with proper ID
        user = await storage.createUser({
          username: 'demo',
          password: 'demo'
        });
      }

      // Use the actual user ID from the database
      const userId = user.id;
      
      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        progress = await storage.createUserProgress({
          userId: userId,
          currentDay: 1,
          streak: 0,
          bestStreak: 0,
          buildingLevel: 1,
          totalCompletedDays: 0
        });
      }

      res.json({ user, progress });
    } catch (error) {
      console.error('Error initializing user:', error);
      res.status(500).json({ message: 'Failed to initialize user' });
    }
  });

  // Get user progress
  app.get('/api/progress', async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const progress = await storage.getUserProgress(userId);
      const completions = await storage.getAllDailyCompletions(userId);
      const achievements = await storage.getUserAchievements(userId);
      
      res.json({ progress, completions, achievements });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  });

  // Complete a day
  app.post('/api/complete-day', async (req, res) => {
    try {
      const { day, notes, reflections } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get or create daily completion
      let completion = await storage.getDailyCompletion(userId, day);
      
      if (completion) {
        completion = await storage.updateDailyCompletion(userId, day, {
          completed: true,
          completedAt: new Date(),
          notes,
          reflections
        });
      } else {
        completion = await storage.createDailyCompletion({
          userId: userId,
          day,
          completed: true,
          completedAt: new Date(),
          notes,
          reflections
        });
      }

      // Update user progress
      const currentProgress = await storage.getUserProgress(userId);
      if (currentProgress) {
        const completions = await storage.getAllDailyCompletions(userId);
        const totalCompleted = completions.filter(c => c.completed).length;
        
        // Calculate streak
        let newStreak = 0;
        const sortedCompletions = completions.sort((a, b) => b.day - a.day);
        
        // Check for consecutive completions from current day backwards
        for (let i = 0; i < sortedCompletions.length; i++) {
          const expectedDay = day - i;
          if (sortedCompletions[i] && sortedCompletions[i].completed && sortedCompletions[i].day === expectedDay) {
            newStreak++;
          } else {
            break;
          }
        }

        const updatedProgress = await storage.updateUserProgress(userId, {
          currentDay: Math.max(currentProgress.currentDay, day + 1),
          streak: newStreak,
          bestStreak: Math.max(currentProgress.bestStreak, newStreak),
          buildingLevel: Math.min(totalCompleted + 1, 90),
          totalCompletedDays: totalCompleted
        });

        res.json({ completion, progress: updatedProgress });
      }
    } catch (error) {
      console.error('Error completing day:', error);
      res.status(500).json({ message: 'Failed to complete day' });
    }
  });

  // Save notes for a day
  app.post('/api/save-notes', async (req, res) => {
    try {
      const { day, notes, reflections } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      let completion = await storage.getDailyCompletion(userId, day);
      
      if (completion) {
        completion = await storage.updateDailyCompletion(userId, day, {
          notes,
          reflections
        });
      } else {
        completion = await storage.createDailyCompletion({
          userId: userId,
          day,
          completed: false,
          notes,
          reflections
        });
      }

      res.json({ completion });
    } catch (error) {
      console.error('Error saving notes:', error);
      res.status(500).json({ message: 'Failed to save notes' });
    }
  });

  // Save step responses for a day
  app.post('/api/save-step-responses', async (req, res) => {
    try {
      const { day, stepResponses } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      let completion = await storage.getDailyCompletion(userId, day);
      
      if (completion) {
        completion = await storage.updateDailyCompletion(userId, day, {
          stepResponses
        });
      } else {
        completion = await storage.createDailyCompletion({
          userId: userId,
          day,
          completed: false,
          stepResponses
        });
      }

      res.json({ completion });
    } catch (error) {
      console.error('Error saving step responses:', error);
      res.status(500).json({ message: 'Failed to save step responses' });
    }
  });

  // Get specific day completion
  app.get('/api/day/:day', async (req, res) => {
    try {
      const day = parseInt(req.params.day);
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const completion = await storage.getDailyCompletion(userId, day);
      res.json({ completion });
    } catch (error) {
      console.error('Error fetching day:', error);
      res.status(500).json({ message: 'Failed to fetch day' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

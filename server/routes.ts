import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCompletionSchema, insertProgressSchema } from "@shared/schema";
import { seedGamificationData } from "./seed-gamification";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

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

      // Seed gamification data (store items and challenges)
      await seedGamificationData();

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
      
      // Check if day is unlocked for completion
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }
      
      // Prevent completing future days or going too fast
      if (day > progress.currentDay) {
        return res.status(400).json({ 
          message: 'Cannot complete future days. Focus on building daily habits!',
          canAdvance: false 
        });
      }
      
      // Check if enough time has passed since last completion (24 hours cooldown)
      if (progress.lastDayCompletedAt && progress.nextDayUnlocksAt) {
        const now = new Date();
        if (day > progress.currentDay - 1 && now < progress.nextDayUnlocksAt) {
          const hoursLeft = Math.ceil((progress.nextDayUnlocksAt.getTime() - now.getTime()) / (1000 * 60 * 60));
          return res.status(429).json({ 
            message: `Your next day unlocks in ${hoursLeft} hours. Building daily habits takes time!`,
            canAdvance: false,
            nextUnlockTime: progress.nextDayUnlocksAt
          });
        }
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

        const now = new Date();
        const nextDayUnlockTime = new Date(now.getTime() + (18 * 60 * 60 * 1000)); // 18 hours from now (customizable)
        
        const updatedProgress = await storage.updateUserProgress(userId, {
          currentDay: Math.max(currentProgress.currentDay, day + 1),
          streak: newStreak,
          bestStreak: Math.max(currentProgress.bestStreak, newStreak),
          buildingLevel: Math.min(totalCompleted + 1, 90),
          totalCompletedDays: totalCompleted,
          lastDayCompletedAt: now,
          nextDayUnlocksAt: nextDayUnlockTime
        });

        res.json({ completion, progress: updatedProgress });
      }
    } catch (error) {
      console.error('Error completing day:', error);
      res.status(500).json({ message: 'Failed to complete day' });
    }
  });

  // End Day - allows user to set when next day unlocks (Finch-style)
  app.post('/api/end-day', async (req, res) => {
    try {
      const { customUnlockTime } = req.body; // Optional: user can set custom unlock time
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }
      
      const now = new Date();
      let nextUnlockTime;
      
      if (customUnlockTime) {
        // User specified when they want next day to unlock
        nextUnlockTime = new Date(customUnlockTime);
        
        // Ensure it's at least 8 hours from now (minimum rest period)
        const minUnlockTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        if (nextUnlockTime < minUnlockTime) {
          nextUnlockTime = minUnlockTime;
        }
      } else {
        // Default: 18 hours from now
        nextUnlockTime = new Date(now.getTime() + (18 * 60 * 60 * 1000));
      }
      
      const updatedProgress = await storage.updateUserProgress(userId, {
        lastDayCompletedAt: now,
        nextDayUnlocksAt: nextUnlockTime,
        updatedAt: new Date()
      });
      
      res.json({ 
        message: 'Day ended successfully! See you tomorrow.',
        nextUnlockTime: nextUnlockTime,
        progress: updatedProgress 
      });
    } catch (error) {
      console.error('Error ending day:', error);
      res.status(500).json({ message: 'Failed to end day' });
    }
  });

  // Check if next day is unlocked
  app.get('/api/can-advance', async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }
      
      const now = new Date();
      const canAdvance = !progress.nextDayUnlocksAt || now >= progress.nextDayUnlocksAt;
      
      let timeLeft = 0;
      if (progress.nextDayUnlocksAt && now < progress.nextDayUnlocksAt) {
        timeLeft = Math.ceil((progress.nextDayUnlocksAt.getTime() - now.getTime()) / (1000 * 60 * 60));
      }
      
      res.json({
        canAdvance,
        timeLeft,
        nextUnlockTime: progress.nextDayUnlocksAt,
        currentDay: progress.currentDay
      });
    } catch (error) {
      console.error('Error checking advancement:', error);
      res.status(500).json({ message: 'Failed to check advancement' });
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

  // Community API Routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await storage.getCommunityPosts(limit);
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const { type, day, title, content, isAnonymous } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const post = await storage.createCommunityPost({
        userId,
        type,
        day: day || null,
        title,
        content,
        isAnonymous: isAnonymous || false,
      });
      
      res.json({ post });
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post("/api/community/posts/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      await storage.likeCommunityPost(userId, postId);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.get("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getPostComments(postId);
      res.json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, isAnonymous } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const comment = await storage.createComment({
        postId,
        userId,
        content,
        isAnonymous: isAnonymous || false,
      });
      
      res.json({ comment });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get("/api/community/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getCommunityLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/community/partners", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      const partners = await storage.getAccountabilityPartners(userId);
      res.json({ partners });
    } catch (error) {
      console.error("Error fetching accountability partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.post("/api/community/partners", async (req, res) => {
    try {
      const { partnerId } = req.body;
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const partnership = await storage.createAccountabilityPartner({
        userId,
        partnerId,
        status: "pending",
      });
      
      res.json({ partnership });
    } catch (error) {
      console.error("Error creating accountability partnership:", error);
      res.status(500).json({ message: "Failed to create partnership" });
    }
  });

  // ============= GAMIFICATION ROUTES =============
  
  // Get user token balance and statistics
  app.get("/api/gamification/tokens", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }

      res.json({ 
        founderCoins: progress.founderCoins,
        visionGems: progress.visionGems,
        experiencePoints: progress.experiencePoints,
        entrepreneurLevel: progress.entrepreneurLevel,
        streakRestoresUsed: progress.streakRestoresUsed
      });
    } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ message: "Failed to fetch tokens" });
    }
  });

  // Get token transaction history
  app.get("/api/gamification/transactions", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const transactions = await storage.getTokenTransactions(userId, limit);
      res.json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Award tokens for completing tasks/challenges
  app.post("/api/gamification/award-tokens", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { tokenType, amount, reason, metadata } = req.body;
      
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }

      // Update token balance
      const newCoins = tokenType === 'founder_coins' 
        ? progress.founderCoins + amount 
        : progress.founderCoins;
      const newGems = tokenType === 'vision_gems' 
        ? progress.visionGems + amount 
        : progress.visionGems;

      // Create transaction record
      await storage.createTokenTransaction({
        userId,
        type: 'earned',
        tokenType,
        amount,
        reason,
        metadata
      });

      // Update user's token balance
      const updatedProgress = await storage.updateTokens(userId, newCoins, newGems);
      
      res.json({ 
        success: true,
        founderCoins: updatedProgress.founderCoins,
        visionGems: updatedProgress.visionGems
      });
    } catch (error) {
      console.error("Error awarding tokens:", error);
      res.status(500).json({ message: "Failed to award tokens" });
    }
  });

  // Get store items
  app.get("/api/gamification/store", async (req, res) => {
    try {
      const items = await storage.getStoreItems();
      res.json({ items });
    } catch (error) {
      console.error("Error fetching store items:", error);
      res.status(500).json({ message: "Failed to fetch store items" });
    }
  });

  // Purchase store item
  app.post("/api/gamification/purchase", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { storeItemId, quantity = 1 } = req.body;
      
      // Get store item details
      const items = await storage.getStoreItems();
      const item = items.find(i => i.id === storeItemId);
      if (!item) {
        return res.status(404).json({ message: 'Store item not found' });
      }

      const totalCost = item.cost * quantity;
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }

      // Check if user has enough tokens
      const currentBalance = item.tokenType === 'founder_coins' 
        ? progress.founderCoins 
        : progress.visionGems;
        
      if (currentBalance < totalCost) {
        return res.status(400).json({ message: 'Insufficient tokens' });
      }

      // Deduct tokens and create purchase record
      const newCoins = item.tokenType === 'founder_coins' 
        ? progress.founderCoins - totalCost 
        : progress.founderCoins;
      const newGems = item.tokenType === 'vision_gems' 
        ? progress.visionGems - totalCost 
        : progress.visionGems;

      // Create purchase and transaction records
      const purchase = await storage.createUserPurchase({
        userId,
        storeItemId,
        quantity,
        totalCost,
        tokenType: item.tokenType
      });

      await storage.createTokenTransaction({
        userId,
        type: 'spent',
        tokenType: item.tokenType,
        amount: totalCost,
        reason: 'store_purchase',
        metadata: { itemName: item.name, quantity }
      });

      // Update token balance
      const updatedProgress = await storage.updateTokens(userId, newCoins, newGems);

      res.json({ 
        success: true,
        purchase,
        founderCoins: updatedProgress.founderCoins,
        visionGems: updatedProgress.visionGems
      });
    } catch (error) {
      console.error("Error purchasing item:", error);
      res.status(500).json({ message: "Failed to purchase item" });
    }
  });

  // Get daily challenges
  app.get("/api/gamification/challenges", async (req, res) => {
    try {
      const challenges = await storage.getDailyChallenges();
      res.json({ challenges });
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Get daily challenges with user completion status
  app.get("/api/gamification/challenges/daily", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const challenges = await storage.getDailyChallenges();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const completions = await storage.getUserChallengeCompletions(userId, today);
      
      // Add completion status to challenges
      const challengesWithStatus = challenges.map(challenge => ({
        ...challenge,
        completedAt: completions.find(c => c.challengeId === challenge.id)?.completedAt || null
      }));
      
      const completedCount = completions.length;
      const totalCount = challenges.length;
      
      res.json({ 
        challenges: challengesWithStatus,
        completedCount,
        totalCount
      });
    } catch (error) {
      console.error("Error fetching daily challenges:", error);
      res.status(500).json({ message: "Failed to fetch daily challenges" });
    }
  });

  // Complete daily challenge
  app.post("/api/gamification/challenges/:challengeId/complete", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { challengeId } = req.params;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if already completed today
      const existingCompletion = await storage.getUserChallengeCompletions(userId, today);
      if (existingCompletion.some(c => c.challengeId === challengeId)) {
        return res.status(400).json({ message: 'Challenge already completed today' });
      }

      // Get challenge details
      const challenges = await storage.getDailyChallenges();
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      // Create completion record
      await storage.createUserChallengeCompletion({
        userId,
        challengeId,
        completedDate: today,
        rewardClaimed: true
      });

      // Award tokens
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }

      const newCoins = challenge.rewardTokenType === 'founder_coins' 
        ? progress.founderCoins + challenge.rewardAmount 
        : progress.founderCoins;
      const newGems = challenge.rewardTokenType === 'vision_gems' 
        ? progress.visionGems + challenge.rewardAmount 
        : progress.visionGems;

      await storage.createTokenTransaction({
        userId,
        type: 'earned',
        tokenType: challenge.rewardTokenType,
        amount: challenge.rewardAmount,
        reason: 'daily_challenge',
        metadata: { challengeName: challenge.name }
      });

      const updatedProgress = await storage.updateTokens(userId, newCoins, newGems);

      res.json({ 
        success: true,
        challenge,
        founderCoins: updatedProgress.founderCoins,
        visionGems: updatedProgress.visionGems
      });
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ message: "Failed to complete challenge" });
    }
  });

  // Complete daily challenge (alternative route for frontend compatibility)
  app.post("/api/gamification/challenges/complete", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { challengeId } = req.body;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if already completed today
      const existingCompletion = await storage.getUserChallengeCompletions(userId, today);
      if (existingCompletion.some(c => c.challengeId === challengeId)) {
        return res.status(400).json({ message: 'Challenge already completed today' });
      }

      // Get challenge details
      const challenges = await storage.getDailyChallenges();
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      // Create completion record
      await storage.createUserChallengeCompletion({
        userId,
        challengeId,
        completedDate: today,
        rewardClaimed: true
      });

      // Award tokens
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }

      const newCoins = challenge.rewardTokenType === 'founder_coins' 
        ? progress.founderCoins + challenge.rewardAmount 
        : progress.founderCoins;
      const newGems = challenge.rewardTokenType === 'vision_gems' 
        ? progress.visionGems + challenge.rewardAmount 
        : progress.visionGems;

      await storage.createTokenTransaction({
        userId,
        type: 'earned',
        tokenType: challenge.rewardTokenType,
        amount: challenge.rewardAmount,
        reason: 'daily_challenge',
        metadata: { challengeName: challenge.name }
      });

      const updatedProgress = await storage.updateTokens(userId, newCoins, newGems);

      res.json({ 
        success: true,
        challenge,
        founderCoins: updatedProgress.founderCoins,
        visionGems: updatedProgress.visionGems
      });
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ message: "Failed to complete challenge" });
    }
  });

  // ============= PAYMENT & SUBSCRIPTION ROUTES =============

  // Get user subscription status
  app.get("/api/subscription/status", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has active subscription or trial
      const now = new Date();
      let subscriptionStatus = user.subscriptionStatus || 'free';
      
      // Check if trial has expired
      if (user.trialEndsAt && now > user.trialEndsAt && subscriptionStatus === 'trialing') {
        subscriptionStatus = 'free';
        await storage.updateUserSubscription(userId, { 
          subscriptionStatus: 'free',
          subscriptionPlan: 'free'
        });
      }
      
      // Check if subscription has expired
      if (user.subscriptionEndsAt && now > user.subscriptionEndsAt && subscriptionStatus === 'active') {
        subscriptionStatus = 'free';
        await storage.updateUserSubscription(userId, { 
          subscriptionStatus: 'free',
          subscriptionPlan: 'free'
        });
      }

      res.json({ 
        subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan || 'free',
        trialEndsAt: user.trialEndsAt,
        subscriptionEndsAt: user.subscriptionEndsAt,
        hasAccess: subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  // Create one-time payment for full access
  app.post("/api/create-payment", async (req, res) => {
    try {
      const { discount = 0 } = req.body; // discount in cents
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user already has access
      if (user.subscriptionStatus === 'active') {
        return res.status(400).json({ message: 'User already has premium access' });
      }

      let customer;
      if (user.stripeCustomerId) {
        // Retrieve existing customer
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          metadata: {
            userId: userId,
            username: user.username
          },
        });

        // Save customer ID to user
        await storage.updateUserSubscription(userId, {
          stripeCustomerId: customer.id
        });
      }

      // Calculate final amount with discount
      const baseAmount = 2999; // $29.99
      const finalAmount = Math.max(baseAmount - discount, 1999); // Minimum $19.99
      const discountApplied = baseAmount - finalAmount;

      // Create one-time payment for full 90-day access
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: 'usd',
        customer: customer.id,
        description: discountApplied > 0 
          ? `Founder's First 90 - Complete 90-Day Journey (${discountApplied/100} discount applied)`
          : 'Founder\'s First 90 - Complete 90-Day Journey',
        metadata: {
          userId: userId,
          productType: 'full_access',
          originalAmount: baseAmount.toString(),
          discountAmount: discountApplied.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
        finalAmount,
        discountApplied
      });
    } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(500).json({ 
        message: "Error creating payment: " + error.message 
      });
    }
  });

  // Confirm payment and activate premium access
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = await getDemoUserId();
      
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Retrieve the payment intent to confirm it was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded' && paymentIntent.metadata.userId === userId) {
        // Activate premium access for the user
        await storage.updateUserSubscription(userId, {
          subscriptionStatus: 'active',
          subscriptionPlan: 'premium_lifetime',
          subscriptionEndsAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days access
        });

        res.json({ 
          message: 'Payment confirmed and access activated',
          hasAccess: true 
        });
      } else {
        res.status(400).json({ message: 'Payment not successful' });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Stripe webhook endpoint (for handling payment confirmations)
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // For development, we'll accept events without signature verification
      // In production, you should verify the signature using your webhook secret
      event = req.body;
    } catch (err: any) {
      console.log(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        
        if (userId && paymentIntent.metadata.productType === 'full_access') {
          // Activate premium access
          await storage.updateUserSubscription(userId, {
            subscriptionStatus: 'active',
            subscriptionPlan: 'premium_lifetime',
            subscriptionEndsAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days access
          });
          console.log('Premium access activated for user:', userId);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Create payment intent for "pay what you think is fair" model
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = 'usd' } = req.body;
      
      // Validate amount
      if (!amount || amount < 5) {
        return res.status(400).json({ 
          message: "Amount must be at least $5" 
        });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Start free trial
  app.post("/api/start-trial", async (req, res) => {
    try {
      const userId = await getDemoUserId();
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user already had a trial
      if (user.trialEndsAt) {
        return res.status(400).json({ 
          message: 'Trial already used',
          hasAccess: new Date() < user.trialEndsAt 
        });
      }

      // Start 7-day free trial
      const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await storage.updateUserSubscription(userId, {
        subscriptionStatus: 'trialing',
        subscriptionPlan: 'premium_trial',
        trialEndsAt
      });

      res.json({ 
        message: 'Trial started successfully',
        trialEndsAt,
        hasAccess: true
      });
    } catch (error) {
      console.error("Error starting trial:", error);
      res.status(500).json({ message: "Failed to start trial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

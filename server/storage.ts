import { 
  users, 
  userProgress, 
  dailyCompletions, 
  userAchievements,
  type User, 
  type InsertUser, 
  type UserProgress, 
  type InsertUserProgress,
  type DailyCompletion, 
  type InsertDailyCompletion,
  type UserAchievement,
  type InsertUserAchievement 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Progress management
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  
  // Daily completions
  getDailyCompletion(userId: string, day: number): Promise<DailyCompletion | undefined>;
  getAllDailyCompletions(userId: string): Promise<DailyCompletion[]>;
  createDailyCompletion(completion: InsertDailyCompletion): Promise<DailyCompletion>;
  updateDailyCompletion(userId: string, day: number, updates: Partial<DailyCompletion>): Promise<DailyCompletion>;
  
  // Achievements
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Progress management
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const [updatedProgress] = await db
      .update(userProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return updatedProgress;
  }

  // Daily completions
  async getDailyCompletion(userId: string, day: number): Promise<DailyCompletion | undefined> {
    const [completion] = await db
      .select()
      .from(dailyCompletions)
      .where(and(eq(dailyCompletions.userId, userId), eq(dailyCompletions.day, day)));
    return completion;
  }

  async getAllDailyCompletions(userId: string): Promise<DailyCompletion[]> {
    return db
      .select()
      .from(dailyCompletions)
      .where(eq(dailyCompletions.userId, userId))
      .orderBy(desc(dailyCompletions.day));
  }

  async createDailyCompletion(completion: InsertDailyCompletion): Promise<DailyCompletion> {
    const [newCompletion] = await db.insert(dailyCompletions).values(completion).returning();
    return newCompletion;
  }

  async updateDailyCompletion(userId: string, day: number, updates: Partial<DailyCompletion>): Promise<DailyCompletion> {
    const [updatedCompletion] = await db
      .update(dailyCompletions)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(dailyCompletions.userId, userId), eq(dailyCompletions.day, day)))
      .returning();
    return updatedCompletion;
  }

  // Achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db.insert(userAchievements).values(achievement).returning();
    return newAchievement;
  }
}

export const storage = new DatabaseStorage();

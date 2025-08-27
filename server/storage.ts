import { 
  users, 
  userProgress, 
  dailyCompletions, 
  userAchievements,
  communityPosts,
  postLikes,
  postComments,
  accountabilityPartners,
  communityStats,
  type User, 
  type InsertUser, 
  type UserProgress, 
  type InsertUserProgress,
  type DailyCompletion, 
  type InsertDailyCompletion,
  type UserAchievement,
  type InsertUserAchievement,
  type CommunityPost,
  type InsertCommunityPost,
  type PostComment,
  type InsertPostComment,
  type AccountabilityPartner,
  type InsertAccountabilityPartner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

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
  
  // Community features
  getCommunityPosts(limit: number): Promise<(CommunityPost & { user: { username: string } })[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  likeCommunityPost(userId: string, postId: string): Promise<void>;
  getPostComments(postId: string): Promise<(PostComment & { user: { username: string } })[]>;
  createComment(comment: InsertPostComment): Promise<PostComment>;
  getAccountabilityPartners(userId: string): Promise<(AccountabilityPartner & { partner: { username: string } })[]>;
  createAccountabilityPartner(partnership: InsertAccountabilityPartner): Promise<AccountabilityPartner>;
  getCommunityLeaderboard(limit: number): Promise<{ username: string; streak: number; totalDays: number; rank: number }[]>;
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

  // Community Features
  async getCommunityPosts(limit: number = 20): Promise<(CommunityPost & { user: { username: string } })[]> {
    const posts = await db
      .select({
        id: communityPosts.id,
        userId: communityPosts.userId,
        type: communityPosts.type,
        day: communityPosts.day,
        title: communityPosts.title,
        content: communityPosts.content,
        isAnonymous: communityPosts.isAnonymous,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        createdAt: communityPosts.createdAt,
        updatedAt: communityPosts.updatedAt,
        user: {
          username: users.username,
        },
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
    return posts;
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db
      .insert(communityPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async likeCommunityPost(userId: string, postId: string): Promise<void> {
    // Check if already liked
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));

    if (existingLike.length === 0) {
      await db.transaction(async (tx) => {
        // Add like
        await tx.insert(postLikes).values({ userId, postId });
        // Update likes count
        await tx
          .update(communityPosts)
          .set({ likesCount: sql`${communityPosts.likesCount} + 1` })
          .where(eq(communityPosts.id, postId));
      });
    }
  }

  async getPostComments(postId: string): Promise<(PostComment & { user: { username: string } })[]> {
    const comments = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        userId: postComments.userId,
        content: postComments.content,
        isAnonymous: postComments.isAnonymous,
        createdAt: postComments.createdAt,
        user: {
          username: users.username,
        },
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, postId))
      .orderBy(asc(postComments.createdAt));
    return comments;
  }

  async createComment(comment: InsertPostComment): Promise<PostComment> {
    const [newComment] = await db.transaction(async (tx) => {
      // Add comment
      const [comment] = await tx
        .insert(postComments)
        .values(comment)
        .returning();
      // Update comments count
      await tx
        .update(communityPosts)
        .set({ commentsCount: sql`${communityPosts.commentsCount} + 1` })
        .where(eq(communityPosts.id, comment.postId));
      return [comment];
    });
    return newComment;
  }

  async getAccountabilityPartners(userId: string): Promise<(AccountabilityPartner & { partner: { username: string } })[]> {
    const partners = await db
      .select({
        id: accountabilityPartners.id,
        userId: accountabilityPartners.userId,
        partnerId: accountabilityPartners.partnerId,
        status: accountabilityPartners.status,
        startedAt: accountabilityPartners.startedAt,
        completedAt: accountabilityPartners.completedAt,
        createdAt: accountabilityPartners.createdAt,
        partner: {
          username: users.username,
        },
      })
      .from(accountabilityPartners)
      .leftJoin(users, eq(accountabilityPartners.partnerId, users.id))
      .where(eq(accountabilityPartners.userId, userId));
    return partners;
  }

  async createAccountabilityPartner(partnership: InsertAccountabilityPartner): Promise<AccountabilityPartner> {
    const [newPartnership] = await db
      .insert(accountabilityPartners)
      .values(partnership)
      .returning();
    return newPartnership;
  }

  async getCommunityLeaderboard(limit: number = 10): Promise<{ username: string; streak: number; totalDays: number; rank: number }[]> {
    const leaderboard = await db
      .select({
        username: users.username,
        streak: userProgress.streak,
        totalDays: userProgress.totalCompletedDays,
      })
      .from(userProgress)
      .leftJoin(users, eq(userProgress.userId, users.id))
      .orderBy(desc(userProgress.streak), desc(userProgress.totalCompletedDays))
      .limit(limit);

    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}

export const storage = new DatabaseStorage();

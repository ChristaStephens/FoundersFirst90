import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for basic user management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Stripe subscription fields
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"), // free, trialing, active, past_due, canceled
  subscriptionPlan: varchar("subscription_plan").default("free"), // free, premium_monthly, premium_yearly
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress tracking with gamification
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentDay: integer("current_day").notNull().default(1),
  startDate: timestamp("start_date").defaultNow(),
  streak: integer("streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  buildingLevel: integer("building_level").notNull().default(1),
  totalCompletedDays: integer("total_completed_days").notNull().default(0),
  lastDayCompletedAt: timestamp("last_day_completed_at"),
  nextDayUnlocksAt: timestamp("next_day_unlocks_at"),
  journeyStartedAt: timestamp("journey_started_at").defaultNow(),
  
  // Gamification fields
  founderCoins: integer("founder_coins").notNull().default(50), // Primary currency - start with 50 coins
  visionGems: integer("vision_gems").notNull().default(3), // Premium currency - start with 3 gems
  experiencePoints: integer("experience_points").notNull().default(0),
  entrepreneurLevel: integer("entrepreneur_level").notNull().default(1), // User's entrepreneur level
  lastActivityDate: varchar("last_activity_date"),
  streakRestoresUsed: integer("streak_restores_used").notNull().default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily mission completions with notes
export const dailyCompletions = pgTable("daily_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  day: integer("day").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  notes: text("notes"), // User's personal notes for the day
  reflections: text("reflections"), // End-of-day reflections
  stepResponses: jsonb("step_responses"), // JSON object with step responses {step1: "response", step2: "response"}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievement unlocks
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many, one }) => ({
  progress: one(userProgress, { fields: [users.id], references: [userProgress.userId] }),
  completions: many(dailyCompletions),
  achievements: many(userAchievements),
}));

export const progressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
}));

export const completionRelations = relations(dailyCompletions, ({ one }) => ({
  user: one(users, { fields: [dailyCompletions.userId], references: [users.id] }),
}));

export const achievementRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompletionSchema = createInsertSchema(dailyCompletions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertProgressSchema>;
export type DailyCompletion = typeof dailyCompletions.$inferSelect;
export type InsertDailyCompletion = z.infer<typeof insertCompletionSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertAchievementSchema>;

// Community Features Tables
export const accountabilityPartners = pgTable("accountability_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  partnerId: varchar("partner_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, active, completed, cancelled
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // milestone, struggle, win, question, motivation
  day: integer("day"),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => communityPosts.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postComments = pgTable("post_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => communityPosts.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityStats = pgTable("community_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  postsShared: integer("posts_shared").default(0),
  likesReceived: integer("likes_received").default(0),
  commentsReceived: integer("comments_received").default(0),
  partnershipsCompleted: integer("partnerships_completed").default(0),
  communityRank: integer("community_rank"),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community relations
export const accountabilityPartnersRelations = relations(accountabilityPartners, ({ one }) => ({
  user: one(users, {
    fields: [accountabilityPartners.userId],
    references: [users.id],
    relationName: "userPartner",
  }),
  partner: one(users, {
    fields: [accountabilityPartners.partnerId],
    references: [users.id],
    relationName: "partnerUser",
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  likes: many(postLikes),
  comments: many(postComments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(communityPosts, {
    fields: [postLikes.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(communityPosts, {
    fields: [postComments.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

export const communityStatsRelations = relations(communityStats, ({ one }) => ({
  user: one(users, {
    fields: [communityStats.userId],
    references: [users.id],
  }),
}));

// Community schemas
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  commentsCount: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
});

export const insertAccountabilityPartnerSchema = createInsertSchema(accountabilityPartners).omit({
  id: true,
  createdAt: true,
});

// Gamification Tables

// Token transactions - track all coin/gem earnings and spending
export const tokenTransactions = pgTable("token_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // earned, spent
  tokenType: varchar("token_type", { length: 20 }).notNull(), // founder_coins, vision_gems
  amount: integer("amount").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // task_completion, streak_milestone, store_purchase, streak_restore
  metadata: jsonb("metadata"), // Additional context like day number, item purchased, etc
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievement store items that users can purchase with tokens
export const storeItems = pgTable("store_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // streak_tools, customization, power_ups, charity
  tokenType: varchar("token_type", { length: 20 }).notNull(), // founder_coins, vision_gems
  cost: integer("cost").notNull(),
  iconEmoji: varchar("icon_emoji", { length: 10 }),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User purchases from the store
export const userPurchases = pgTable("user_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  storeItemId: varchar("store_item_id").references(() => storeItems.id).notNull(),
  quantity: integer("quantity").default(1),
  totalCost: integer("total_cost").notNull(),
  tokenType: varchar("token_type", { length: 20 }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Daily challenges for bonus token earning
export const dailyChallenges = pgTable("daily_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  challengeType: varchar("challenge_type", { length: 50 }).notNull(), // early_bird, perfectionist, note_taker, community_engage
  rewardTokenType: varchar("reward_token_type", { length: 20 }).notNull(),
  rewardAmount: integer("reward_amount").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User daily challenge completions
export const userChallengeCompletions = pgTable("user_challenge_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => dailyChallenges.id).notNull(),
  completedDate: varchar("completed_date").notNull(), // YYYY-MM-DD format
  rewardClaimed: boolean("reward_claimed").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Gamification relations
export const tokenTransactionsRelations = relations(tokenTransactions, ({ one }) => ({
  user: one(users, {
    fields: [tokenTransactions.userId],
    references: [users.id],
  }),
}));

export const userPurchasesRelations = relations(userPurchases, ({ one }) => ({
  user: one(users, {
    fields: [userPurchases.userId],
    references: [users.id],
  }),
  storeItem: one(storeItems, {
    fields: [userPurchases.storeItemId],
    references: [storeItems.id],
  }),
}));

export const userChallengeCompletionsRelations = relations(userChallengeCompletions, ({ one }) => ({
  user: one(users, {
    fields: [userChallengeCompletions.userId],
    references: [users.id],
  }),
  challenge: one(dailyChallenges, {
    fields: [userChallengeCompletions.challengeId],
    references: [dailyChallenges.id],
  }),
}));

// Gamification schemas
export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertUserPurchaseSchema = createInsertSchema(userPurchases).omit({
  id: true,
  purchasedAt: true,
});

export const insertUserChallengeCompletionSchema = createInsertSchema(userChallengeCompletions).omit({
  id: true,
  completedAt: true,
});

// Gamification types
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type StoreItem = typeof storeItems.$inferSelect;
export type InsertStoreItem = typeof storeItems.$inferInsert;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertUserPurchase = z.infer<typeof insertUserPurchaseSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = typeof dailyChallenges.$inferInsert;
export type UserChallengeCompletion = typeof userChallengeCompletions.$inferSelect;
export type InsertUserChallengeCompletion = z.infer<typeof insertUserChallengeCompletionSchema>;

// Community types
export type AccountabilityPartner = typeof accountabilityPartners.$inferSelect;
export type InsertAccountabilityPartner = z.infer<typeof insertAccountabilityPartnerSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = typeof postLikes.$inferInsert;
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type CommunityStats = typeof communityStats.$inferSelect;
export type InsertCommunityStats = typeof communityStats.$inferInsert;

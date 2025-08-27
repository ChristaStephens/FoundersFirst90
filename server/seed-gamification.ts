import { db } from "./db";
import { storeItems, dailyChallenges } from "@shared/schema";

export async function seedGamificationData() {
  try {
    // Check if data already exists
    const existingItems = await db.select().from(storeItems).limit(1);
    const existingChallenges = await db.select().from(dailyChallenges).limit(1);
    
    if (existingItems.length > 0 && existingChallenges.length > 0) {
      console.log("Gamification data already exists, skipping seed");
      return;
    }

    console.log("Seeding gamification data...");

    // Seed store items
    const storeItemsData = [
      // Streak Tools (most important - like Finch's streak restoration)
      {
        name: "Streak Saver Shield",
        description: "Restore your streak if you miss a day. Perfect safety net for busy entrepreneurs!",
        category: "streak_tools",
        tokenType: "founder_coins",
        cost: 25,
        iconEmoji: "🛡️",
        sortOrder: 1
      },
      {
        name: "Double Streak Insurance",
        description: "Get 2 streak restoration saves for the price of 1.5! Smart entrepreneurs plan ahead.",
        category: "streak_tools", 
        tokenType: "founder_coins",
        cost: 38,
        iconEmoji: "🛡️",
        sortOrder: 2
      },
      {
        name: "Golden Streak Freeze",
        description: "Premium streak protection that prevents any streak loss for 3 days. Ultimate peace of mind!",
        category: "streak_tools",
        tokenType: "vision_gems",
        cost: 2,
        iconEmoji: "❄️",
        sortOrder: 3
      },

      // Power-ups (productivity boosters)
      {
        name: "Focus Booster",
        description: "Double your Founder Coins for the next 3 completed missions. Stay laser focused!",
        category: "power_ups",
        tokenType: "founder_coins", 
        cost: 20,
        iconEmoji: "⚡",
        sortOrder: 10
      },
      {
        name: "Vision Crystal",
        description: "Unlock exclusive entrepreneur tips and bonus content for your next 5 missions.",
        category: "power_ups",
        tokenType: "vision_gems",
        cost: 1,
        iconEmoji: "🔮",
        sortOrder: 11
      },
      {
        name: "Momentum Builder",
        description: "Get bonus XP for completing missions 3 days in a row. Build unstoppable momentum!",
        category: "power_ups",
        tokenType: "founder_coins",
        cost: 15,
        iconEmoji: "🚀",
        sortOrder: 12
      },

      // Customization (personalization options)  
      {
        name: "Golden Crown Avatar",
        description: "Show your entrepreneurial success with this premium avatar upgrade.",
        category: "customization",
        tokenType: "vision_gems",
        cost: 3,
        iconEmoji: "👑",
        sortOrder: 20
      },
      {
        name: "Achievement Badge Set",
        description: "Unlock special badges to showcase your milestones and inspire other founders.",
        category: "customization",
        tokenType: "founder_coins",
        cost: 30,
        iconEmoji: "🏆",
        sortOrder: 21
      },
      {
        name: "Custom Mission Theme",
        description: "Personalize your daily missions with premium themes and colors.",
        category: "customization", 
        tokenType: "founder_coins",
        cost: 12,
        iconEmoji: "🎨",
        sortOrder: 22
      },

      // Social Impact (charity donations - like some successful apps)
      {
        name: "Plant a Tree",
        description: "TymFlo plants a real tree through our environmental partners. Make an impact while building your startup!",
        category: "charity",
        tokenType: "founder_coins",
        cost: 50,
        iconEmoji: "🌳",
        sortOrder: 30
      },
      {
        name: "Support Young Entrepreneurs",
        description: "Sponsor entrepreneurship education for students. Give back while growing your own business!",
        category: "charity",
        tokenType: "vision_gems", 
        cost: 5,
        iconEmoji: "🎓",
        sortOrder: 31
      }
    ];

    await db.insert(storeItems).values(storeItemsData);

    // Seed daily challenges
    const challengesData = [
      {
        name: "Early Bird Founder", 
        description: "Complete your daily mission before 10 AM",
        challengeType: "early_bird",
        rewardTokenType: "founder_coins",
        rewardAmount: 3
      },
      {
        name: "Perfect Execution",
        description: "Complete ALL steps of today's mission with detailed notes",  
        challengeType: "perfectionist",
        rewardTokenType: "founder_coins", 
        rewardAmount: 5
      },
      {
        name: "Reflection Master",
        description: "Write meaningful reflections for your completed mission (50+ characters)",
        challengeType: "note_taker",
        rewardTokenType: "founder_coins",
        rewardAmount: 4
      },
      {
        name: "Community Builder", 
        description: "Share your progress or encourage others in the community",
        challengeType: "community_engage",
        rewardTokenType: "vision_gems",
        rewardAmount: 1
      },
      {
        name: "Consistency Champion",
        description: "Complete your mission for 3 days in a row",
        challengeType: "streak_builder", 
        rewardTokenType: "vision_gems",
        rewardAmount: 2
      },
      {
        name: "Network Ninja",
        description: "Connect with or help another founder in the community",
        challengeType: "networking",
        rewardTokenType: "founder_coins",
        rewardAmount: 6
      }
    ];

    await db.insert(dailyChallenges).values(challengesData);

    console.log("✅ Gamification data seeded successfully!");
    console.log("- Added 11 store items (streak tools, power-ups, customization, charity)");
    console.log("- Added 6 daily challenges for bonus token earning");

  } catch (error) {
    console.error("Error seeding gamification data:", error);
  }
}
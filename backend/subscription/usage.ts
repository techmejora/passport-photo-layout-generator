import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getAuthData } from "~encore/auth";

const usageDB = new SQLDatabase("usage", {
  migrations: "./migrations",
});

export interface UsageStats {
  imageProcessing: number;
  videoProcessing: number;
  cardGeneration: number;
  resetDate: Date;
}

export interface CheckUsageLimitRequest {
  operation: "image" | "video" | "card";
  guestId?: string;
}

export interface CheckUsageLimitResponse {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetDate?: Date;
  requiresUpgrade: boolean;
}

// Checks if user can perform an operation based on their plan limits
export const checkUsageLimit = api<CheckUsageLimitRequest, CheckUsageLimitResponse>(
  { expose: true, method: "POST", path: "/subscription/check-usage" },
  async (req) => {
    const auth = getAuthData();
    
    if (!auth && !req.guestId) {
      // For guest users without ID, allow first 2 operations
      return {
        allowed: true,
        remaining: 2,
        limit: 2,
        requiresUpgrade: false
      };
    }

    const userId = auth?.userID || `guest_${req.guestId}`;
    const isGuest = !auth;
    
    // Get current usage for this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usage = await usageDB.queryRow`
      SELECT 
        image_processing,
        video_processing,
        card_generation,
        reset_date
      FROM user_usage 
      WHERE user_id = ${userId} 
      AND reset_date >= ${startOfMonth}
    `;

    const currentUsage = {
      imageProcessing: usage?.image_processing || 0,
      videoProcessing: usage?.video_processing || 0,
      cardGeneration: usage?.card_generation || 0
    };

    // Get user's plan limits (for guests, use free plan limits)
    let limits;
    if (isGuest) {
      limits = {
        imageProcessing: 2,
        videoProcessing: 0,
        cardGeneration: 0
      };
    } else {
      // TODO: Get user's actual subscription plan
      // For now, assume free plan for authenticated users
      limits = {
        imageProcessing: 100,
        videoProcessing: 10,
        cardGeneration: 5
      };
    }

    let currentCount = 0;
    let limit = 0;

    switch (req.operation) {
      case "image":
        currentCount = currentUsage.imageProcessing;
        limit = limits.imageProcessing;
        break;
      case "video":
        currentCount = currentUsage.videoProcessing;
        limit = limits.videoProcessing;
        break;
      case "card":
        currentCount = currentUsage.cardGeneration;
        limit = limits.cardGeneration;
        break;
    }

    const allowed = limit === -1 || currentCount < limit; // -1 means unlimited
    const remaining = limit === -1 ? -1 : Math.max(0, limit - currentCount);
    const requiresUpgrade = !allowed && (isGuest || limit < 100);

    return {
      allowed,
      remaining,
      limit,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      requiresUpgrade
    };
  }
);

// Records usage for an operation
export const recordUsage = api<CheckUsageLimitRequest, void>(
  { expose: true, method: "POST", path: "/subscription/record-usage" },
  async (req) => {
    const auth = getAuthData();
    const userId = auth?.userID || `guest_${req.guestId}`;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Insert or update usage record
    await usageDB.exec`
      INSERT INTO user_usage (user_id, image_processing, video_processing, card_generation, reset_date, created_at, updated_at)
      VALUES (
        ${userId}, 
        ${req.operation === 'image' ? 1 : 0},
        ${req.operation === 'video' ? 1 : 0},
        ${req.operation === 'card' ? 1 : 0},
        ${endOfMonth},
        ${now},
        ${now}
      )
      ON CONFLICT (user_id, reset_date) 
      DO UPDATE SET
        image_processing = user_usage.image_processing + ${req.operation === 'image' ? 1 : 0},
        video_processing = user_usage.video_processing + ${req.operation === 'video' ? 1 : 0},
        card_generation = user_usage.card_generation + ${req.operation === 'card' ? 1 : 0},
        updated_at = ${now}
    `;
  }
);

// Gets current usage stats for a user
export const getUsageStats = api<void, UsageStats>(
  { expose: true, method: "GET", path: "/subscription/usage", auth: true },
  async () => {
    const auth = getAuthData()!;
    const userId = auth.userID;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usage = await usageDB.queryRow`
      SELECT 
        image_processing,
        video_processing,
        card_generation,
        reset_date
      FROM user_usage 
      WHERE user_id = ${userId} 
      AND reset_date >= ${startOfMonth}
    `;

    return {
      imageProcessing: usage?.image_processing || 0,
      videoProcessing: usage?.video_processing || 0,
      cardGeneration: usage?.card_generation || 0,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
    };
  }
);

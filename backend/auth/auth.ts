import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  email: string | null;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    // Simple token-based auth for demo purposes
    const token = data.authorization?.replace("Bearer ", "") ?? data.session?.value;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    // For demo purposes, accept any token that starts with "user_"
    if (!token.startsWith("user_")) {
      throw APIError.unauthenticated("invalid token");
    }

    // Extract user ID from token
    const userID = token.replace("user_", "");
    
    return {
      userID,
      email: `${userID}@example.com`,
    };
  }
);

// Configure the API gateway to use the auth handler.
export const gw = new Gateway({ authHandler: auth });

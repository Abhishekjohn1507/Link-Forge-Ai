import { query } from "./_generated/server";
import { v } from "convex/values";

// This file is meant to re-export all the query and mutation functions
// from other files to provide a single entry point for the API.

// Re-export from urls.ts
export * as urls from "./urls";

// Re-export from users.ts
export * as users from "./users";

// Re-export from users/resetToken.ts

// Health check query
export const ping = query({
  args: {},
  handler: async () => {
    return { status: "ok", timestamp: Date.now() };
  },
});
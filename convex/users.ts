// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create user
export const createUserMutation = mutation({
  args: {
    id: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    billingInfo: v.optional(
      v.object({
        clerkUserId: v.string(),
        passwordHash: v.string(),
        resetPasswordToken: v.optional(v.string()),
        resetPasswordExpires: v.optional(v.float64()),
      })
    ),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.id))
      .first();

    if (existingUser) return existingUser._id;

    return await ctx.db.insert("users", {
      ...args,
      clerkUserId: args.id, // make sure you store it
    });
  },
});

// Query to get current user's Convex _id by Clerk ID
export const getCurrentUserId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    return user?._id ?? null;
  },
});

// Query to get full user document by Clerk ID
export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user
export const createUserMutation = mutation({
  args: {
    id: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        image: args.image,
        emailVerified: args.emailVerified,
        updatedAt: args.updatedAt,
      });
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.id,
      email: args.email,
      name: args.name,
      image: args.image,
      emailVerified: args.emailVerified,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });

    return userId;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    return user;
  },
});

// Get user by Convex ID
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

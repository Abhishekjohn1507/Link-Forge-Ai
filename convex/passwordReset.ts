import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";




// Internal mutation to store token (can only be called from actions)
export const storeResetToken = internalMutation({
  args: {
    email: v.string(),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("passwordResetTokens", {
      email: args.email,
      token: args.token,
      createdAt: args.createdAt,
      expiresAt: args.expiresAt,
      used: false,
    });
  },
});

// Internal mutation to invalidate existing tokens
export const invalidateExistingTokens = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingTokens = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("used"), false))
      .collect();

    for (const token of existingTokens) {
      await ctx.db.patch(token._id, { used: true });
    }
  },
});

// Verify and consume reset token
export const verifyResetToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenDoc = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenDoc) {
      throw new Error("Invalid or expired reset token");
    }

    if (tokenDoc.used) {
      throw new Error("This reset token has already been used");
    }

    if (Date.now() > tokenDoc.expiresAt) {
      throw new Error("This reset token has expired");
    }

    return {
      email: tokenDoc.email,
      tokenId: tokenDoc._id,
    };
  },
});

// Reset password with token
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify token
    const tokenData = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenData || tokenData.used || Date.now() > tokenData.expiresAt) {
      throw new Error("Invalid or expired reset token");
    }

    // Mark token as used
    await ctx.db.patch(tokenData._id, { used: true });

    // TODO: Update user password (hash it first!)
    // const hashedPassword = await hashPassword(args.newPassword);
    // await ctx.db.patch(userId, { password: hashedPassword });

    return { success: true };
  },
});

// Cleanup expired tokens (run periodically)
export const cleanupExpiredTokens = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
    }

    return { deleted: expiredTokens.length };
  },
});


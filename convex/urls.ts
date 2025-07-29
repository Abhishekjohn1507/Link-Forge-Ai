// convex/urls.ts
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all URLs for a specific user
export const getUrlsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('urls')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// Delete a URL by ID
export const deleteUrl = mutation({
  args: { urlId: v.id('urls') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.urlId);
  },
});

// Get a URL by its shortcode
export const getUrlByShortCode = query({
  args: { shortCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('urls')
      .filter((q) => q.eq(q.field('shortCode'), args.shortCode))
      .first();
  },
});

// Record a click (you mentioned it, make sure it exists)
export const recordClick = mutation({
  args: { urlId: v.id("urls") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.urlId);
    if (!existing) return;
    await ctx.db.patch(args.urlId, {
      clicks: (existing.clicks || 0) + 1,
    });
  },
});
export const createUrl = mutation({
  args: {
    originalUrl: v.string(),
    userId: v.optional(v.string()), // can be null
    alias: v.optional(v.string()),  // ✅ add this
  },
  handler: async (ctx, args) => {
    // Generate a random 6-character string if no alias is provided
    const shortCode = args.alias ?? Math.random().toString(36).substring(2, 8);

    // Optional: Check if alias is already taken
    const existing = await ctx.db
      .query("urls")
      .filter((q) => q.eq(q.field("shortCode"), shortCode))
      .first();

    if (existing) {
      throw new Error("Alias already in use. Please choose a different one.");
    }

    const urlId = await ctx.db.insert("urls", {
      originalUrl: args.originalUrl,
      userId: args.userId ?? null,
      shortCode,
      createdAt: Date.now(),
      clicks: 0, // Initialize clicks counter
    });

    return { shortCode };
  },
});

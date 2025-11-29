import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

export const createUrl = mutation({
  args: {
    originalUrl: v.string(),
    userId: v.optional(v.id("users")),
    alias: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const shortCode = args.alias || nanoid(8);

    const existing = await ctx.db
      .query("urls")
      .withIndex("by_short_code", (q) => q.eq("shortCode", shortCode))
      .first();
    if (existing) {
      throw new Error("Alias already exists");
    }

    const now = Date.now();
    const urlId = await ctx.db.insert("urls", {
      originalUrl: args.originalUrl,
      shortCode,
      userId: args.userId ?? undefined,
      createdAt: now,
      clicks: 0,
      lastClicked: undefined,
    });

    return await ctx.db.get(urlId);
  },
});

export const getUrlsByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const urls = await ctx.db
      .query("urls")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return urls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getUrlByShortCode = query({
  args: {
    shortCode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("urls")
      .withIndex("by_short_code", (q) => q.eq("shortCode", args.shortCode))
      .first();
  },
});

export const updateUrl = mutation({
  args: {
    urlId: v.id("urls"),
    alias: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("urls")
      .withIndex("by_short_code", (q) => q.eq("shortCode", args.alias))
      .first();
    if (existing && existing._id !== args.urlId) {
      return null;
    }
    await ctx.db.patch(args.urlId, { shortCode: args.alias });
    return await ctx.db.get(args.urlId);
  },
});

export const deleteUrl = mutation({
  args: {
    urlId: v.id("urls"),
  },
  handler: async (ctx, args) => {
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_url", (q) => q.eq("urlId", args.urlId))
      .collect();
    for (const c of clicks) {
      await ctx.db.delete(c._id);
    }
    await ctx.db.delete(args.urlId);
    return true;
  },
});

export const recordClick = mutation({
  args: {
    shortCode: v.optional(v.string()),
    urlId: v.optional(v.id("urls")),
  },
  handler: async (ctx, args) => {
    let url = null as any;
    if (args?.urlId) {
      url = await ctx.db.get(args.urlId);
    } else if (args?.shortCode) {
      url = await ctx.db
        .query("urls")
        .withIndex("by_short_code", (q) => q.eq("shortCode", args.shortCode!))
        .first();
    }
    if (!url) return null;
    await ctx.db.insert("clicks", { urlId: url._id, clickedAt: Date.now() });
    await ctx.db.patch(url._id, { clicks: (url.clicks ?? 0) + 1, lastClicked: Date.now() });
    return true;
  },
});

export const getUrlAnalytics = query({
  args: {
    urlId: v.id("urls"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.db.get(args.urlId);
    if (!url) return null;
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_url", (q) => q.eq("urlId", args.urlId))
      .order("desc")
      .collect();
    return { url, clicks };
  },
});

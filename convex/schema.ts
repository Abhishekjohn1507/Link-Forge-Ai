import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"]),
  urls: defineTable({
    originalUrl: v.string(),
    shortCode: v.string(),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
    clicks: v.number(),
    lastClicked: v.optional(v.number()),
  })
    .index("by_short_code", ["shortCode"])
    .index("by_user", ["userId"]),
  clicks: defineTable({
    urlId: v.id("urls"),
    clickedAt: v.number(),
  })
    .index("by_url", ["urlId"]),
});

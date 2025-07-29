// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(), // Renamed from `id` to `clerkUserId`
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
  }).index("by_clerkUserId", ["clerkUserId"]),

  urls: defineTable({
    userId: v.optional(v.string()), // allow null/undefined
    originalUrl: v.string(),
    shortCode: v.string(),
    clicks: v.number(),
    createdAt: v.float64(),
  }).index("by_userId", ["userId"]),
});

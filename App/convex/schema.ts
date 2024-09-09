import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import test from "node:test";

// Documentation: https://docs.convex.dev/database/schemas

export default defineSchema({
  // audioFiles: defineTable({
  //   id: v.string(),
  //   url: v.string(),
  // }),
  appIdeas: defineTable({
    name: v.string(),
    description: v.string(),
  }),
  social: defineTable({
    platform: v.string(),
    tracker: v.string(),
  }),
  url: defineTable({
    name: v.string(),
    link: v.string(),
  }),
  feedback: defineTable({
    message: v.string(),
    userId: v.string(), // This is the user's id on posthog
  }),
});


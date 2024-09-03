import { mutation, query, action, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { getAppIdea } from './openai/gpt';
import { internal } from './_generated/api';


export const insertAppIdea = internalMutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('appIdeas', args);
    return await ctx.db.get(id);
  },
});

export const makeAppIdea = action({
  args: {},
  handler: async (ctx, _) => {
    const idea = await getAppIdea();
    await ctx.runMutation(internal.ideas.insertAppIdea, idea);
    return {name: idea.name, description: idea.description};
  },
});

export const getAppIdeas = query({
  handler: async (ctx) => {
    const numIdeas = (await ctx.db.query('appIdeas').collect()).length;
    return numIdeas;
  },
});

export const updateSocial = mutation({
  args: {
    platform: v.string(),
    tracker: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('social', args);
    return await ctx.db.get(id);
  },
});

export const updateUrl = mutation({
  args: {
    name: v.string(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('url', args);
    return await ctx.db.get(id);
  },
});

export const getSocial = query({
  handler: async (ctx) => {
    try {
      const allSocial = await ctx.db.query('social').collect();
      return allSocial;
    } catch (error) {
      console.error("Failed to get social data:", error);
      throw new Error("Server Error: Unable to fetch social data.");
    }
  },
});

export const getUrl = query({
  handler: async (ctx) => {
    const allUrls = (await ctx.db.query('url').collect());
    return allUrls;
  },
});

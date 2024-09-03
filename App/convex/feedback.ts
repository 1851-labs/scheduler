import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const submitFeedback = mutation({
    args: {
        message: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const newFeedback = {
            message: args.message,
            userId: args.userId,
        };
        await ctx.db.insert('feedback', newFeedback);
    },
});





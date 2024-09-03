import { Auth } from 'convex/server';
import { ConvexError } from 'convex/values';
import { action, mutation, query } from './_generated/server';
import { customAction, customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions';

async function getUserId(ctx: { auth: Auth }) {
  const authInfo = await ctx.auth.getUserIdentity();
  return authInfo?.tokenIdentifier;
}

export const queryWithUser = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getUserId(ctx);
    return {
      userId: userId,
    };
  }),
);

export const mutationWithUser = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new ConvexError('User not authenticated');
    }
    return {
      userId: userId,
    };
  }),
);

export const actionWithUser = customAction(
  action,
  customCtx(async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new ConvexError('User not authenticated');
    }
    return {
      userId: userId,
    };
  }),
);

export const envVarsMissing = query({
  args: {},
  handler: async () => {
    if (process.env.REPLICATE_API_KEY && process.env.TOGETHER_API_KEY) {
      return null;
    }
    if (process.env.OPENAI_API_KEY) {
      return null;
    }
    const deploymentName = process.env.CONVEX_CLOUD_URL?.slice(8).replace(
      '.convex.cloud',
      '',
    );
    return (
      'https://dashboard.convex.dev/d/' +
      deploymentName +
      `/settings/environment-variables?var=REPLICATE_API_KEY&var=TOGETHER_API_KEY`
    );
  },
});

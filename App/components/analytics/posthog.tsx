"use client";

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useSearchParams } from 'next/navigation'

// https://posthog.com/docs/libraries/next-js

export function PostHogProviderWrapper({
  children,
  phKey,
  phHost,
}: {
  children: React.ReactNode,
  phKey: string,
  phHost: string,
}) {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
        posthog.init(
            phKey, 
            {
                api_host: phHost,
                capture_pageview: false, // Disable automatic pageview capture, as we capture manually
            },
        );
        // PostHog Groups: https://posthog.com/docs/product-analytics/group-analytics 
        const searchParams = useSearchParams();
        const campaignIds = searchParams.get('_cid') || searchParams.get('cid');
        if (campaignIds) {
          campaignIds.split(',').forEach((campaignId) => {
            posthog.group('campaign', `id:${campaignId.trim()}`, {
              name: campaignId.trim(),
              value: campaignId.trim(),
            });
          });
        }
    }

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

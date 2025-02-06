import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import Footer from "@/components/ui/Footer";
import PostHogPageView from "@/app/PostHogPageView";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { PostHogProviderWrapper } from "@/components/analytics/posthog";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/authContext";

let title = "VoCal";
let description = "Voice-to-calendar scheduling app!";
let url = "https://myvocal.co";
let sitename = "myvocal.co";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <ConvexClientProvider>
              <PostHogProviderWrapper
                phKey={process.env.NEXT_PUBLIC_POSTHOG_KEY!}
                phHost={process.env.NEXT_PUBLIC_POSTHOG_HOST!}
              >
                {children}
                {/*<Analytics />*/}
                <Suspense>
                  <GoogleAnalytics tagId={process.env.NEXT_PUBLIC_GA_TAG_ID!} />
                  <PostHogPageView />
                </Suspense>
                {/* Footer */}
                <Footer />
                {/* Popup Alerts */}
                <Toaster position="top-center" reverseOrder={false} />
              </PostHogProviderWrapper>
            </ConvexClientProvider>
            <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID!} />
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  ignoredRoutes: ["/", "/", "/privacy-policy", "/dashboard"],
  publicRoutes: [
    "/designs",
    "/cid",
    "/sentry-example-page", // test sentry
    "/api/sentry-example-api", // test sentry
    "/monitoring", // used to proxy sentry errors to sentry (avoids browsers blocking)
    "/component-library",
    "/privacy-policy",
    "/dashboard",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};


"use client";
import Link from "next/link";
import React from "react";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  LayoutGrid,
} from "lucide-react";
import { ScrollArea } from "@/components/shadcn/ScrollArea";
import { ScrollBar } from "@/components/shadcn/ScrollArea";
import { Badge } from "@/components/shadcn/Badge";
import { Button } from "@/components/shadcn/Button";
import { BsDiscord } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SocialIcon } from "react-social-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/shadcn/Sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PostHogFeature } from "posthog-js/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Textarea } from "@/components/shadcn/TextArea";
import { useState } from "react";
import posthog from "posthog-js";
import { useUser } from "@clerk/clerk-react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { FeedbackCard } from "./FeedbackCard";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();

  function getLinkClassNames(path: string) {
    if (pathname === path || (pathname === "/" && path === "/home")) {
      return "flex items-center gap-3 rounded-lg px-3 py-2 bg-muted text-primary transition-all hover:text-primary";
    } else {
      return "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
    }
  }

  function getLinkMobileClassNames(path: string) {
    if (pathname === path || (pathname === "/" && path === "/home")) {
      return "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground";
    } else {
      return "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground";
    }
  }

  async function handleSubmitFeedback() {
    posthog.capture("submit-feedback", {
      message: feedback,
      userId: posthog.get_distinct_id(),
    });
    if (feedback.length > 0) {
      setFeedbackSubmitted(true);
      await submitFeedback({
        message: feedback,
        userId: posthog.get_distinct_id(),
      });
    }
  }

  return (
    <div className="flex flex-row min-h-screen w-full">
      <div className="md:w-[240px] lg:w-[320px] shrink-0 hidden border-r bg-muted/40 md:block">
        <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img
                src="/logo.svg"
                width={50}
                height={50}
                alt="logo"
                className="h-5 w-5 md:h-8 md:w-8"
              />
              <span className="">Scheduler</span>
            </Link>

            <SignedIn>
              <UserButton />
            </SignedIn>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link href="/" className={getLinkClassNames("/home")}>
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/component-library"
                className={getLinkClassNames("/component-library")}
              >
                <LayoutGrid className="h-4 w-4" />
                UI Examples
                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge> */}
              </Link>
            </nav>
          </div>
          <div className="sticky bottom-5 m-5">
            <FeedbackCard />
            <div className="flex flex-col items-center mt-16">
              <p className="text-sm">Connect with us!</p>
              <div className="flex flex-row space-x-3 py-4">
                <SocialIcon
                  onClick={() => {
                    posthog.capture("clicked-social", { platform: "facebook" });
                  }}
                  style={{ height: 45, width: 45 }}
                  url="https://www.facebook.com/profile.php?id=61562199479506"
                  target="_blank"
                />
                <SocialIcon
                  onClick={() => {
                    posthog.capture("clicked-social", { platform: "twitter" });
                  }}
                  style={{ height: 45, width: 45 }}
                  url="https://x.com/ComicSpinApp"
                  target="_blank"
                />
                <SocialIcon
                  onClick={() => {
                    posthog.capture("clicked-social", { platform: "reddit" });
                  }}
                  style={{ height: 45, width: 45 }}
                  url="https://www.reddit.com/r/ComicSpin/"
                  target="_blank"
                />
                <SocialIcon
                  onClick={() => {
                    posthog.capture("clicked-social", { platform: "discord" });
                  }}
                  style={{ height: 45, width: 45 }}
                  url="https://discord.com/invite/CkT3R7d8G7"
                  target="_blank"
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-auto p-4">
                        <Card x-chunk="dashboard-02-chunk-0">
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access to our support
                                    team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div> */}
        </div>
      </div>
      <div className="flex flex-col w-full md:w-[calc(100%-240px)] lg:w-[calc(100%-320px)]">
        <header className="w-full flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col min-h-screen max-h-screen"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <VisuallyHidden.Root>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden.Root>
              <VisuallyHidden.Root>
                <SheetDescription>Menu for small screens</SheetDescription>
              </VisuallyHidden.Root>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <img
                    src="/images/comicspin-logo3.png"
                    alt="logo"
                    className="h-9 w-9 md:h-12 md:w-12"
                  />
                  <span className="sr-only">ComicSpin</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={getLinkMobileClassNames("/dashboard")}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/my-comics"
                  className={getLinkMobileClassNames("/my-comics")}
                >
                  <LayoutGrid className="h-5 w-5" />
                  My Comics
                  {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge> */}
                </Link>
              </nav>
              <div className="h-full"></div>
              <div className="">
                <FeedbackCard />
                <div className="mt-44"></div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-row w-full justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <img
                src="/images/comicspin-logo3.png"
                alt="logo"
                className="h-9 w-9 md:h-12 md:w-12 ml-3 md:ml-0"
              />
              <h2 className="text-xl font-medium text-[#25292F] md:text-3xl">
                ComicSpin
              </h2>
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <main className="w-full flex-1 gap-4 px-3 py-3 lg:gap-6 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface FeedbackCardProps {
  feedbackSubmitted: boolean;
  handleSubmitFeedback: () => void;
  setFeedback: (feedback: string) => void;
  generatedComics: string[];
  handleSubmitEmail: () => void;
  setEmail: (email: string) => void;
}


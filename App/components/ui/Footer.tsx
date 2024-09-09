"use client";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import posthog from "posthog-js";

export default function Footer() {
  return (
    <footer className="container mx-auto my-5 flex h-16 flex-col items-center justify-between space-y-3 border-t px-3 pt-4 text-center sm:h-20 sm:flex-row sm:pt-2 md:text-lg">
      <div className="flex items-center justify-center">
        Powered by{" "}
        <a
          href="https://www.1851labs.com"
          target="_blank"
          className="font-bold transition hover:text-black/50 ml-2"
        >
          1851 Labs
        </a>
      </div>
      <div>
        <Link
          className="text-foreground/50 hover:text-foreground/80"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex flex-row space-x-3 py-2 md:py-0">
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "facebook" });
            }}
            style={{ height: 35, width: 35 }}
            url="https://www.facebook.com/profile.php?id=61562199479506"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "twitter" });
            }}
            style={{ height: 35, width: 35 }}
            url="https://x.com/ComicSpinApp"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "reddit" });
            }}
            style={{ height: 35, width: 35 }}
            url="https://www.reddit.com/r/ComicSpin/"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "discord" });
            }}
            style={{ height: 35, width: 35 }}
            url="https://discord.com/invite/CkT3R7d8G7"
            target="_blank"
          />
        </div>
      </div>
    </footer>
  );
}


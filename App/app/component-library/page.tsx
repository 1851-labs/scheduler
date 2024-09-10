"use client";
import Header from "@/components/ui/Header";
import Banner from "@/components/pages/home/Banner";

import ReactGA from "react-ga4";
import { Button } from "@/components/shadcn/Button";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/Card";
import { Input } from "@/components/shadcn/Input";
import { Label } from "@/components/shadcn/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/Select";
import ImageUploader from "@/components/photo/ImageUploader";
import { useState, useEffect } from "react";
import MultiImageViewer from "@/components/photo/MultiImageViewer";
import { fetchImageAsBase64 } from "@/lib/utils";
import SpheresLoadingAnimation from "@/components/ui/SpheresLoadingAnimation";
import CubesLoadingAnimation from "@/components/ui/CubesLoadingAnimation";
import SpinnerLoadingAnimation from "@/components/ui/SpinnerLoadingAnimation";
import FloatingSharePanel from "@/components/ui/FloatingSharePanel";
import { FeedbackCard } from "@/components/ui/FeedbackCard";
import { Dashboard } from "@/components/ui/Dashboard";

const SplashPage = () => {
  ReactGA.send({ hitType: "pageview", page: "/", title: "SplashPage" });
  const [previewSrc, setPreviewSrc] = useState("");
  const [resizedSrc, setResizedSrc] = useState("");

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const imageFiles = [
      "images/boy_with_mic.png",
      "images/dashboard.png",
      "images/fairy.webp",
      "images/laptop3.png",
      "images/story_telling_sticker.png",
      "images/timemachine.png",
    ];
    // Convert to base64 and store
    const base64Images = Promise.all(
      imageFiles.map((imageFile) => fetchImageAsBase64(imageFile))
    );
    base64Images.then((resolvedImages) => setImages(resolvedImages));
  }, []);

  return (
    <Dashboard>
      <div className="w-full">
        <Header />
        <div className="w-full px-4 mt-10 md:px-8 lg:px-16">
          <div className="w-full mx-auto lg:w-4/5">
            <h1 className="text-4xl pb-4">App Template UI Examples</h1>
            <h1 className="text-2xl pb-2">Image uploader: </h1>
            <ImageUploader
              previewSrc={previewSrc}
              setPreviewSrc={setPreviewSrc}
              setResizedSrc={setResizedSrc}
            />
            <h1 className="text-2xl pb-2 mt-7">Image viewer: </h1>
            <MultiImageViewer
              generatedImages={images}
              postHogEventType="image_viewer"
              error={false}
            />
            <h1 className="text-2xl pb-2 mt-7">Loading animations: </h1>
            <div className="flex flex-row items-center flex-wrap">
              <div className="mr-7">
                <SpheresLoadingAnimation />
              </div>
              <div className="mr-7">
                <CubesLoadingAnimation />
              </div>
              <div className="mr-7">
                <SpinnerLoadingAnimation color="black" />
              </div>
            </div>
            <h1 className="text-2xl pb-2 mt-7">Shadcn: </h1>
            <p className="pb-4">
              Here are some examples of the different button variants that
              shadcn provides:
            </p>
            <div className="w-full flex flex-row flex-wrap">
              <Button variant="default" size="sm" className="mr-4">
                Size sm
              </Button>
              <Button variant="default" size="default" className="mr-4">
                Size default
              </Button>
              <Button variant="default" size="lg" className="mr-4">
                Size lg
              </Button>
              <Button variant="default" size="icon" className="mr-4">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full flex flex-row mt-10 flex-wrap">
              <Button variant="link" size="sm" className="mr-4">
                Link
              </Button>
              <Button variant="destructive" size="default" className="mr-4">
                Destructive
              </Button>
              <Button variant="outline" size="lg" className="mr-4">
                Outline
              </Button>
              <Button variant="secondary" size="lg" className="mr-4">
                Secondary
              </Button>
              <Button variant="ghost" size="lg" className="mr-4">
                Ghost
              </Button>
            </div>
            <p className="pb-4 mt-7">
              Here is an example of a more complex UI object built with shadcn
              components.
            </p>
            <Card className="w-[350px] mb-10">
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Name of your project" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="framework">Framework</Label>
                      <Select>
                        <SelectTrigger id="framework">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter>
            </Card>
            <FeedbackCard />
            <div className="mb-[100px]"></div>
          </div>
        </div>
        <FloatingSharePanel />
      </div>
    </Dashboard>
  );
};

export default SplashPage;

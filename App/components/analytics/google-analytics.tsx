"use client";

import { useEffect } from "react";
import { initializeGA, trackGAPage } from "@/lib/utils";

export const GoogleAnalytics = ({tagId}:{tagId:string}) => {
  useEffect(() => { initializeGA(tagId); }, []);
  return (<div id="ga4-setup"></div>);
};

export const TrackPage = ({
  path,
  title,
}:{
  path:string;
  title:string;
}) => {
  trackGAPage('pageview',path,title);
  return (<div id={`ga-track-page-hack-${path}-${title}`}></div>)
}
"use client";

import Image from "next/image";
//import copy from 'copy-to-clipboard';
import { PostHogFeature } from "posthog-js/react";
import { Send } from "react-feather";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { useAction, useMutation, useQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";
import { use, useEffect } from "react";

import React, { useState } from "react";
import { set } from "zod";

const SharePage = () => {
  const [selectedUrlOption, setSelectedUrlOption] = useState("");
  const [selectedSocialOption, setSelectedSocialOption] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showSocialInput, setShowSocialInput] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newGtm, setNewGtm] = useState("");
  const [newCamp, setNewCamp] = useState("");
  const [currentURL, setCurrentURL] = useState("");

  const updateUrl = useMutation(api.ideas.updateUrl);
  const updateSocial = useMutation(api.ideas.updateSocial);
  const allSocials = useQuery(api.ideas.getSocial);
  const allUrls = useQuery(api.ideas.getUrl);

  const handleUrlOptionChange = (e: any) => {
    const selectedOption = e.target.value;
    if (selectedOption === "addUrl") {
      setShowUrlInput(true);
    } else {
      updateCurrentURL(undefined, selectedOption);
      setShowUrlInput(false);
      setSelectedUrlOption(selectedOption);
    }
  };
  const handleSocialOptionChange = (e: any) => {
    const selectedOption = e.target.value;
    console.log("e in handle social change", e);
    if (selectedOption === "addSocial") {
      setShowSocialInput(true);
    } else {
      setShowSocialInput(false);
      setSelectedSocialOption(selectedOption);
      //console.log('current url', currentURL)
      const cid = selectedOption?.substring(0, 3);

      const searchString = "?cid=";
      const updatedURL = `${currentURL}${cid}`;
      setCurrentURL(updatedURL);
    }
  };

  const updateCurrentURL = (social = "", url = "") => {
    const gtm = newGtm?.substring(0, 3);
    let urlToCopy = url
      ? `${url}?_cid=${newGtm ? gtm : selectedSocialOption}`
      : `${selectedUrlOption}?cid=${newGtm ? gtm : selectedSocialOption}`;
    //const newURL = `${url}?social=${social}`;
    setCurrentURL(urlToCopy);
  };

  const handleSubmit = async () => {
    const gtm = newGtm?.substring(0, 3);
    console.log("Button clicked");
    let urlToCopy = newUrl
      ? `${newUrl}?_cid=${newGtm ? gtm : selectedSocialOption}`
      : `${selectedUrlOption}?cid=${newGtm ? gtm : selectedSocialOption}`;
    console.log("urltocopy", urlToCopy);

    if (newUrl) {
      try {
        await updateUrl({ link: newUrl, name: "new app" });
        navigator.clipboard.writeText(urlToCopy).then(
          () => {
            console.log("URL copied to clipboard");
            toast.success("URL copied to clipboard");
          },
          (err) => {
            console.error("Could not copy URL to clipboard:", err);
            toast.error("Failed to copy URL to clipboard");
          }
        );
      } catch (error) {
        console.error("Failed to update URL:", error);
      }
    }

    if (newGtm) {
      try {
        await updateSocial({ platform: newGtm, tracker: gtm });
      } catch (error) {
        console.error("Failed to update Social:", error);
        toast.error("Failed to update Social");
      }
    } else {
      navigator.clipboard.writeText(urlToCopy);
      toast.success("URL copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <select
        value={selectedUrlOption}
        onChange={handleUrlOptionChange}
        className="w-3/4 p-2 border-2 border-yellow-400 rounded text-black"
      >
        <option value="">Select an app</option>
        {allUrls?.map((option) => (
          <option key={option.name} value={option.link}>
            {option.link}
          </option>
        ))}
      </select>
      {showUrlInput && (
        <input
          type="text"
          value={newUrl}
          onChange={(e) => {
            setNewUrl(e.target.value);
            console.log("newurl", newUrl);
          }}
          placeholder="Enter new URL"
          className="w-3/4 p-2 border-2 border-yellow-400 rounded text-black"
        />
      )}
      <select
        value={selectedSocialOption}
        onChange={handleSocialOptionChange}
        className="w-3/4 p-2 border-2 border-yellow-400 rounded text-black"
      >
        <option value="">Select a social media destination</option>
        {allSocials?.map((option) => (
          <option key={option.platform} value={option.tracker}>
            {option.platform}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter Campaign (optional)"
        className="w-3/4 p-2 mt-4 border-2 border-yellow-400 rounded text-black"
        value={newCamp}
        onChange={(e) => {
          setNewCamp(e.target.value);
        }}
      />
      {showSocialInput && (
        <input
          type="text"
          value={newGtm}
          onChange={(e) => {
            setNewGtm(e.target.value);
            console.log("newgtm", newGtm);
          }}
          placeholder="Enter new GTM"
          className="w-3/4 p-2 border-2 border-yellow-400 rounded text-black"
        />
      )}
      <>
        <input
          type="text"
          placeholder="Current URL"
          className="w-3/4 p-2 mt-4 border-2 border-yellow-400 rounded text-black"
          value={currentURL}
          onChange={(e) => {
            setCurrentURL(e.target.value);
          }}
        />
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          Copy url
        </button>
      </>
    </div>
  );
};

export default SharePage;


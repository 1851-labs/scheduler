import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactGA from "react-ga4";

/* Google Analytics */

const initializeGA = (tagId:string) => {
  if (!tagId) {
    throw new Error("Google Analytics Tag Id Required! Set Env Var: NEXT_PUBLIC_GA_TAG_ID to this GA property's tag id");
  }
  ReactGA.initialize(tagId, { gaOptions: { siteSpeedSampleRate: 100 }});
};

const trackGAEvent = (category:string, action:string, label:string) => {
  //console.log("GA event:", category, ":", action, ":", label);
  // Send GA4 Event
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

const trackGAPage = (hitType:string, page:string, title:string) => {
  //console.log("GA page: ", hitType, ":", page, ":", title);
  ReactGA.send({hitType: hitType, page: page, title: title});
};

export { initializeGA, trackGAEvent, trackGAPage };


/* Date/time Utils */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentFormattedDate(): string {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(currentDate);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateString} at ${timeString}`;
}

export async function fetchImageAsBase64(url: string): Promise<string> {
  // Fetch the image
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Response was not ok.');
    }

    // Convert the response to a Blob
    const imageBlob = await response.blob();

    return new Promise((resolve, reject) => {
      // Create a FileReader to convert the Blob into a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result includes the data URL which starts with "data:image/jpeg;base64,"
        // We need to extract only the Base64 part
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
  
      // Read the Blob as a data URL
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    console.error('Failed to fetch image:', error);
    throw Error('Failed to fetch image. Error with fetchImageAsBase64');
  }
}


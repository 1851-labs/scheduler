// events.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

import { extractTranscript } from "./openai/gpt";

interface TranscriptionResult {
  transcript: string;
}

export const transcribeAudio = action({
  args: {
    fileUrl: v.string(), // URL of the audio file
    // id: v.id("events"), // Event ID for tracking purposes
  },
  handler: async (ctx: any, args: any): Promise<TranscriptionResult> => {
    const transcript = await ctx.runAction(
      internal.replicate.whisper.getTranscription,
      { fileUrl: args.fileUrl }
      // { fileUrl: args.fileUrl, id: args.id }
    );
    return { transcript };
  },
});

export const processTranscript = action({
  args: {
    transcript: v.string(), // The transcript text
  },
  handler: async (ctx: any, args: any) => {
    const eventDetails = await extractTranscript(args.transcript);

    return {
      name: eventDetails.name,
      date: eventDetails.date,
      time: eventDetails.time,
      description: eventDetails.description,
    };
  },
});


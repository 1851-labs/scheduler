// events.ts
import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

import { extractTranscript } from "./openai/gpt";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
interface TranscriptionResult {
  transcript: string;
}

export const transcribeAudio = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<TranscriptionResult> => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    console.log("File URL:", fileUrl);

    const transcript = await ctx.runAction(
      internal.replicate.whisper.getTranscription,
      { fileUrl: fileUrl as string }
    );
    return transcript;
  },
});
// export const transcribeAudio = action({
//   args: {
//     fileUrl: v.string(), // URL of the audio file
//     // id: v.id("events"), // Event ID for tracking purposes
//   },
//   handler: async (ctx: any, args: any): Promise<TranscriptionResult> => {
//     const transcript = await ctx.runAction(
//       internal.replicate.whisper.getTranscription,
//       { fileUrl: args.fileUrl }
//       // { fileUrl: args.fileUrl, id: args.id }
//     );
//     return { transcript };
//   },
// });

export const processTranscript = action({
  args: {
    transcript: v.string(), // The full transcript text
  },
  handler: async (ctx, args) => {
    try {
      const eventDetails = await extractTranscript(args.transcript);

      return {
        name: eventDetails.name,
        date: eventDetails.date,
        time: eventDetails.time,
        description: eventDetails.description,
      };
    } catch (error) {
      console.error("Error processing transcript:", error);
      throw new Error("Failed to process the transcript.");
    }
  },
});

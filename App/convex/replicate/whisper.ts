("use node");

import Replicate from "replicate";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface whisperOutput {
  detected_language: string;
  segments: any;
  transcription: string;
  translation: string | null;
}

const WHISPER: `${string}/${string}:${string}` =
  "openai/whisper:cdd97b257f93cb89dede1c7584e3f3dfc969571b357dbcee08e793740bedd854";

//4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2 <-- old version of whisper

export const getTranscription = internalAction({
  args: {
    fileUrl: v.string(),
    // id: v.id("events"),
  },
  handler: async (ctx, args) => {
    try {
      const replicateOutput = (await replicate.run(WHISPER, {
        input: {
          audio: args.fileUrl,
          model: "large-v3",
          translate: false,
          temperature: 0,
          transcription: "plain text",
          suppress_tokens: "-1",
          logprob_threshold: -1,
          no_speech_threshold: 0.6,
          condition_on_previous_text: true,
          compression_ratio_threshold: 2.4,
          temperature_increment_on_fallback: 0.2,
        },
      })) as whisperOutput;

      const transcript = replicateOutput.transcription || "error";

      // return transcript;
      return { transcript };
    } catch (error) {
      return {
        transcript: "Error occurred duringggg transcription",
      };
    }
  },
});


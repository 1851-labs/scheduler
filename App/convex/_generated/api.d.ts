/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.3.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aws from "../aws.js";
import type * as feedback from "../feedback.js";
import type * as ideas from "../ideas.js";
import type * as openai_dalle from "../openai/dalle.js";
import type * as openai_gpt from "../openai/gpt.js";
import type * as replicate_llama from "../replicate/llama.js";
import type * as replicate_mixtral from "../replicate/mixtral.js";
import type * as replicate_stable_diffusion from "../replicate/stable_diffusion.js";
import type * as replicate_whisper from "../replicate/whisper.js";
import type * as together_bert from "../together/bert.js";
import type * as together_mixtral from "../together/mixtral.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aws: typeof aws;
  feedback: typeof feedback;
  ideas: typeof ideas;
  "openai/dalle": typeof openai_dalle;
  "openai/gpt": typeof openai_gpt;
  "replicate/llama": typeof replicate_llama;
  "replicate/mixtral": typeof replicate_mixtral;
  "replicate/stable_diffusion": typeof replicate_stable_diffusion;
  "replicate/whisper": typeof replicate_whisper;
  "together/bert": typeof together_bert;
  "together/mixtral": typeof together_mixtral;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

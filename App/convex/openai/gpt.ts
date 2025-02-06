("use node");

import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const TEXT_MODEL = "gpt-4";
export const VISION_MODEL = "gpt-4-vision-preview";

const NUM_LANDMARKS = 3;
const LandmarksSchema = z.object({
  landmarks: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nonempty()
    .min(1)
    .max(NUM_LANDMARKS),
});
const LANDMARK_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Respond with historically accurate answers only. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const LANDMARK_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `What are up to ${NUM_LANDMARKS} historically important landmarks in {city}, {country} that existed and were important in the {decade}s? For each landmark provide a name and a detailed description of how it looked during the {decade}s, emphasize the most distinctive visual details; the description will be used for the visually disabled.`
);
export async function getFamousLandmarks(
  city: string,
  country: string,
  decade: string
): Promise<{ name: string; description: string }[]> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = { city: city, country: country, decade: decade };
  let messages: any = [
    { role: "system", content: await LANDMARK_SYS_PROMPT.format(args) },
    { role: "user", content: await LANDMARK_USER_PROMPT.format(args) },
  ];
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: {
      schema: LandmarksSchema,
      name: `Famous-${city}-Landmarks`,
    },
    max_retries: 10,
  });
  console.log(completion.landmarks);
  return completion.landmarks;
}

const NUM_BUSINESSES = 5;
const LocalBusinessesSchema = z.object({
  businesses: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nonempty()
    .min(1)
    .max(NUM_BUSINESSES),
});
const BUSINESS_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Only respond with historically accurate answers. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const BUSINESS_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `What are up to ${NUM_BUSINESSES} famous businesses from {city}, {country} that existed in the {decade}s? List only famous businesses. Provide the name and a detailed description of how it looked during the {decade}s, emphasize the most distinctive visual details; the description will be used for the visually disabled.`
);
export async function getFamousBusinesses(
  city: string,
  country: string,
  decade: string
): Promise<{ name: string; description: string }[]> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = { city: city, country: country, decade: decade };
  let messages: any = [
    { role: "system", content: await BUSINESS_SYS_PROMPT.format(args) },
    { role: "user", content: await BUSINESS_USER_PROMPT.format(args) },
  ];
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: {
      schema: LocalBusinessesSchema,
      name: `Famous-${city}-Local-Businesses`,
    },
    max_retries: 10,
  });
  console.log(completion.businesses);
  return completion.businesses;
}

const NUM_TRANSPORTS = 3;
const TransportationSchema = z.object({
  typesOfTransportation: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nonempty()
    .min(1)
    .max(NUM_TRANSPORTS),
});
const TRANSPORT_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Only respond with historically accurate answers. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const TRANSPORT_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `What were the ${NUM_TRANSPORTS} common forms of transport in {city}, {country} from the {decade}s? Provide the name and a detailed description of how it looked during the {decade}s, emphasize the most distinctive visual details; the description will be used for the visually disabled.`
);
export async function getPublicTransport(
  city: string,
  country: string,
  decade: string
): Promise<{ name: string; description: string }[]> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = { city: city, country: country, decade: decade };
  let messages: any = [
    { role: "system", content: await TRANSPORT_SYS_PROMPT.format(args) },
    { role: "user", content: await TRANSPORT_USER_PROMPT.format(args) },
  ];
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: {
      schema: TransportationSchema,
      name: `${city}-Transportation`,
    },
    max_retries: 10,
  });
  console.log(completion.typesOfTransportation);
  return completion.typesOfTransportation;
}

const NUM_STREETS = 3;
const StreetSchema = z.object({
  streets: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nonempty()
    .min(1)
    .max(NUM_STREETS),
});
const STREET_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Only respond with historically accurate answers. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const STREET_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `What were the ${NUM_STREETS} iconic streets in {city}, {country} that existed the the {decade}s? Provide the name and a detailed description of the street looked during the {decade}s, emphasize the most distinctive visual details of that period; the compose a stimulating description that will be used for the visually disabled.`
);
export async function getStreet(
  city: string,
  country: string,
  decade: string
): Promise<{ name: string; description: string }[]> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = { city: city, country: country, decade: decade };
  let messages: any = [
    { role: "system", content: await STREET_SYS_PROMPT.format(args) },
    { role: "user", content: await STREET_USER_PROMPT.format(args) },
  ];
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: { schema: StreetSchema, name: `${city}-Transportation` },
    max_retries: 10,
  });
  console.log(completion.streets);
  return completion.streets;
}

const NUM_EVENTS = 3;
const EventsSchema = z.object({
  events: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nonempty()
    .min(1)
    .max(NUM_EVENTS),
});
const EVENTS_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Only respond with historically accurate answers. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const EVENTS_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `What were the ${NUM_EVENTS} iconic events that happened in {city}, {country} during the {decade}s? Provide the event name and a detailed description of a scene that describes how the event looked, emphasize the most distinctive visual details of the event; be detailed, the description that will be used for the visually disabled.`
);
export async function getEvent(
  city: string,
  country: string,
  decade: string
): Promise<{ name: string; description: string }[]> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = { city: city, country: country, decade: decade };
  let messages: any = [
    { role: "system", content: await EVENTS_SYS_PROMPT.format(args) },
    { role: "user", content: await EVENTS_USER_PROMPT.format(args) },
  ];
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: {
      schema: EventsSchema,
      name: `${city}-${decade}-IconicEvents`,
    },
    max_retries: 10,
  });
  console.log(completion.events);
  return completion.events;
}

const BuildingSchema = z.object({
  description: z.string(),
});
const BUILDING_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert historian on {city}, {country} from the {decade}s. Only respond with historically accurate answers. Respond with relevant details iconic to {city} during the {decade}s. Answer in valid JSON format.`
);
const BUILDING_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `Provide an 100 word architectural description of {building}s in {city}, {country} during the {decade}s. Describe the the roof shape, materials, the facade materials and shapes, the windows, common colors, include any important or iconic features; be extremely detailed, the description will be used for the visually disabled.`
);
export async function getBuilding(
  building: string,
  city: string,
  country: string,
  decade: string
): Promise<string> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  const args: any = {
    building: building,
    city: city,
    country: country,
    decade: decade,
  };
  let messages: any = [
    { role: "system", content: await BUILDING_SYS_PROMPT.format(args) },
    { role: "user", content: await BUILDING_USER_PROMPT.format(args) },
  ];
  console.log("messages");
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: { schema: BuildingSchema, name: `${city}-${building}` },
    max_retries: 10,
  });
  console.log("completion:");
  console.log(completion);
  return completion.description;
}

const AppDetailsSchema = z.object({
  name: z.string(),
  description: z.string(),
});
const APP_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert entrepreneur with experience bootstrapping multiple billion dollar companies. Be super specific in your answers. Answer in valid JSON format.`
);
const APP_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `Come up with a name and description for a unique startup that builds apps for consumers which incorporate generative AI in some way. App ideas should be feasible and easily deployable by a team of 4 developers in less than a week. Target your product to a specific niche and ensure that it solves a real problem that consumers have.`
);
export async function getAppIdea(): Promise<{
  name: string;
  description: string;
}> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  let messages: any = [
    { role: "system", content: await APP_SYS_PROMPT.format({}) },
    { role: "user", content: await APP_USER_PROMPT.format({}) },
  ];
  console.log("messages");
  console.log(messages);
  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: { schema: AppDetailsSchema, name: `NewAppIdea` },
    max_retries: 10,
  });
  console.log("completion:");
  console.log(completion);
  return { name: completion.name, description: completion.description };
}

const transcriptSchema = z.object({
  name: z.string(),
  date: z.string(),
  location: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string(),
});
//TODO: feed in todays date so that chatgpt knows when 'thursday' is
const TRANSCRIPT_SYS_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `You're an expert in natural language processing and information extraction. 
  Your task is to extract specific details from a given text. 
  Ensure that dates are formatted like so, "2025-09-11" and startTime and endTime is formatted in ISO 8601 format, e.g., "09:00:00". 
  If the year is not specified in the transcript, assume it is 2025. 
  If a startTime or endTime is not specified, leave it undefined.
  If a startTime is mentioned without an endTime, assume the endTime is 1 hour after the startTime.
  Be specific in your answers and use common sense. Answer in valid JSON format.`
);
const TRANSCRIPT_USER_PROMPT: PromptTemplate = PromptTemplate.fromTemplate(
  `Extract the event details from the following transcript. 
  The details should include the location, date, and time of the event. 
  Ensure that dates are formatted like so, "2025-09-11".
  startTime and endTime should be in ISO 8601 format, e.g., "09:00:00". 
  If the year is not specified in the transcript, assume it is 2025. 
  If a startTime or endTime is not specified, leave it undefined.
  If a startTime is mentioned without an endTime, assume the endTime is 1 hour after the startTime.
  If a location is not specified, leave it undefined.
  Generate an appropriate event name and description based on the provided context. 
  Ensure all fields are present and valid, even if you need to make educated guesses. 
  The response should strictly be in valid JSON format."
  
Transcript:
"{transcript}"`
);
export async function extractTranscript(transcript: string): Promise<{
  name: string;
  date: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  description: string;
}> {
  const instructor = Instructor({
    client: api,
    mode: "TOOLS",
  });
  let messages: any = [
    { role: "system", content: await TRANSCRIPT_SYS_PROMPT.format({}) },
    {
      role: "user",
      content: await TRANSCRIPT_USER_PROMPT.format({ transcript }),
    },
  ];
  console.log("messages");
  console.log(messages);

  const completion = await instructor.chat.completions.create({
    messages: messages,
    model: TEXT_MODEL,
    response_model: { schema: transcriptSchema, name: `transcriptExtraction` },
    max_retries: 10,
  });
  console.log("completion:");
  console.log(completion);

  return {
    name: completion.name,
    date: completion.date,
    location: completion.location,
    startTime: completion.startTime,
    endTime: completion.endTime,
    description: completion.description,
  };
}


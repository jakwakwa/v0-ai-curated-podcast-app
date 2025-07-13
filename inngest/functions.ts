import { inngest } from "./client";
import prisma from "../lib/prisma";
import { generateText } from "ai";
import {  createGoogleGenerativeAI } from "@ai-sdk/google";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Storage } from '@google-cloud/storage';
import { aiConfig } from "../config/ai";
import { Source } from "@prisma/client";
import { YoutubeTranscript } from 'youtube-transcript'; // New import

type SourceWithTranscript = Omit<Source, 'createdAt'> & { createdAt: string; transcript: string; };

const SIMULATE_AUDIO_SYNTHESIS = false; // Set to `true` to simulate, `false` to use ElevenLabs API

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || "",
});
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID as string,
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME as string);

const googleAI = createGoogleGenerativeAI({ fetch: global.fetch });

export const generatePodcast = inngest.createFunction(
  {
    id: "generate-podcast-workflow",
    name: "Generate Podcast Workflow",
    retries: 1, // Stop after the second failure (1 retry + initial attempt)
  },
  {
    event: "podcast/generate.requested",
  },
  async ({ event, step }) => {
    const { collectionId } = event.data;

   

    // Stage 1: Content Aggregation - Fetching collection and sources from DB
    const collection = await step.run("fetch-collection-data", async () => {
      console.log("Fetching collection and sources...");
      const fetchedCollection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { sources: true },
      });
      if (!fetchedCollection) {
        throw new Error(`Collection with ID ${collectionId} not found.`);
      }
      return fetchedCollection;
    });

    const sourcesWithTranscripts: SourceWithTranscript[] = await Promise.all(
      collection.sources.map(async (s) => {
        // Extract video ID from YouTube URL
        const videoIdMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        let transcriptContent = `No transcript available for ${s.name} from ${s.url}.`;

        if (videoId) {
          try {
            const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptContent = transcriptData.map(entry => entry.text).join(' ');
            console.log(`Successfully fetched transcript for video ID: ${videoId}`);
          } catch (error) {
            console.error(`Error fetching transcript for ${s.url}:`, error);
            transcriptContent = `Failed to retrieve transcript for ${s.name} from ${s.url}. Error: ${(error as Error).message}`;
          }
        } else {
          console.warn(`Could not extract video ID from URL: ${s.url}`);
        }

        const { createdAt, ...rest } = s;
        return {
          ...rest,
          createdAt: createdAt,
          transcript: transcriptContent,
        } as SourceWithTranscript;
      })
    );

    const aggregatedContent = sourcesWithTranscripts
      .map((s: SourceWithTranscript) => `Source: ${s.name} (${s.url})\nTranscript: ${s.transcript}`)
      .join("\n\n");

    // Stage 2: Summarization
    const summary = await step.run("summarize-content", async () => {
      console.log("Summarizing content...");
      const geminiApiKey = process.env.GEMINI_API_KEY;
      console.log("GEMINI_API_KEY at summarize-content step:", geminiApiKey ? "Key is present" : "Key is undefined/empty");
      console.log("aiConfig.geminiModel:", aiConfig.geminiModel);

      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not set.");
      }
      if (!aiConfig.geminiModel) {
        throw new Error("aiConfig.geminiModel is not defined.");
      }

      const model = googleAI(aiConfig.geminiModel);
      console.log("Model instance created:", model);

      const { text } = await generateText({
        model: model,
        prompt: `Summarize the following content for a podcast episode, focusing on key themes and interesting points. Provide a single sentence summary:\n\n${aggregatedContent}`,
      });
      return text;
    });

    // Stage 3: Script Generation
    const script = await step.run("generate-script", async () => {
      console.log("Generating podcast script...");
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const model = googleAI(aiConfig.geminiModel);
      const { text } = await generateText({
        model: model,
        prompt: `Based on the following summary, write a single sentence conversational podcast script. Include an introduction, transitions between topics, and a conclusion. Make it engaging and easy to listen to. Focus on a friendly and informative tone.\n\nSummary: ${summary}`,
      });
      return text;
    });

    // Stage 4: Audio Synthesis
    const audioBuffer = await step.run("synthesize-audio", async () => {
      if (SIMULATE_AUDIO_SYNTHESIS) {
        console.log("Simulating audio synthesis to bypass ElevenLabs quota...");
        // Simulate an audio buffer to continue the workflow
        const audioBuffer = Buffer.from("Simulated audio content for testing purposes.");
        return audioBuffer;
      } else {
        console.log("Performing actual audio synthesis with ElevenLabs...");
        const audio = await elevenlabs.textToSpeech.convert(
          "TX3LPaxmHKxFdv7VOQHJ", // User's preferred voice ID
          {
            text: script,
            modelId: "eleven_flash_v2_5", // User's preferred model for testing
          }
        );

        // The ElevenLabs API returns a ReadableStream for non-streaming, convert it to a Buffer.
        const streamToBuffer = async (stream: ReadableStream<Uint8Array>) => {
          const reader = stream.getReader();
          const chunks: Uint8Array[] = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }
          return Buffer.concat(chunks);
        };

        const audioBuffer = await streamToBuffer(audio);
        return audioBuffer;
      }
    });

    // Stage 5: Upload to Google Cloud Storage
    const publicUrl = await step.run("upload-audio", async () => {
      const audioFileName = `podcasts/${collectionId}-${Date.now()}.mp3`; // Generate filename here
      const buffer = Buffer.isBuffer(audioBuffer)
        ? audioBuffer
        : Buffer.from(audioBuffer as any); // Ensure it's a Buffer

      if (SIMULATE_AUDIO_SYNTHESIS) {
        console.log("Uploading simulated audio to GCS...");
      } else {
        console.log("Uploading actual audio to GCS...");
      }
      const file = bucket.file(audioFileName);
      await file.save(buffer, {
        contentType: "audio/mpeg",
      });
      return `https://storage.googleapis.com/${bucket.name}/${audioFileName}`;
    });

    // Update collection with audioUrl and status
    await step.run("update-collection-status", async () => {
      console.log("Attempting to update collection status...");
      console.log(`Collection ID: ${collectionId}`);
      console.log(`Public URL to save: ${publicUrl}`);
      try {
        const updatedCollection = await prisma.collection.update({
          where: { id: collectionId },
          data: {
            audioUrl: publicUrl,
            status: "Generated",
          },
        });
        console.log("Prisma update successful. Result:", updatedCollection);
      } catch (error) {
        console.error("Prisma update failed:", error);
        throw error; // Re-throw to propagate the error in Inngest
      }
    });

    console.log(`Podcast generation completed for collection: ${collectionId}`);
    return {
      success: true,
      collectionId,
      audioUrl: publicUrl,
    };
  })
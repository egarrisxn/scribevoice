import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/supabase/rate-limit";
import { MAX_DAILY_TRANSCRIBE_USES } from "@/lib/constants";

// Define a custom error type that includes status
interface OpenAIError extends Error {
  status?: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // --- Rate Limiting Check ---
    const { allowed, remaining } = await checkAndIncrementUsage(
      user.id,
      "transcribe"
    );
    console.log(`Remaining uses for user ${user.id}: ${remaining}`);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily transcription limit reached (${MAX_DAILY_TRANSCRIBE_USES} per day). Please try again tomorrow.`,
        },
        { status: 429 } // 429 Too Many Requests
      );
    }
    // --- End Rate Limiting Check ---

    const formData = await request.formData();
    const audioFile = formData.get("file");

    if (!(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log(
      "Received file:",
      audioFile.name,
      audioFile.type,
      audioFile.size
    );

    // Checking if file is too small (likely empty or corrupted)
    if (audioFile.size < 100) {
      return NextResponse.json(
        { error: "Audio file is too small or empty" },
        { status: 400 }
      );
    }

    try {
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      return NextResponse.json({ text: response.text });
    } catch (openaiError: unknown) {
      console.error("OpenAI API error:", openaiError);

      if (openaiError instanceof Error) {
        const openAIError = openaiError as OpenAIError;

        if (openAIError.status === 400) {
          return NextResponse.json(
            {
              error:
                "The audio file format is not supported or the file is corrupted",
            },
            { status: 400 }
          );
        } else if (openAIError.status === 413) {
          return NextResponse.json(
            { error: "The audio file is too large" },
            { status: 413 }
          );
        }

        return NextResponse.json(
          {
            error: openAIError.message || "Error processing audio with OpenAI",
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: "Unknown error during OpenAI API request" },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Error in transcription API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to transcribe audio" },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Unknown error in transcription API" },
        { status: 500 }
      );
    }
  }
}

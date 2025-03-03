import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("file") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Log file details for debugging
    console.log("Received file:", audioFile.name, audioFile.type, audioFile.size);

    // Check if file is too small (likely empty or corrupted)
    if (audioFile.size < 100) {
      return NextResponse.json({ error: "Audio file is too small or empty" }, { status: 400 });
    }

    try {
      const response = await openai.audio.transcriptions.create({
        file: new File([audioFile], audioFile.name, { type: "audio/webm" }),
        model: "whisper-1",
      });

      // try {
      //   const response = await openai.audio.transcriptions.create({
      //     file: audioFile,
      //     model: "whisper-1",
      //   });

      return NextResponse.json({ text: response.text });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);

      // Provide more specific error messages based on OpenAI error types
      if (openaiError.status === 400) {
        return NextResponse.json(
          { error: "The audio file format is not supported or the file is corrupted" },
          { status: 400 },
        );
      } else if (openaiError.status === 413) {
        return NextResponse.json({ error: "The audio file is too large" }, { status: 413 });
      }

      return NextResponse.json(
        { error: openaiError.message || "Error processing audio with OpenAI" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in transcription API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}

// Increase the maximum request body size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16mb",
    },
  },
};

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcription, outputFormat } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: "No transcription provided" }, { status: 400 });
    }

    const formatInstructions: Record<string, string> = {
      notes:
        "Convert this transcription into concise, well-organized notes with headings, bullet points, and highlighting key concepts.",
      transcript:
        "Format this as a clean, readable transcript with speaker labels if multiple speakers are detected.",
      list: "Convert this transcription into a structured list of action items, tasks, or key points.",
      summary:
        "Create a concise summary of the main points from this transcription in a few paragraphs.",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert assistant that converts voice transcriptions into well-formatted ${outputFormat}. ${formatInstructions[outputFormat]}`,
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      text: response.choices[0].message.content || "",
    });
  } catch (error: any) {
    console.error("Error in processing API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transcription" },
      { status: 500 },
    );
  }
}

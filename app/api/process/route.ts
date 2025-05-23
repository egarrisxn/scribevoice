import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/supabase/rate-limit";
import { MAX_DAILY_PROCESS_USES } from "@/lib/constants";

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
    const { allowed, remaining } = await checkAndIncrementUsage(user.id, "process");
    console.log(`Remaining uses for user ${user.id}: ${remaining}`);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily processing limit reached (${MAX_DAILY_PROCESS_USES} per day). Please try again tomorrow.`,
        },
        { status: 429 }, // 429 Too Many Requests
      );
    }
    // --- End Rate Limiting Check ---

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
  } catch (error: unknown) {
    console.error("Error in processing API:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to process transcription" },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { error: "Unknown error occurred while processing the transcription" },
        { status: 500 },
      );
    }
  }
}

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request: Request) {
//   try {
//     const { transcription, outputFormat } = await request.json();

//     if (!transcription) {
//       return NextResponse.json({ error: "No transcription provided" }, { status: 400 });
//     }

//     const formatInstructions: Record<string, string> = {
//       notes:
//         "Convert this transcription into concise, well-organized notes with headings, bullet points, and highlighting key concepts.",
//       transcript:
//         "Format this as a clean, readable transcript with speaker labels if multiple speakers are detected.",
//       list: "Convert this transcription into a structured list of action items, tasks, or key points.",
//       summary:
//         "Create a concise summary of the main points from this transcription in a few paragraphs.",
//     };

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert assistant that converts voice transcriptions into well-formatted ${outputFormat}. ${formatInstructions[outputFormat]}`,
//         },
//         {
//           role: "user",
//           content: transcription,
//         },
//       ],
//       temperature: 0.7,
//     });

//     return NextResponse.json({
//       text: response.choices[0].message.content || "",
//     });
//   } catch (error: unknown) {
//     console.error("Error in processing API:", error);

//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: error.message || "Failed to process transcription" },
//         { status: 500 },
//       );
//     } else {
//       return NextResponse.json(
//         { error: "Unknown error occurred while processing the transcription" },
//         { status: 500 },
//       );
//     }
//   }
// }

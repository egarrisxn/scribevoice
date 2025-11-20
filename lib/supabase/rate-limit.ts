import { createClient } from "@/lib/supabase/server";
import {
  MAX_DAILY_TRANSCRIBE_USES,
  MAX_DAILY_PROCESS_USES,
} from "@/lib/constants";

type UsageType = "transcribe" | "process";

export async function checkAndIncrementUsage(
  userId: string,
  usageType: UsageType
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: usage, error } = await supabase
    .from("scribevoice_daily_usage")
    .select("transcribe_count, process_count")
    .eq("user_id", userId)
    .eq("usage_date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows found"
    console.error("Error fetching user daily usage:", error);
    return { allowed: false, remaining: 0 }; // Treat as disallowed on DB error
  }

  let currentTranscribeCount = usage?.transcribe_count || 0;
  let currentProcessCount = usage?.process_count || 0;

  let allowed = false;
  let remaining = 0;
  const updateObject: { transcribe_count?: number; process_count?: number } =
    {};

  if (usageType === "transcribe") {
    if (currentTranscribeCount < MAX_DAILY_TRANSCRIBE_USES) {
      currentTranscribeCount++;
      updateObject.transcribe_count = currentTranscribeCount;
      allowed = true;
      remaining = MAX_DAILY_TRANSCRIBE_USES - currentTranscribeCount;
    } else {
      allowed = false;
      remaining = 0;
    }
  } else if (usageType === "process") {
    if (currentProcessCount < MAX_DAILY_PROCESS_USES) {
      currentProcessCount++;
      updateObject.process_count = currentProcessCount;
      allowed = true;
      remaining = MAX_DAILY_PROCESS_USES - currentProcessCount;
    } else {
      allowed = false;
      remaining = 0;
    }
  }

  if (allowed) {
    const { error: upsertError } = await supabase
      .from("scribevoice_daily_usage")
      .upsert(
        {
          user_id: userId,
          usage_date: today,
          transcribe_count: currentTranscribeCount,
          process_count: currentProcessCount,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: "user_id,usage_date", // Use the unique constraint for upsert
          ignoreDuplicates: false, // Ensure it updates if exists
        }
      );

    if (upsertError) {
      console.error("Error upserting user daily usage:", upsertError);
      return { allowed: false, remaining: 0 }; // Treat as disallowed on upsert error
    }
  }

  return { allowed, remaining };
}

// Function to fetch remaining uses for display in UI
export async function getRemainingUses(
  userId: string
): Promise<{ transcribeRemaining: number; processRemaining: number }> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: usage, error } = await supabase
    .from("scribevoice_daily_usage")
    .select("transcribe_count, process_count")
    .eq("user_id", userId)
    .eq("usage_date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows found"
    console.error("Error fetching remaining uses:", error);
    return { transcribeRemaining: 0, processRemaining: 0 }; // Return 0 on error
  }

  const currentTranscribeCount = usage?.transcribe_count || 0;
  const currentProcessCount = usage?.process_count || 0;

  return {
    transcribeRemaining: MAX_DAILY_TRANSCRIBE_USES - currentTranscribeCount,
    processRemaining: MAX_DAILY_PROCESS_USES - currentProcessCount,
  };
}

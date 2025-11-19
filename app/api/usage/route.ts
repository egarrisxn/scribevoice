import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRemainingUses } from "@/lib/supabase/rate-limit";

export async function GET(_req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcribeRemaining, processRemaining } = await getRemainingUses(
      user.id
    );
    return NextResponse.json({
      transcribeRemaining,
      processRemaining,
    });
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve usage data" },
      { status: 500 }
    );
  }
}

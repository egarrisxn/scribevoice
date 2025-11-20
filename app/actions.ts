"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function authWithGitHub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${siteUrl}/api/callback`,
    },
  });
  if (error) throw new Error(`Error signing in: ${error.message}`);
  if (data.url) {
    redirect(data.url);
  }
}

export async function authWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/api/callback`,
    },
  });
  if (error) throw new Error(`Error signing in: ${error.message}`);
  if (data.url) {
    redirect(data.url);
  }
}

export async function saveTranscription(transcription: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from("scribevoice_transcriptions").insert({
    user_id: user.id,
    transcription_text: transcription,
  });
  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function deleteTranscription(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("scribevoice_scribevoice_transcriptions")
    .delete()
    .eq("id", id);
  if (error)
    throw new Error(`Failed to delete transcription: ${error.message} `);
  revalidatePath("/dashboard");
}

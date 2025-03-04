"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

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

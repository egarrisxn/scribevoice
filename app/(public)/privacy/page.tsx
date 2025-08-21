import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "The Privacy Page for ScribeVoice.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-2 px-4">
      <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
      <p>
        This site uses JSON Web Tokens and a Key-Value database for sessions. Data provided to this
        site is exclusively used to support signing in and is not passed to any third party
        services, other than via SMTP or OAuth for the purposes of authentication.
      </p>
    </section>
  );
}

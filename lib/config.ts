import { siteUrl } from "@/lib/env";

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  twitterImage: string;
  socialHandle: string;
  links: {
    twitter: string;
    github: string;
    website: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "ScribeVoice",
  description: "Transform your voice into notes, transcripts, lists and more with the power of AI!",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image.png`,
  twitterImage: `${siteUrl}/twitter-image.png`,
  socialHandle: "@eg__xo",
  links: {
    twitter: "https://x.com/eg__xo",
    github: "https://github.com/egarrisxn",
    website: "https://egxo.dev",
  },
};

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scribevoice.vercel.app"),
  title: "ScribeVoice | AI Voice Transcription",
  description: "Transform your voice into notes, transcripts, lists and more with AI",
  applicationName: "ScribeVoice",
  referrer: "origin-when-cross-origin",
  creator: "https://egxo.dev",
  keywords: [
    "typesctipt",
    "javascript",
    "nextjs",
    "next15",
    "react",
    "tailwindcss",
    "shadcnui",
    "openai",
    "ai",
    "vercel",
  ],
  openGraph: {
    title: "ScribeVoice",
    description: "Transform your voice into notes, transcripts, lists and more with AI",
    url: "https://scribevoice.vercel.app",
    siteName: "ScribeVoice",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScribeVoice",
    description: "Transform your voice into notes, transcripts, lists and more with AI",
    creator: "@eg__xo",
    site: "@eg__xo",
  },
  appleWebApp: {
    capable: true,
    title: "ScribeVoice",
    startupImage: "https://scribevoice.vercel.app/opengraph-image.png",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  appLinks: {},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

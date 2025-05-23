import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/providers";
import { siteConfig } from "@/lib/config";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.links.website,
  referrer: "origin-when-cross-origin",
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
  icons: {
    icon: {
      url: "/icons/icon.png",
      sizes: "192x192",
      type: "image/png",
    },
    apple: {
      url: "/icons/apple-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    other: {
      rel: "icon",
      url: "/icons/icon.svg",
      type: "image/svg+xml",
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.socialHandle,
    site: siteConfig.socialHandle,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    startupImage: siteConfig.ogImage,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <SonnerToaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

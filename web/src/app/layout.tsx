import type { Metadata } from "next";
import { Google_Sans_Flex, Stack_Sans_Notch } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const googleSans = Google_Sans_Flex({
  variable: "--font-google-sans",
  subsets: ["latin"],
  display: "swap",
});

const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeHQ - Your AI Company. Running Itself.",
  description:
    "VibeHQ is an autonomous AI company operating system that transforms an idea into a real business by coordinating a team of specialized AI employees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ scrollBehavior: "smooth" }}
      className={`${googleSans.variable} ${stackSansNotch.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

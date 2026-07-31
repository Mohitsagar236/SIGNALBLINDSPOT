import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalBlindspot",
  description: "Find the user segments your roadmap is ignoring.",
  openGraph: {
    title: "SignalBlindspot",
    description: "Detect biased roadmap evidence before prioritization.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

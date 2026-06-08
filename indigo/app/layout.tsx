import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indigo — Wear What You Know",
  description:
    "Know what's in your clothes, who made them, and under what conditions — verified by third parties, not brand marketing.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Indigo",
  },
};

export const viewport: Viewport = {
  themeColor: "#18170F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen" style={{ background: "#18170F", color: "#EDE8DC" }}>
        {children}
      </body>
    </html>
  );
}

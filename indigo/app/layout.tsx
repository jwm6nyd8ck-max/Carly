import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indigo — Wear What You Know",
  description:
    "Scan clothing tags to get an ethical and sustainability score. Know what's in your clothes, who made them, and under what conditions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Indigo",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D1B69",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0F0A1E] text-[#F7F5FF] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

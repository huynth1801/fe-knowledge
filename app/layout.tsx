import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

// Styrene-like geometric sans (Anthropic's brand typeface)
const anthropicSans = Plus_Jakarta_Sans({
  variable: "--font-anthropic-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// Tiempos-like editorial serif (Claude's conversational & reading typeface)
const anthropicSerif = Newsreader({
  variable: "--font-anthropic-serif",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

// Clean code mono
const anthropicMono = JetBrains_Mono({
  variable: "--font-anthropic-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FE Visualizer | Claude-inspired Front-End Architecture",
  description: "Trực quan hóa cơ chế hoạt động Front-End với phong cách giao diện tối giản, thanh lịch của Anthropic Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${anthropicSans.variable} ${anthropicSerif.variable} ${anthropicMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[#F3CABE] selection:text-[#9A3412]">
        {children}
      </body>
    </html>
  );
}

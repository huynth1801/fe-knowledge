import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fe-visualizer.dev"),
  title: "FE Visualizer — Front-End Engine Visualizer for Web Developers",
  description:
    "Master the JavaScript Event Loop, React Fiber reconciliation, Closures, and CSS Stacking Context with interactive step-by-step browser runtime visual simulations.",
  keywords: [
    "front-end engine visualizer",
    "javascript event loop visualizer",
    "microtask macrotask queue",
    "react fiber reconciliation visualizer",
    "css stacking context 3d",
    "javascript closures heap scope",
    "core web vitals inp lcp cls",
    "nextjs rendering matrix ssr rsc",
    "frontend engineering mental models",
    "frontend interview preparation",
  ],
  authors: [{ name: "FE Visualizer Team" }],
  creator: "FE Visualizer",
  publisher: "FE Visualizer",
  applicationName: "FE Visualizer",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FE Visualizer — Front-End Engine Visualizer for Web Developers",
    description:
      "Master the JavaScript Event Loop, React Fiber reconciliation, Closures, and CSS Stacking Context with interactive step-by-step browser runtime visual simulations.",
    url: "https://fe-visualizer.dev",
    siteName: "FE Visualizer",
    images: [
      {
        url: "/share.jpg",
        width: 1200,
        height: 630,
        alt: "FE Visualizer Architecture Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FE Visualizer — Front-End Engine Visualizer for Web Developers",
    description:
      "Master the JavaScript Event Loop, React Fiber reconciliation, Closures, and CSS Stacking Context with interactive step-by-step browser runtime visual simulations.",
    images: ["/share.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "googlec788445a37e1d509",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://fe-visualizer.dev/#webapp",
      "name": "FE Visualizer",
      "url": "https://fe-visualizer.dev",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Interactive Front-End engine visualizer modeling JavaScript V8 Event Loop, React Fiber reconciliation, Closures, and CSS Stacking Contexts step-by-step.",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
    },
    {
      "@type": "Course",
      "@id": "https://fe-visualizer.dev/#course",
      "name": "Front-End Runtimes & Engine Internals",
      "description":
        "Deep interactive architectural course on JavaScript Event Loop, React Fiber reconciliation, Closures, and CSS Stacking Contexts.",
      "provider": {
        "@type": "Organization",
        "name": "FE Visualizer",
        "sameAs": "https://fe-visualizer.dev",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://fe-visualizer.dev/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is FE Visualizer used for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FE Visualizer is an educational workbench designed to model how browser engines and JavaScript runtimes execute code step-by-step. It helps engineers master asynchronous queues, React Fiber reconciliation, scope closures, and CSS stacking contexts by making runtime states visible.",
          },
        },
        {
          "@type": "Question",
          "name": "How accurate is the Event Loop simulation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The simulation strictly conforms to the HTML Living Standard specification and ECMAScript job queues. Call Stack frames, microtask draining, and macrotask dispatch execute with 100% deterministic fidelity.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use FE Visualizer to prepare for tech interviews?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The platform includes 33 interview scenarios ranging from Junior fundamentals to Senior concurrency bottlenecks, complete with architectural insights and interview explanations.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sand"
      data-buttons="solid"
      data-motion
      className={`${anthropicSans.variable} ${anthropicSerif.variable} ${anthropicMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="site-kind" content="software" />
        <meta name="page-type" content="software" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[#F3CABE] selection:text-[#9A3412]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: {
    default: "GTA VI Feedback Board - Community Gaming Platform",
    template: "%s | GTA VI Feedback Board",
  },
  description:
    "Join the ultimate GTA VI community feedback platform! Submit bug reports, request features, suggest gameplay improvements, and help shape the future of Grand Theft Auto VI. Vote on community suggestions and discuss with fellow gamers.",
  keywords: [
    "GTA VI",
    "Grand Theft Auto 6",
    "GTA 6",
    "feedback",
    "gaming community",
    "bug reports",
    "feature requests",
    "game development",
    "community platform",
    "gaming feedback",
    "Rockstar Games",
    "game improvement",
    "player suggestions",
    "gaming forum",
    "beta feedback",
  ],
  authors: [{ name: "GTA VI Community" }],
  creator: "GTA VI Feedback Board",
  publisher: "GTA VI Community Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gta6feedbackboard.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gta6feedbackboard.vercel.app",
    title: "GTA VI Feedback Board - Community Gaming Platform",
    description:
      "Join the ultimate GTA VI community feedback platform! Submit bug reports, request features, and help shape Grand Theft Auto VI.",
    siteName: "GTA VI Feedback Board",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GTA VI Feedback Board - Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA VI Feedback Board - Community Gaming Platform",
    description:
      "Join the ultimate GTA VI community feedback platform! Submit bug reports, request features, and help shape Grand Theft Auto VI.",
    images: ["/logo.png"],
    creator: "@GTAVIFeedback",
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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon",
      url: "/logo.png",
    },
  },
  manifest: "/manifest.json",
  category: "gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "GTA VI Feedback Board",
              description:
                "Community-driven feedback platform for Grand Theft Auto VI",
              url: "https://gta6feedbackboard.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://gta6feedbackboard.vercel.app/?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "GTA VI Community Platform",
              },
              audience: {
                "@type": "Audience",
                audienceType: "Gaming Community",
              },
              genre: ["Gaming", "Community Platform", "Feedback System"],
              keywords:
                "GTA VI, Grand Theft Auto 6, gaming feedback, community platform, bug reports, feature requests",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

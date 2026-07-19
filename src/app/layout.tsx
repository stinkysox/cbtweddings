import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cbtweddings.com'),
  title: "CBT Weddings | Luxury Wedding Storytelling",
  description: "CBT Weddings | Luxury Wedding Photography & Cinematic Storytelling. Capturing timeless wedding moments with artistic elegance globally.",
  keywords: "wedding photography, luxury wedding photographer, cinematic wedding films, destination wedding photographer, premium wedding stories",
  authors: [{ name: "CBT Weddings Artistry Archive" }],
  robots: "index, follow",
  verification: {
    google: "b0fe91c686917fde",
  },
  alternates: {
    canonical: "https://www.cbtweddings.com",
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "CBT Weddings | Luxury Wedding Storytelling",
    description: "CBT Weddings captures your luxury wedding moments with artistic storytelling and premium photography globally.",
    type: "website",
    url: "https://www.cbtweddings.com",
    siteName: "CBT Weddings",
    images: [
      {
        url: "/cbt-preview.webp",
        width: 1200,
        height: 800,
        alt: "CBT Weddings Luxury Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBT Weddings | Luxury Wedding Storytelling",
    description: "CBT Weddings captures your luxury wedding moments with artistic storytelling and premium photography.",
    images: ["/cbt-preview.webp"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#EAB308',
};

import { CustomCursor } from "../components/CustomCursor";
import { CookieConsent } from "../components/CookieConsent";
import { VinylPlayer } from "../components/VinylPlayer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CBT Weddings",
    "image": "https://www.cbtweddings.com/cbt-preview.webp",
    "@id": "https://www.cbtweddings.com",
    "url": "https://www.cbtweddings.com",
    "telephone": "+918800180670",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "B-66, First Floor, New Rajinder Nagar",
      "addressLocality": "New Delhi",
      "postalCode": "110060",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6389,
      "longitude": 77.1818
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/creativitybeyondthoughts/",
      "https://youtube.com",
      "https://pinterest.com"
    ]
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preload the social preview image so crawlers and share cards get it fast */}
        <link
          rel="preload"
          as="image"
          href="/cbt-preview.webp"
          fetchPriority="high"
        />
        {/* SVG favicon: black bg, white CBT text */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-yellow-600/30 font-sans`}
        suppressHydrationWarning
      >
        <VinylPlayer />
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}

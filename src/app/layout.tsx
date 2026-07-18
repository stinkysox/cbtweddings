import type { Metadata } from "next";
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
  metadataBase: new URL('https://weddingwit.vercel.app'),
  title: "Weddingwit | Luxury Wedding Storytelling",
  description: "Weddingwit | Luxury Wedding Photography & Cinematic Storytelling in Hyderabad. Capturing timeless wedding moments with artistic elegance globally.",
  keywords: "wedding photography Hyderabad, luxury wedding photographer, cinematic wedding films, destination wedding photographer India, premium wedding stories",
  authors: [{ name: "Weddingwit Artistry Archive" }],
  robots: "index, follow",
  verification: {
    google: "b0fe91c686917fde",
  },
  alternates: {
    canonical: "https://weddingwit.vercel.app",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#EAB308',
  manifest: '/manifest.json',
  openGraph: {
    title: "Weddingwit | Luxury Wedding Storytelling",
    description: "Weddingwit captures your luxury wedding moments with artistic storytelling and premium photography in Hyderabad and globally.",
    type: "website",
    url: "https://weddingwit.vercel.app",
    siteName: "Weddingwit",
    images: [
      {
        url: "https://i.pinimg.com/736x/a9/9a/d5/a99ad5c52f71c7d54a4d21d724d2e079.jpg",
        width: 1200,
        height: 630,
        alt: "Weddingwit Luxury Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weddingwit | Luxury Wedding Storytelling",
    description: "Weddingwit captures your luxury wedding moments with artistic storytelling and premium photography.",
    images: ["https://i.pinimg.com/736x/a9/9a/d5/a99ad5c52f71c7d54a4d21d724d2e079.jpg"],
  },
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
    "name": "Weddingwit",
    "image": "https://i.pinimg.com/736x/a9/9a/d5/a99ad5c52f71c7d54a4d21d724d2e079.jpg",
    "@id": "https://weddingwit.vercel.app",
    "url": "https://weddingwit.vercel.app",
    "telephone": "+914045678910",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jubilee Hills",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500033",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.43,
      "longitude": 78.40
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
      "https://instagram.com/weddingwit",
      "https://youtube.com/weddingwit",
      "https://pinterest.com/weddingwit"
    ]
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="icon"
          type="image/jpeg"
          href="https://i.pinimg.com/736x/ad/42/2d/ad422d9d993dfb6697b437b06dcd0cb3.jpg"
        />
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

import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import ClientProvider from "@/components/ClerkProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Bahaar Journey | Your Gateway to World Travel",
  description: "Discover amazing travel experiences across the globe with Globetrotter Haven. Explore cities like Istanbul, New York, and Lahore with our expert guides and tailored packages.",
  keywords: "travel, global travel, city tours, Istanbul, USA, Pakistan, travel packages",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.globetrotterhaven.com",
    title: "Globetrotter Haven | Your Gateway to World Travel",
    description: "Embark on unforgettable journeys with Globetrotter Haven. Explore iconic cities and hidden gems across the globe.",
    images: [
      {
        url: "https://www.globetrotterhaven.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Globetrotter Haven - World Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Globetrotter Haven | Your Gateway to World Travel",
    description: "Discover amazing travel experiences across the globe with Globetrotter Haven. Expert guides, tailored packages, unforgettable memories.",
    images: ["https://www.globetrotterhaven.com/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientProvider>
      <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${montserrat.variable} ${openSans.variable} font-sans`}>
        <NextSSRPlugin 
        
        routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="pt-16"> {/* Add padding-top to account for fixed header */}
            {children}
          </main>
          <footer>
            {/* Add footer content here */}
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClientProvider>
  );
}
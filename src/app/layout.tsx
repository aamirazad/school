import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "School projects home",
  description: "A collection of the mini projects I've worked on for school",
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased text-slate-100 bg-black ${geist.className}`}
      >
        <Script
          src="https://www.aamirazad.com/api/script.js"
          data-site-id="2"
          strategy="afterInteractive"
        />
        <div className="absolute top-0 left-0 mt-1 ml-2">
          <Link href="/">Back</Link>
        </div>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

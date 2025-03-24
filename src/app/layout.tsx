import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
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
        className={`${geist.className} antialiased text-slate-100 bg-black`}
      >
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

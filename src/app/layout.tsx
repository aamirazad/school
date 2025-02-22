import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "School projects home",
  description: "A collection of the mini projects I've worked on for school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${inter.className} antialiased`)}>
        <div className="absolute top-0 left-0 opacity-0">
          <Link href="/">Back</Link>
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}

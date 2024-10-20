import type { Metadata } from "next";
import Link from "next/link";
import { inter } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "School projects home",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="{`${inter.className} antialiased`} text-slate-100 bg-black">
        <div>
          <Link className="px-3" href="/">
            Back
          </Link>
        </div>
        <div className="flex flex-col p-14 justify-center items-center">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}

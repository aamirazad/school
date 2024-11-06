// src/app/threegurlsrunnin/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YMCA Yellow Shoelace Fundraiser",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-yellow-50 flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
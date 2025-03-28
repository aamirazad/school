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
  return children;
}

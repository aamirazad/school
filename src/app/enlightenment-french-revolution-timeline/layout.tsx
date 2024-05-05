import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enlightenentment/French Revolution Timeline",
  description: "How it happened and it's impacts",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}

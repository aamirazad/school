import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renaissance Image Collection",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="text-slate-100 bg-black">{children}</main>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Δ Chem",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}

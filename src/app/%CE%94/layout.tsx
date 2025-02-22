import { PageWrapper } from "@/components/page-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Δ Chem",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageWrapper className="text-slate-100 bg-black flex flex-col p-14 justify-center items-center">
      <main>{children}</main>
    </PageWrapper>
  );
}

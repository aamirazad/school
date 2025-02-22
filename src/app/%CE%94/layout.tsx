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
    <div className="text-slate-100 bg-black flex flex-col p-14 justify-center items-center">
      <main>{children}</main>
    </div>
  );
}

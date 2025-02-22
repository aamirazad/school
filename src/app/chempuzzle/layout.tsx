import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChemPuzzle",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-screen justify-center bg-white">
      <main>{children}</main>
    </div>
  );
}

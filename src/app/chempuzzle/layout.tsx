import type { Metadata } from "next";
import Script from "next/script";

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
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/contrib/mhchem.min.js"
        integrity="sha384-F2ptQFZqNJuqfGGl28mIXyQ5kXH48spn7rcoS0Y9psqIKAcZPLd1NzwFlm/bl1mH"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        defer={true}
      />
      <main>{children}</main>
    </div>
  );
}

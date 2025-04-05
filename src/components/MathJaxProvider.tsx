// components/MathJaxProvider.tsx
"use client";
import Script from "next/script";

export default function MathJaxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="mathjax-config" strategy="beforeInteractive">{`
        window.MathJax = {
          tex: {
              // inlineMath: [['$', '$'], ['\\(', '\\)']],
            packages: {'[+]': ['mhchem']}
          },
          loader: {load: ['[tex]/mhchem']},
        };
      `}</Script>
      <Script
        id="mathjax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}

import { MathJaxContext, MathJax } from "better-react-mathjax";

const mathJaxConfig = {
  loader: { load: ["[tex]/mhchem"] },
  tex: {
    packages: { "[+]": ["mhchem"] },
  },
};

export function ChemJax({
  children,
  inline = false,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <MathJax inline={inline}> {`\\(${children})`}</MathJax>
    </MathJaxContext>
  );
}

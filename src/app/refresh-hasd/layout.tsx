import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History Club Content Refresh",
  description: "Redeploy site to refresh History Club content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dark bg-gray-900 text-white">{children}</div>;
}

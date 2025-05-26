import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discord Webhook Sender",
  description: "Send messages and embeds to Discord via webhooks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className=" dark bg-gray-900 text-white">{children}</div>;
}

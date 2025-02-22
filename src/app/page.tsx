"use client";
import { PageWrapper } from "@/components/page-wrapper";
import Link from "next/link";

export default function Home() {
  const links = [
    {
      href: "/open-source",
      name: "Open Source",
    },
    {
      href: "/renaissance-image-collection",
      name: "Renaissance Image Collection",
    },
    {
      href: "/enlightenment-french-revolution-timeline",
      name: "Enlightenentment/French Revolution Timeline",
    },
    {
      href: "/%CE%94",
      name: "Δ Chem",
    },
    {
      href: "/threegurlsrunnin",
      name: "Donation Tracker",
    },
    {
      href: "/chempuzzle",
      name: "Chem Puzzle",
    },
  ];
  return (
    <PageWrapper className="text-slate-100 bg-black">
      <main>
        <h1 className="text-2xl p-6 font-bold items-center">Welcome</h1>
        <ul className="list-disc items-center text-slate-300">
          {links.map((data, index) => (
            <li key={index} className="hover:underline">
              <Link href={data.href}>{data.name}</Link>
            </li>
          ))}
        </ul>
      </main>
    </PageWrapper>
  );
}

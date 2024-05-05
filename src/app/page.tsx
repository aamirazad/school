"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col p-14 justify-center items-center text-slate-100 bg-black">
      <h1 className="text-2xl p-6 font-bold">Welcome</h1>
      <ul className="list-disc items-center text-slate-300">
        <li>
          <Link href="/renaissance-image-collection">
            Renaissance Image Collection
          </Link>
        </li>
        <li>
          <Link href="/enlightenment-french-revolution-timeline">
            Enlightenentment/French Revolution Timeline
          </Link>
        </li>
      </ul>
    </main>
  );
}

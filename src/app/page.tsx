"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col p-14 justify-center items-center">
      <h1 className="text-2xl p-6 font-bold">Welcome</h1>
      <ul className="list-disc items-center">
        <li>
          <Link
            className="text-slate-300 list-disc"
            href="/renaissance-image-collection"
          >
            Renaissance Image Collection
          </Link>
        </li>
      </ul>
    </div>
  );
}

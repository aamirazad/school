"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center p-24">
      <h1 className="">Welcome</h1>
      <ul>
        <li>
          <Link
            className="decoration-solid"
            href="/renaissance-image-collection"
          >
            Renaissance Image Collection
          </Link>
        </li>
      </ul>
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { imageData } from "./imageData";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex justify-center w-full animate-fadeIn">
      <div className="flex flex-col items-center justify-between px-24 pb-8 xl:w-3/4">
        <h1 className="pt-6 text-2xl h-12">{imageData[currentIndex].title}</h1>
        <Carousel onSlideChange={handleSlideChange}>
          <CarouselContent>
            {imageData.map((item, index) => (
              <CarouselItem key={index}>
                <figure className="flex flex-col items-center text-center py-8 w-32">
                  <div className="relative w-96 h-96">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN}${item.src}`}
                      alt={item.alt}
                      fill={true}
                      className="object-contain"
                      loading="eager"
                    />
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <figcaption className="text-lg px-16 text-slate-200 flex flex-col space-y-8">
          <div>{imageData[currentIndex].caption}</div>
          <div>
            <p>References:</p>
            {imageData[currentIndex].cite &&
              imageData[currentIndex].cite.map((url, index) => (
                <li key={index}>
                  <a target="_blank" className="underline" href={url}>
                    {url}
                  </a>
                </li>
              ))}
          </div>
        </figcaption>
      </div>
    </div>
  );
}

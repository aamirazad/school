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

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };
  return (
    <main className="flex flex-col items-center justify-between px-24 pb-8 max-w-5xl w-full text-sm">
        <h1 className="pt-6 px-24 text-2xl h-12">{imageData[currentIndex].title}</h1>
        <Carousel onSlideChange={handleSlideChange}>
          <CarouselContent>
            {imageData.map((item, index) => (
              <CarouselItem key={index}>
                <figure className="flex flex-col items-center text-center w-5/6 h-84 bg-red-300">
                  <div className="p-8">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="rounded-md"
                    />
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <figcaption className="text-lg px-16 py-1">
          {imageData[currentIndex].caption}
        </figcaption>
    </main>
  );
}

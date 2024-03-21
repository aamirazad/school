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
    <main className="px-24 py-8">
      <div className="max-w-5xl w-full text-sm">
        <h1 className="px-24 text-2xl">{imageData[currentIndex].title}</h1>
        <Carousel onSlideChange={handleSlideChange}>
          <CarouselContent>
            {imageData.map((item, index) => (
              <CarouselItem key={index}>
                <figure>
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
        <figcaption className="text-lg px-16">
          {imageData[currentIndex].caption}
        </figcaption>
      </div>
    </main>
  );
}

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
    <main className="flex min-h-screen flex-col items-center text-slate-100 bg-black justify-between px-24 pb-8">
      <div className="max-w-5xl w-full text-sm">
        <Carousel onSlideChange={handleSlideChange}>
          <CarouselContent>
            {imageData.map((item, index) => (
              <CarouselItem key={index}>
                <figure className="flex flex-col items-center text-center">
                  <div className="p-8 h-screen">
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
        <figcaption className="text-lg text-white p-16 prose">
          {imageData[currentIndex].caption}
        </figcaption>
      </div>
    </main>
  );
}

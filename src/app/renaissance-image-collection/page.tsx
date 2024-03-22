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
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-center justify-between px-24 pb-8  w-full">
        <h1 className="pt-6 text-2xl h-12">{imageData[currentIndex].title}</h1>
        <Carousel onSlideChange={handleSlideChange}>
          <CarouselContent>
            {imageData.map((item, index) => (
              <CarouselItem key={index}>
                <figure className="flex flex-col items-center text-center w-5/6">
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
        <figcaption className="text-lg px-16 text-slate-200">
          {imageData[currentIndex].caption}
        </figcaption>
      </div>
    </div>
  );
}

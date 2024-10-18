"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { imageData } from "./imageData";
import { useState, useEffect } from "react";
import { Suspense } from "react";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const [move, setMove] = useState(0);

  useEffect(() => {
    if (!move) {
      const storedIndex = localStorage.getItem("index");
      console.log("Stored index in localStorage:", storedIndex); // Check the raw value from localStorage
      let loadedIndex = Number(storedIndex) || 0;
      if (api) {
        console.log("moving", loadedIndex);
        api.scrollTo(loadedIndex);
        setMove(1);
      }
    }
  }, [move, api]);

  const handleSlideChange = (index: number) => {
    if (move) {
      localStorage.setItem("index", String(index));
      setCurrentIndex(index);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-grow justify-center w-full animate-fadeIn">
        <div className="flex flex-col items-center justify-between pb-8 w-3/4 xl:w-2/5">
          <h1 className="pt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {imageData[currentIndex].title}
          </h1>
          <Carousel
            className="w-5/6"
            setApi={setApi}
            onSlideChange={handleSlideChange}
          >
            <CarouselContent>
              {imageData.map((item, index) => (
                <CarouselItem key={index}>
                  <figure className="flex flex-col items-center text-center py-8 w-32">
                    <div className="relative w-96 h-96">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_CDN}${item.src}`}
                        alt={item.alt}
                        fill={true}
                        priority={index === 0 ? true : false}
                        sizes="384, 384"
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
          <figcaption className="leading-7 [&:not(:first-child)]:mt-6">
            <div>{imageData[currentIndex].caption}</div>
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
                References:
              </h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                {imageData[currentIndex].cite &&
                  imageData[currentIndex].cite.map((url, index) => (
                    <li key={index}>
                      <a target="_blank" href={url} className="underline">
                        {url}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </figcaption>
        </div>
      </div>
    </Suspense>
  );
}

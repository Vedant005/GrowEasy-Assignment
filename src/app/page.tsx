"use client";
import { useEffect, useState, useRef, JSX } from "react";
import Image from "next/image";
import { gsap } from "gsap";

type IntervalRef = ReturnType<typeof setInterval> | null;

const slides: string[] = [
  "/sale.png",
  "/stairs.jpg",
  "/kitchen.jpg",
  "/living.jpg",
  "/description.png",
];

export default function ImageCarousel(): JSX.Element {
  const [curr, setCurr] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<IntervalRef>(null);

  const [containerWidth, setContainerWidth] = useState<number>(750);
  const [slideWidth, setSlideWidth] = useState<number>(400);

  useEffect(() => {
    const updateSizes = () => {
      if (window.innerWidth < 640) {
        setContainerWidth(500);
        setSlideWidth(250);
      } else if (window.innerWidth < 1024) {
        setContainerWidth(600);
        setSlideWidth(350);
      } else {
        setContainerWidth(750);
        setSlideWidth(400);
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);

    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (curr < slides.length - 1) {
        intervalRef.current = setInterval(() => {
          setCurr((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
        }, 2000);
      } else {
        setIsPlaying(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (containerRef.current) {
      const position: number =
        -(curr * slideWidth) + (containerWidth / 2 - slideWidth / 2);

      if (containerRef.current == containerRef?.current?.children[0]) {
        gsap.to(containerRef.current, {
          x: 0,
          duration: 0.7,
        });
      }
      gsap.to(containerRef.current, {
        x: position,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [curr]);

  const goToSlide = (index: number): void => {
    setCurr(index);
  };

  const togglePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const getSlideOpacity = (index: number): number => {
    if (index === curr) return 1;

    // Last slide is in center - hide left slide
    if (curr === slides.length - 1 && index === curr - 1) return 0;

    // Normal opacity for side slides
    return 1;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="mx-auto relative overflow-hidden bg-white rounded-lg"
        style={{ width: `${containerWidth}px`, height: "400px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={containerRef}
            className="flex items-center"
            style={{
              position: "absolute",
              left: 0,
              width: `${slides.length * slideWidth}px`,
            }}
          >
            {slides.map((src, index) => (
              <div
                key={index}
                className="flex justify-center items-center"
                style={{
                  width: `${slideWidth}px`,
                  opacity: getSlideOpacity(index),
                  visibility:
                    getSlideOpacity(index) === 0 ? "hidden" : "visible",
                  transition:
                    "opacity 0.5s ease, transform 1s ease, visibility 1s ease",
                  transform: `scale(${index === curr ? 1 : 0.9})`,
                }}
              >
                <div className="w-full px-3">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    width={slideWidth - 30}
                    height={300}
                    className="rounded-lg "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" relative">
        <div className="  absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {slides.slice(1, 4).map((_, index) => {
            const slideIndex: number = index + 1;
            return (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-5 h-2 rounded-full transition-all duration-300 ${
                  curr === slideIndex ? "bg-black w-5" : "bg-gray-400"
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 flex items-center justify-center text-sm font-medium"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

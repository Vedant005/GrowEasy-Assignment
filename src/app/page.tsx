"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const slides = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image2.jpg",
];

export default function ImageCarousel() {
  const [curr, setCurr] = useState(0);
  const containerRef = useRef(null);

  const containerWidth = 750;
  const slideWidth = 400;
  const sideVisibleWidth = 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurr((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const position =
        -(curr * slideWidth) + (containerWidth / 2 - slideWidth / 2);

      gsap.to(containerRef.current, {
        x: position,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [curr]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurr(index);
  };

  return (
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
                opacity: index === curr ? 1 : 0.8,
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transform: `scale(${index === curr ? 1 : 0.9})`,
              }}
            >
              <div className="w-full px-3">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  width={slideWidth - 30}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.slice(1, 4).map((_, index) => {
          const slideIndex = index + 1;
          return (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                curr === slideIndex ? "bg-black w-6" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

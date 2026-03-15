import { useState, useEffect } from "react";

const SLIDE_DURATION_MS = 4500;

interface BackgroundSlideshowProps {
  images: string[];
  className?: string;
  overlay?: "dark" | "darker" | "light" | "none";
  children?: React.ReactNode;
}

export function BackgroundSlideshow({
  images,
  className = "",
  overlay = "dark",
  children,
}: BackgroundSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const overlayClass = {
    dark: "bg-black/50",
    darker: "bg-black/65",
    light: "bg-white/25",
    none: "",
  }[overlay];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Full-bleed background slides with crossfade + subtle zoom */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1000ms] ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        >
          <div
            className={`absolute -inset-[5%] bg-cover bg-center bg-no-repeat ${i === index ? "animate-ken-burns" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ))}

      {/* Gradient overlay for readability */}
      <div
        className={`absolute inset-0 ${overlayClass} bg-gradient-to-b from-transparent via-transparent to-black/60`}
        aria-hidden
      />

      {/* Progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="group flex flex-col items-center gap-1"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-1.5 bg-white/60 group-hover:bg-white/90"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress bar: fills over slide duration then resets */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20 overflow-hidden">
          <div
            key={index}
            className="h-full w-0 bg-primary origin-left"
            style={{
              animation: `slideProgress ${SLIDE_DURATION_MS}ms linear forwards`,
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}

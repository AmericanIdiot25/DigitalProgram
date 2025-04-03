
import { useRef, useState, useEffect } from "react";
import ZoomableImage from "./ZoomableImage";
import { galleryImages } from "@/data/galleryImages";

const Gallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchEnabled, setTouchEnabled] = useState(false);
  const [loadedImages, setLoadedImages] = useState<number[]>([0]);

  // Set up intersection observer to detect current image
  useEffect(() => {
    const options = {
      root: galleryRef.current,
      rootMargin: "0px",
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          setCurrentIndex(index);
          
          // Preload surrounding images
          const nextImages = [index - 1, index, index + 1, index + 2].filter(
            idx => idx >= 0 && idx < galleryImages.length && !loadedImages.includes(idx)
          );
          
          if (nextImages.length > 0) {
            setLoadedImages(prev => [...prev, ...nextImages]);
          }
        }
      });
    }, options);

    const slideElements = document.querySelectorAll(".gallery-slide");
    slideElements.forEach(slide => {
      observer.observe(slide);
    });

    return () => {
      slideElements.forEach(slide => {
        observer.unobserve(slide);
      });
    };
  }, [loadedImages]);

  // Scroll to image by index
  const scrollToImage = (index: number) => {
    if (galleryRef.current) {
      const slideElement = document.querySelector(`[data-index="${index}"]`);
      if (slideElement) {
        slideElement.scrollIntoView({
          behavior: "smooth",
          inline: "center"
        });
      }
    }
  };

  // Detect touch capability
  useEffect(() => {
    setTouchEnabled('ontouchstart' in window);
  }, []);

  // Add swipe gesture recognition
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        scrollToImage(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < galleryImages.length - 1) {
        scrollToImage(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  return (
    <div className="h-full w-full flex flex-col bg-gallery-bg">
      <div className="h-full relative">
        {/* Main gallery container */}
        <div
          ref={galleryRef}
          className="gallery-container h-full w-full flex items-center"
        >
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              data-index={index}
              className="gallery-slide h-full w-full flex-shrink-0 flex items-center justify-center"
            >
              {loadedImages.includes(index) && (
                <ZoomableImage
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center pointer-events-none">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

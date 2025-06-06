
import { useRef, useState, useEffect } from "react";
import ZoomableImage from "./ZoomableImage";
import { galleryImages } from "@/data/galleryImages";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const Gallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchEnabled, setTouchEnabled] = useState(false);
  const [loadedImages, setLoadedImages] = useState<number[]>([0]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [hasError, setHasError] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Set up intersection observer to detect current image
  useEffect(() => {
    if (!galleryRef.current) return;
    
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
  }, [loadedImages, galleryRef.current]);

  // Detect touch capability
  useEffect(() => {
    setTouchEnabled('ontouchstart' in window);
    
    // Debug information
    console.log("Gallery mounted:", {
      touchEnabled: 'ontouchstart' in window,
      galleryImages: galleryImages.length,
      isMobile,
      firstImagePath: galleryImages[0].src,
      baseURL: window.location.origin
    });

    // Check if images are accessible
    const checkFirstImage = () => {
      const img = new Image();
      img.onload = () => console.log("Test image loaded successfully");
      img.onerror = (e) => console.error("Test image failed to load:", e);
      img.src = galleryImages[0].src;
    };
    
    checkFirstImage();
  }, [isMobile]);

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

  // Handle image load errors
  const handleImageError = (index: number) => {
    console.error(`Error loading image ${index}, path: ${galleryImages[index].src}`);
    setHasError(true);
    setErrorMessages(prev => [...prev, `Failed to load image ${index+1}`]);
  };

  // Handle image load success
  const handleImageLoad = (index: number) => {
    console.log(`Image ${index} loaded successfully: ${galleryImages[index].src}`);
    setImagesLoaded(prev => ({...prev, [index]: true}));
  };

  return (
    <div className="h-full w-full flex flex-col bg-black">
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
              {loadedImages.includes(index) ? (
                <ZoomableImage
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              ) : (
                <Skeleton className="h-[80%] w-[80%]" />
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

        {/* Error message */}
        {hasError && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/80 text-white p-4 rounded-md max-w-[80%] text-center">
            <p>Error loading images. Please check:</p>
            <ul className="text-left text-sm mt-2">
              <li>• Images exist in public/images/</li>
              <li>• Filenames match page1.png, page2.png, etc.</li>
              <li>• Images are valid PNG files</li>
            </ul>
            {errorMessages.length > 0 && (
              <div className="mt-2 text-xs max-h-24 overflow-y-auto">
                {errorMessages.slice(0, 5).map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
                {errorMessages.length > 5 && <p>...and {errorMessages.length - 5} more errors</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

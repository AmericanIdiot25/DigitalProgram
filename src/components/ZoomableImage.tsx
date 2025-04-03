
import { useState, useRef, useEffect, TouchEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ZoomableImage = ({ src, alt, className }: ZoomableImageProps) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastDistanceRef = useRef<number | null>(null);
  const initialLoad = useRef(true);

  // Reset image position and scale when src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    lastPositionRef.current = { x: 0, y: 0 };
  }, [src]);

  // Double click/tap to reset
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    lastPositionRef.current = { x: 0, y: 0 };
  };

  // Handle touch start for panning
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && scale > 1) {
      setDragging(true);
      const touch = e.touches[0];
      startPositionRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Handle pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastDistanceRef.current = distance;
    }
  };

  // Handle touch move for panning and pinching
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && dragging && scale > 1) {
      e.stopPropagation();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPositionRef.current.x;
      const deltaY = touch.clientY - startPositionRef.current.y;
      
      setPosition({
        x: lastPositionRef.current.x + deltaX,
        y: lastPositionRef.current.y + deltaY,
      });
    } else if (e.touches.length === 2 && lastDistanceRef.current !== null) {
      e.stopPropagation();
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const deltaDistance = distance - lastDistanceRef.current;
      const newScale = Math.max(1, Math.min(5, scale + deltaDistance * 0.01));
      
      setScale(newScale);
      lastDistanceRef.current = distance;
    }
  };

  // Handle touch end for panning
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (dragging) {
      setDragging(false);
      if (e.touches.length === 0) {
        lastPositionRef.current = position;
      }
    }
    lastDistanceRef.current = null;
  };

  // Transform style for zooming and panning
  const transformStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: initialLoad.current ? 'none' : scale === 1 ? 'transform 0.3s ease-out' : 'none',
  };

  // Once the image has loaded for the first time, we can enable transitions
  const handleImageLoad = () => {
    initialLoad.current = false;
  };

  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center overflow-hidden",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        ref={imgRef}
        className="gallery-image-wrapper w-full h-full flex items-center justify-center"
        style={transformStyle}
      >
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain" 
          onLoad={handleImageLoad}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ZoomableImage;

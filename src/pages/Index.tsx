
import Gallery from "@/components/Gallery";
import { useEffect, useState } from "react";

const Index = () => {
  const [isReady, setIsReady] = useState(false);

  // Ensure proper viewport setup for mobile devices
  useEffect(() => {
    // Fix for iOS Safari - ensures content fills the screen properly
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      console.log("Viewport height set:", vh);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    console.log("Index page mounted: Setting viewport height");

    // Check that body and html are properly sized
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    
    // Short delay to ensure everything is loaded properly
    setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  return (
    <div 
      className="min-h-screen max-h-screen overflow-hidden bg-black" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {isReady && <Gallery />}
    </div>
  );
};

export default Index;

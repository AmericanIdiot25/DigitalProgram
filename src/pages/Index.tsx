
import Gallery from "@/components/Gallery";
import { useEffect } from "react";

const Index = () => {
  // Ensure proper viewport setup for mobile devices
  useEffect(() => {
    // Fix for iOS Safari - ensures content fills the screen properly
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    console.log("Index page mounted: Setting viewport height");

    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-black" 
         style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <Gallery />
    </div>
  );
};

export default Index;


import Gallery from "@/components/Gallery";
import { useEffect, useState } from "react";

const Index = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure proper viewport setup for mobile devices
  useEffect(() => {
    try {
      // Fix for iOS Safari - ensures content fills the screen properly
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        console.log("Viewport height set:", vh);
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      
      console.log("Index page mounted: Setting viewport height");
      console.log("Window location:", window.location.href);

      // Force critical styles that might be overridden
      document.documentElement.style.height = '100%';
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.backgroundColor = '#000000';
      
      // Check if root element exists and apply styles
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.style.height = '100%';
        rootElement.style.width = '100%';
        rootElement.style.overflow = 'hidden';
        rootElement.style.margin = '0';
        rootElement.style.padding = '0';
        rootElement.style.backgroundColor = '#000000';
      }
      
      // Short delay to ensure everything is loaded properly
      setTimeout(() => {
        setIsReady(true);
      }, 300);

      return () => window.removeEventListener('resize', setViewportHeight);
    } catch (err) {
      console.error("Error in Index component:", err);
      setError(`Initialization error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return (
    <div 
      className="min-h-screen max-h-screen overflow-hidden bg-black" 
      style={{ 
        height: 'calc(var(--vh, 1vh) * 100)',
        backgroundColor: '#000000',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-4 z-50">
          <div className="bg-red-900/80 p-4 rounded-md max-w-[90%]">
            <h3 className="font-bold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      {isReady && <Gallery />}
    </div>
  );
};

export default Index;

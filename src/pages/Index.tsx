
import Gallery from "@/components/Gallery";
import { useEffect, useState } from "react";

const Index = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Ensure proper viewport setup for mobile devices
  useEffect(() => {
    try {
      // Collect debug information
      const collectDebugInfo = () => {
        const location = window.location;
        const info = {
          href: location.href,
          origin: location.origin,
          pathname: location.pathname,
          hostname: location.hostname,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          documentElement: {
            clientWidth: document.documentElement.clientWidth,
            clientHeight: document.documentElement.clientHeight,
          }
        };
        
        console.log("Debug information:", info);
        setDebugInfo(JSON.stringify(info, null, 2));
      };
      
      collectDebugInfo();

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
      
      // Attempt to load a test image to verify paths
      const testImageLoad = () => {
        const img = new Image();
        img.onload = () => {
          console.log("Test image loaded successfully");
          // Short delay to ensure everything is loaded properly
          setTimeout(() => {
            setIsReady(true);
          }, 300);
        };
        img.onerror = (e) => {
          console.error("Test image failed to load:", e);
          setError(`Failed to load test image. Check browser console for details.`);
          
          // Try again with alternative path
          const altImg = new Image();
          const repoName = window.location.pathname.split('/').filter(Boolean)[0];
          const altPath = repoName ? `/${repoName}/images/page1.png` : '/images/page1.png';
          
          console.log(`Trying alternative path: ${altPath}`);
          
          altImg.onload = () => {
            console.log(`Alternative path ${altPath} worked!`);
            setIsReady(true);
            setError(null);
          };
          
          altImg.onerror = () => {
            console.error(`Alternative path ${altPath} also failed`);
            setError(`Failed to load images. Please check image paths and deployment settings.`);
          };
          
          altImg.src = altPath;
        };
        
        // First try the standard path
        img.src = '/images/page1.png';
        console.log("Attempting to load test image:", img.src);
      };
      
      testImageLoad();

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
            <div className="mt-4">
              <p className="font-bold text-xs mb-1">Debug Info:</p>
              <pre className="text-xs overflow-auto max-h-48 bg-black/50 p-2 rounded">
                {debugInfo}
              </pre>
            </div>
          </div>
        </div>
      )}
      {isReady && <Gallery />}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading gallery...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

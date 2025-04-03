
// Gallery images data
export const galleryImages = Array.from({ length: 24 }, (_, i) => {
  // Ensure the path is correct regardless of deployment environment
  const index = i + 1;
  
  // Function to determine the correct base path for images
  const getBasePath = () => {
    const location = window.location;
    
    // Debug information
    console.log("Location information:", {
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      hostname: location.hostname
    });
    
    // For GitHub Pages: determine repository name from the URL
    if (location.hostname.includes('github.io')) {
      // Extract repo name from pathname (usually the first segment after the username)
      const pathSegments = location.pathname.split('/').filter(Boolean);
      
      if (pathSegments.length > 0) {
        console.log(`GitHub Pages detected. Repo name: ${pathSegments[0]}`);
        return `/${pathSegments[0]}/`;
      }
    }
    
    // For local development or Lovable preview
    if (location.hostname === 'localhost' || 
        location.hostname === '127.0.0.1' || 
        location.hostname.includes('lovableproject.com')) {
      return '/';
    }
    
    // Fallback for other hosting scenarios
    // First check if we're at the root
    if (location.pathname === '/' || location.pathname === '') {
      return '/';
    }
    
    // If we're in a subdirectory, use that as base path
    const basePathMatch = location.pathname.match(/^(\/[^/]+)\//);
    if (basePathMatch) {
      console.log(`Using base path: ${basePathMatch[1]}/`);
      return `${basePathMatch[1]}/`;
    }
    
    // Last resort fallback
    console.log("Using fallback base path: /");
    return '/';
  };

  // Construct the image path
  const basePath = getBasePath();
  const imagePath = `${basePath}images/page${index}.png`;
  
  console.log(`Creating image path: ${imagePath}`);
  
  return {
    id: index,
    title: `Page ${index}`,
    src: imagePath
  };
});

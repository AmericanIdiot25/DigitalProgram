
// Gallery images data
export const galleryImages = Array.from({ length: 24 }, (_, i) => {
  // Ensure the path is correct regardless of deployment environment
  const index = i + 1;
  
  // Base path determination for GitHub Pages compatibility
  const getBasePath = () => {
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
    }
    
    // For GitHub Pages deployment - get the repository name from pathname
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      // If deployed to a repo (GitHub Pages), include the repo name in the path
      return `/${pathSegments[0]}/`;
    }
    
    // Fallback to root
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

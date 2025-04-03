
// Gallery images data
export const galleryImages = Array.from({ length: 24 }, (_, i) => {
  // Ensure the path is correct regardless of deployment environment
  const index = i + 1;
  return {
    id: index,
    title: `Page ${index}`,
    src: `${window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/'}images/page${index}.png`
  };
});

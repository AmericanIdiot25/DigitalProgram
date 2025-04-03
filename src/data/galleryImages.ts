
// Gallery images data
export const galleryImages = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Page ${i + 1}`,
  src: `/images/page${i + 1}.png`
}));

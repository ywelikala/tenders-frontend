// Simple favicon generator for Lanka Tender Portal
// This creates basic PNG favicons using HTML5 Canvas (for browser environments)

const generateFavicon = (size) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background circle (tender orange)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
  ctx.fill();

  // Document shape (white)
  ctx.fillStyle = 'white';
  const docWidth = size * 0.6;
  const docHeight = size * 0.7;
  const docX = (size - docWidth) / 2;
  const docY = size * 0.15;

  ctx.fillRect(docX, docY, docWidth, docHeight);

  // Document lines (orange)
  ctx.fillStyle = '#ea580c';
  const lineHeight = size * 0.04;
  const lineSpacing = size * 0.08;
  const lineX = docX + size * 0.08;
  const lineWidth = docWidth * 0.6;

  // Three horizontal lines
  ctx.fillRect(lineX, docY + lineSpacing * 1.5, lineWidth, lineHeight);
  ctx.fillRect(lineX, docY + lineSpacing * 2.5, lineWidth * 0.8, lineHeight);
  ctx.fillRect(lineX, docY + lineSpacing * 3.5, lineWidth * 0.6, lineHeight);

  // Seal/badge
  const sealRadius = size * 0.12;
  const sealX = size * 0.65;
  const sealY = size * 0.65;

  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius * 0.5, 0, 2 * Math.PI);
  ctx.fill();

  return canvas.toDataURL('image/png');
};

// Usage in browser console:
// generateFavicon(32) - returns base64 PNG data
// generateFavicon(16) - returns base64 PNG data

console.log('Favicon generator loaded. Use generateFavicon(size) to create favicons.');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = generateFavicon;
}
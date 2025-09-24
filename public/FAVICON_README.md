# Favicon Setup for Lanka Tender Portal

## Current Status
✅ **favicon.svg** - Modern SVG favicon (works in all modern browsers)
✅ **favicon.ico** - Legacy ICO favicon (fallback for older browsers)
✅ **site.webmanifest** - Web app manifest for PWA support

## Missing Files (Optional)
These files are referenced in the HTML but not critical for functionality:
- `favicon-16x16.png` (16x16 PNG)
- `favicon-32x32.png` (32x32 PNG)
- `apple-touch-icon.png` (180x180 PNG for iOS)

## How to Generate Missing Files

### Option 1: Online Generator (Recommended)
1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload the `logo.png` file
3. Follow the wizard to generate all sizes
4. Download and extract files to this directory

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# From logo.png, generate different sizes:
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 180x180 apple-touch-icon.png
```

### Option 3: Browser Developer Tools
1. Open browser developer console
2. Load `/scripts/generate-favicons.js`
3. Run `generateFavicon(32)` to get base64 data
4. Convert base64 to PNG file

## Design Guidelines
- **Primary Color**: #ea580c (Tender Orange)
- **Background**: White or transparent
- **Icon**: Document with seal (representing government tenders)
- **Style**: Clean, professional, government-appropriate

## Browser Support
- ✅ **SVG Favicon**: Chrome 37+, Firefox 41+, Safari 9+, Edge 79+
- ✅ **ICO Favicon**: All browsers (universal fallback)
- ✅ **Web Manifest**: Chrome 39+, Firefox 53+, Safari 11.1+

## Testing
Test favicon visibility across different browsers and devices:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Browser tabs and bookmarks
- PWA installation prompts
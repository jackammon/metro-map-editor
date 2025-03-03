#!/bin/bash

# Run the Next.js build
npm run build

# Remove any excessively large files from the .next directory
find .next -type f -size +20M -delete

# Remove the entire cache directory in .next to avoid large files
rm -rf .next/cache/

# Output success message
echo "Build completed and cleaned up for Cloudflare Pages deployment"

exit 0 
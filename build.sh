#!/bin/bash

# Run the Next.js build which now uses the 'export' output option
npm run build

# Next.js will now export to the 'out' directory, so we don't need to clean .next cache

# Copy the _redirects file to the out directory to ensure it's deployed
cp _redirects out/

# Output success message
echo "Build completed for Cloudflare Pages deployment (static export)"

exit 0 
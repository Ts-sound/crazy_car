#!/bin/bash
set -e

echo "🔨 Building Crazy Car..."
npm run build

echo "✅ Build complete!"
echo "📦 Output: dist/index.html"
ls -lh dist/index.html

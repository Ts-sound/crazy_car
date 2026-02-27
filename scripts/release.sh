#!/bin/bash
set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: ./scripts/release.sh <version>"
    echo "Example: ./scripts/release.sh v1.0.1"
    exit 1
fi

echo "🚀 Releasing $VERSION..."

# Run tests first
./scripts/test.sh

# Build
./scripts/build.sh

# Commit and tag
git add -A
git commit -m "chore: release $VERSION"
git tag -a "$VERSION" -m "Release $VERSION"

echo ""
echo "✅ Release $VERSION ready!"
echo "📌 Push with: git push origin main && git push origin $VERSION"

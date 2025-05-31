#!/bin/bash
set -e

echo "Running tests..."

# Test 1: Hugo builds without errors
echo "✓ Testing Hugo build..."
hugo --quiet || { echo "✗ Hugo build failed"; exit 1; }

# Test 2: Check key pages exist
echo "✓ Checking key pages..."
pages=(
    "public/index.html"
    "public/collection/index.html"
    "public/engineering/index.html"
    "public/filmmaking/index.html"
    "public/music/index.html"
    "public/live/index.html"
)

for page in "${pages[@]}"; do
    if [ ! -f "$page" ]; then
        echo "✗ Missing page: $page"
        exit 1
    fi
done

# Test 3: Check for common HTML issues
echo "✓ Checking HTML structure..."
# Check that all pages have proper structure
for page in "${pages[@]}"; do
    # Check for basic HTML structure
    grep -q "<html" "$page" || { echo "✗ Invalid HTML in $page"; exit 1; }
    grep -q "</html>" "$page" || { echo "✗ Unclosed HTML in $page"; exit 1; }
    grep -q "<head>" "$page" || { echo "✗ Missing head in $page"; exit 1; }
    grep -q "<body" "$page" || { echo "✗ Missing body in $page"; exit 1; }
done

# Test 4: Check music player exists on collection page
echo "✓ Checking music player..."
grep -q "music-player" "public/collection/index.html" || { echo "✗ Music player not found"; exit 1; }
grep -q "track-list" "public/collection/index.html" || { echo "✗ Track list not found"; exit 1; }

# Test 5: Check for broken internal links (basic)
echo "✓ Checking internal links..."
# This is a simple check - just ensures href paths exist
for page in "${pages[@]}"; do
    # Extract internal links (starting with / but not //)
    links=$(grep -o 'href="/[^"]*"' "$page" | sed 's/href="//;s/"$//' | grep -v "^//" | sort -u)
    for link in $links; do
        # Convert link to file path
        file_path="public${link}"
        # If it ends with /, add index.html
        [[ "$file_path" == */ ]] && file_path="${file_path}index.html"
        
        if [ ! -f "$file_path" ] && [ ! -d "${file_path%/index.html}" ]; then
            echo "✗ Broken link in $page: $link"
            exit 1
        fi
    done
done

echo ""
echo "✅ All tests passed!"
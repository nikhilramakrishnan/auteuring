#!/bin/bash
set -e

echo "=============================="
echo "   Running Hugo Site Tests    "
echo "=============================="
echo ""

# Test 1: Hugo builds without errors
echo "[1/5] Testing Hugo build..."
echo "  → Building site with Hugo..."
hugo --quiet || { echo "  ✗ Hugo build failed"; exit 1; }
echo "  ✓ Hugo build successful"
echo ""

# Test 2: Check key pages exist
echo "[2/5] Checking key pages..."
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
        echo "  ✗ Missing page: $page"
        exit 1
    fi
    echo "  ✓ Found: $page"
done
echo ""

# Test 3: Check for common HTML issues
echo "[3/5] Checking HTML structure..."
for page in "${pages[@]}"; do
    echo -n "  → Validating $(basename $(dirname $page))/$(basename $page)... "
    # Check for basic HTML structure
    grep -q "<html" "$page" || { echo "✗ Invalid HTML"; exit 1; }
    grep -q "</html>" "$page" || { echo "✗ Unclosed HTML"; exit 1; }
    grep -q "<head>" "$page" || { echo "✗ Missing <head>"; exit 1; }
    grep -q "<body" "$page" || { echo "✗ Missing <body>"; exit 1; }
    echo "✓"
done
echo ""

# Test 4: Check music player exists on collection page
echo "[4/5] Checking music player components..."
echo -n "  → Looking for music player... "
grep -q "music-player" "public/collection/index.html" || { echo "✗ Not found"; exit 1; }
echo "✓"
echo -n "  → Looking for track list... "
grep -q "track-list" "public/collection/index.html" || { echo "✗ Not found"; exit 1; }
echo "✓"
echo -n "  → Counting tracks... "
track_count=$(grep -c '<li class="track-item"' "public/collection/index.html" || true)
echo "✓ Found $track_count tracks"
echo ""

# Test 5: Check for broken internal links (basic)
echo "[5/5] Checking internal links..."
broken_links=0
total_links=0

for page in "${pages[@]}"; do
    page_name=$(basename $(dirname $page))/$(basename $page)
    [[ "$page_name" == "./index.html" ]] && page_name="index.html"
    
    # Extract internal links (starting with / but not //)
    links=$(grep -o 'href="/[^"]*"' "$page" 2>/dev/null | sed 's/href="//;s/"$//' | grep -v "^//" | sort -u || true)
    link_count=$(echo "$links" | grep -c . || true)
    
    if [ $link_count -gt 0 ]; then
        echo "  → Checking $link_count links in $page_name..."
        for link in $links; do
            total_links=$((total_links + 1))
            # Convert link to file path
            file_path="public${link}"
            # If it ends with /, add index.html
            [[ "$file_path" == */ ]] && file_path="${file_path}index.html"
            
            if [ ! -f "$file_path" ] && [ ! -d "${file_path%/index.html}" ]; then
                echo "    ✗ Broken link: $link"
                broken_links=$((broken_links + 1))
            fi
        done
    fi
done

if [ $broken_links -gt 0 ]; then
    echo ""
    echo "  ✗ Found $broken_links broken links out of $total_links total"
    exit 1
else
    echo "  ✓ All $total_links internal links are valid"
fi

echo ""
echo "=============================="
echo "✅ All tests passed!"
echo "=============================="
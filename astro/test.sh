#!/bin/bash
set -e

echo "=============================="
echo "   Astro Site Validation      "
echo "=============================="
echo ""

# Test 1: Type checking
echo "[1/6] Running type check..."
echo "  → Running astro check..."
npx astro check || { echo "  ✗ Type check failed"; exit 1; }
echo "  ✓ Type check passed"
echo ""

# Test 2: Linting
echo "[2/6] Running linter..."
echo "  → Running ESLint..."
npx eslint src/ --max-warnings 0 || { echo "  ✗ Linting failed"; exit 1; }
echo "  ✓ Linting passed"
echo ""

# Test 3: Security audit
echo "[3/6] Running security audit..."
echo "  → Checking for vulnerabilities..."
npm audit --audit-level=high || { echo "  ✗ Security vulnerabilities found"; exit 1; }
echo "  ✓ No high/critical vulnerabilities"
echo ""

# Test 4: Build
echo "[4/6] Building site..."
echo "  → Running astro build..."
npm run build --silent || { echo "  ✗ Build failed"; exit 1; }
echo "  ✓ Build successful"
echo ""

# Test 5: Check key pages exist
echo "[5/6] Checking key pages..."
pages=(
    "dist/index.html"
    "dist/collection/index.html"
    "dist/engineering/index.html"
    "dist/filmmaking/index.html"
    "dist/music/index.html"
    "dist/music/iyer/index.html"
    "dist/live/index.html"
)

for page in "${pages[@]}"; do
    if [ ! -f "$page" ]; then
        echo "  ✗ Missing page: $page"
        exit 1
    fi
    echo "  ✓ Found: $page"
done
echo ""

# Test 6: Validate HTML and check components
echo "[6/6] Validating HTML structure..."

# Check HTML structure
for page in "${pages[@]}"; do
    page_name=$(basename $(dirname $page))/$(basename $page)
    echo -n "  → Validating $page_name... "
    grep -q "<!DOCTYPE html>" "$page" || { echo "✗ Missing DOCTYPE"; exit 1; }
    grep -q "<html" "$page" || { echo "✗ Invalid HTML"; exit 1; }
    grep -q "</html>" "$page" || { echo "✗ Unclosed HTML"; exit 1; }
    echo "✓"
done

# Check music player on collection page
echo -n "  → Checking music player... "
grep -q "music-player" "dist/collection/index.html" || { echo "✗ Music player not found"; exit 1; }
echo "✓"

echo -n "  → Checking track list... "
grep -q "track-list" "dist/collection/index.html" || { echo "✗ Track list not found"; exit 1; }
echo "✓"

echo -n "  → Counting tracks... "
track_count=$(grep -c 'class="track-item"' "dist/collection/index.html" || true)
echo "✓ Found $track_count tracks"

# Check theme toggle exists
echo -n "  → Checking theme toggle... "
grep -q "theme-toggle" "dist/index.html" || { echo "✗ Theme toggle not found"; exit 1; }
echo "✓"

# Check for broken internal links
echo ""
echo "  → Checking internal links..."
broken_links=0
total_links=0

for page in "${pages[@]}"; do
    links=$(grep -oE 'href="/[^"]*"' "$page" 2>/dev/null | sed 's/href="//;s/"$//' | grep -v "^//" | sort -u || true)

    for link in $links; do
        total_links=$((total_links + 1))
        file_path="dist${link}"
        [[ "$file_path" == */ ]] && file_path="${file_path}index.html"
        [[ "$file_path" != *.* ]] && file_path="${file_path}/index.html"

        if [ ! -f "$file_path" ] && [ ! -d "${file_path%/index.html}" ]; then
            echo "    ✗ Broken link in $(basename $page): $link"
            broken_links=$((broken_links + 1))
        fi
    done
done

if [ $broken_links -gt 0 ]; then
    echo "  ✗ Found $broken_links broken links out of $total_links total"
    exit 1
else
    echo "  ✓ All $total_links internal links are valid"
fi

echo ""
echo "=============================="
echo "✅ All validation checks passed!"
echo "=============================="

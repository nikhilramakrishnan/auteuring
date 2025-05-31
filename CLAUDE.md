# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site using the hugo-book theme. The site contains documentation organized into these main sections:
- Engineering
- Filmmaking  
- Music (with subsection on Iyer)
- Live (streaming content)
- Collection (music player with tracks)

## Common Commands

```bash
# Start development server
hugo server -D

# Build the site
hugo

# Build with drafts included
hugo -D

# Run tests
./test.sh
```

## Site Structure

- `content/` - All markdown content files organized by section
- `themes/hugo-book/` - The hugo-book theme (vendored)
- `public/` - Generated static site output (git-ignored)
- `hugo.toml` - Main Hugo configuration file
- `layouts/` - Custom layout overrides
- `assets/` - Custom SCSS files
- `.github/workflows/` - GitHub Actions for automated testing
- `test.sh` - Test script that verifies builds and checks for broken links

## Theme Customizations

### Dark Mode
- Terminal-inspired dark theme with jet black background (#000000)
- Cool gray text (#e0e0e0)
- Green links (#00ff88) for all link states
- Theme toggle available (sun/moon icon)
- Preference saved in sessionStorage (resets on browser close)

### Music Player (Collection Page)
- Custom music player with track list
- Features: play/pause, prev/next, progress bar, download
- Active track highlighted in blue (light mode) or green (dark mode)
- SVG icons for controls
- Mobile responsive design

### Custom Overrides
- `layouts/partials/docs/header.html` - Mobile header with theme toggle
- `layouts/partials/docs/brand.html` - Sidebar brand with theme toggle
- `layouts/partials/docs/inject/body.html` - Theme switching JavaScript
- `assets/_custom.scss` - Dark mode overrides and custom styles

## Content Organization

Content follows Hugo's standard structure:
- `_index.md` files define section landing pages
- Regular `.md` files are individual pages
- Sections can be nested (e.g., `content/music/iyer/`)

## Style Guide

- Use lowercase for all titles and headings throughout the site
- Keep content minimal and concise
- No focus outlines on buttons (removed for cleaner UI)
- Terminal aesthetic in dark mode
- Clean, minimal design in light mode

## Testing

- GitHub Actions runs on every push to main
- Tests verify Hugo builds successfully
- Checks that all main pages generate
- Verifies music player components exist
- Basic internal link checking
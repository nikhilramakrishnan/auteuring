# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is an Astro 5 static site with Tailwind CSS 4. The site contains documentation/content organized into these main sections:
- Engineering
- Filmmaking
- Music (with subsection on Iyer)
- Live (streaming content)
- Collection (music player with tracks)

## Common Commands

```bash
# Start development server
npm run dev

# Build the site
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Run Playwright tests
npm run test
npm run test:ui

# Full validation (type check, lint, security audit, build, tests)
./test.sh
```

## Site Structure

- `src/pages/` - Astro pages (file-based routing)
- `src/components/` - Reusable Astro/UI components
- `src/layouts/` - Page layout templates
- `src/content/` - Content collections
- `src/styles/` - Global CSS/Tailwind styles
- `public/` - Static assets (copied as-is to dist)
- `dist/` - Generated static site output (git-ignored)
- `tests/` - Playwright e2e tests
- `astro.config.mjs` - Astro configuration

## Key Features

### Music Player (Collection Page)
- Custom music player with track list
- Features: play/pause, prev/next, progress bar, download
- Components use `music-player`, `track-list`, `track-item` classes
- Active track highlighting

### Theme Toggle
- Light/dark mode toggle
- Uses `theme-toggle` class

## Tech Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **Type Checking**: TypeScript + astro check
- **Linting**: ESLint with astro plugin
- **Formatting**: Prettier with astro plugin
- **Testing**: Playwright

## Style Guide

- Use lowercase for all titles and headings
- Keep content minimal and concise
- Follow existing component patterns

## Testing

- `./test.sh` runs full validation suite:
  1. Type checking (astro check)
  2. Linting (ESLint)
  3. Security audit (npm audit)
  4. Build verification
  5. Key pages existence check
  6. HTML structure validation
  7. Component presence checks
  8. Internal link validation

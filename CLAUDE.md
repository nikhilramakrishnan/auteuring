# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site using the hugo-book theme. The site contains documentation organized into three main sections:
- Engineering
- Filmmaking  
- Music (with subsection on Iyer)

## Common Commands

```bash
# Start development server
hugo server -D

# Build the site
hugo

# Build with drafts included
hugo -D
```

## Site Structure

- `content/` - All markdown content files organized by section
- `themes/hugo-book/` - The hugo-book theme (appears to be vendored)
- `public/` - Generated static site output (git-ignored)
- `hugo.toml` - Main Hugo configuration file

## Content Organization

Content follows Hugo's standard structure:
- `_index.md` files define section landing pages
- Regular `.md` files are individual pages
- Sections can be nested (e.g., `content/docs/music/iyer/`)
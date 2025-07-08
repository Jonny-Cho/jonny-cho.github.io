# CLAUDE.md - Technical Blog Development Guide

## Project Overview

This is a personal technical blog built with Gatsby, focused on sharing backend development experiences and knowledge.

### Tech Stack
- **Framework**: Gatsby v5.14.5
- **Language**: JavaScript, React
- **Styling**: SCSS (gatsby-plugin-sass)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

### Key Features
- Responsive design
- Dark mode support
- Automatic Table of Contents (TOC) generation
- Category-based post classification
- Real-time search functionality
- SEO optimization

## Project Structure

```
jonny-cho.github.io/
├── content/              # Blog post markdown files
│   ├── devops/
│   ├── git/
│   ├── kotlin/
│   └── productivity/
├── src/
│   ├── components/       # React components
│   │   ├── page-header/
│   │   ├── post-header/
│   │   ├── post-content/
│   │   ├── table-of-contents/  # Automatic TOC component
│   │   └── ...
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   └── templates/       # Page templates
├── static/              # Static files
└── gatsby-config.js     # Gatsby configuration
```

## Core Features Details

### 1. Automatic Table of Contents (TOC)
- Automatically extracts headings (h1-h4) from blog posts
- Highlights current section on scroll
- Automatically hidden below 1400px viewport width
- Can be disabled with `toc: false` in frontmatter

### 2. Dark Mode
- Implemented with ThemeSwitch component
- User preference saved in localStorage
- Theme switching using CSS variables

### 3. Category System
- Categories organized by subdirectories in content folder
- Category-based filtering functionality
- Multiple categories support (space-separated)

### 4. Search Feature
- Real-time post title and category search
- Implemented with SearchModal component
- Keyboard navigation support

## Development Guidelines

### Code Style
- Indentation: 2 spaces
- Semicolons: Required
- Quotes: Single quotes
- Component names: PascalCase
- File names: kebab-case

### Commit Message Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code formatting, missing semicolons, etc.
refactor: Code refactoring
test: Test code
chore: Build tasks, package manager updates, etc.
```

### Branch Strategy
- main: Production deployment branch
- feature/*: Feature development branches
- fix/*: Bug fix branches

## Build and Deployment

### Local Development
```bash
# Run development server
npm run develop

# Build
npm run build

# Serve built files locally
npm run serve

# Clean
npm run clean
```

### Automatic Deployment
- Push to main branch triggers automatic build and deploy via GitHub Actions
- Workflow defined in `.github/workflows/deploy.yml`

## Content Writing Guide

### Post File Structure
```markdown
---
title: 'Post Title'
date: 2025-07-07 10:00:00
categories: kotlin spring
draft: false
tags: ['tag1', 'tag2']
toc: true  # Show table of contents (default: true)
---

Post content...
```

### Required Frontmatter Fields
- title: Post title
- date: Creation date (YYYY-MM-DD HH:MM:SS)
- categories: Categories (space-separated)
- draft: Draft status (true/false)

### Image Usage
```markdown
![Alt text](./images/image-name.png)
```
- Images should be stored in images folder in the same directory as the post
- gatsby-remark-images automatically optimizes images

## Common Commands

### Development
```bash
# Run development server (http://localhost:8000)
npm run develop

# GraphQL explorer (http://localhost:8000/___graphql)
npm run develop
```

### Build and Test
```bash
# Production build
npm run build

# Test built site locally (http://localhost:9000)
npm run serve

# Clean cache and build files
npm run clean
```

### Post Creation
```bash
# Create new post (manual)
# Create file in format: content/[category]/YYYY-MM-DD-title.md
```

## Troubleshooting

### Build Errors
1. Run `npm run clean` and rebuild
2. Delete node_modules and run `npm install`
3. Check plugin configuration in gatsby-config.js

### Images Not Displaying
1. Verify image path is relative
2. Check image filename has no special characters
3. Confirm gatsby-remark-images plugin is enabled

### TOC Not Showing
1. Verify post has headings (h1-h4)
2. Check frontmatter doesn't have `toc: false`
3. Confirm viewport width is above 1400px

## Important Notes for AI Assistant

### When Making Changes
- Always use semantic commit messages
- Test locally before suggesting deployment
- Maintain consistent code style
- Consider mobile responsiveness
- **IMPORTANT**: Never include "Claude" or AI-related references in commit messages or code comments
- **When user mentions deployment**: "배포해", "반영해", "반영해줘", "배포" and similar phrases mean to commit and push changes to the repository

### Blog Content in Korean
- Blog posts are written in Korean
- Use Korean-appropriate typography settings
- Consider Korean text wrapping with `word-break: keep-all`
- **When creating new posts**: Always write content in Korean, not English
- **When communicating with the user**: Always respond and explain in Korean

### Performance Considerations
- Images are automatically optimized by gatsby-remark-images
- Use lazy loading for components when appropriate
- Minimize bundle size by removing unused dependencies

## Reference Links
- [Gatsby Official Docs](https://www.gatsbyjs.com/docs/)
- [GitHub Repository](https://github.com/Jonny-Cho/jonny-cho.github.io)
- [Blog URL](https://jonny-cho.github.io)
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**side-panel-gemini** is a Chrome extension that integrates Google Gemini into the browser's side panel. Built with the Plasmo framework and implemented using React + TypeScript.

## Directory Structure

- `src/`: Source code for the Chrome extension
  - `background.ts`: Background script managing side panel behavior
  - `tabs/panel.tsx`: Main side panel UI (registration state, screenshot feature, Gemini iframe)
  - `tabs/RegistrationForm.tsx`: Initial registration form component
  - `contents/gemini.ts`: Content script injected into Gemini page (focus and image paste)
  - `assets/rules.json`: declarativeNetRequest rules to enable iframe embedding
  - `manifest.json`: Extension manifest (defined in `package.json`)
- `docs/`: Documentation files
  - `README.en.md`: English README
  - `RELEASE_BODY.md`: Release notes template (in Japanese)

## Development Commands

### Build and Package
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Package for Chrome Web Store
npm run package
```

### Code Quality Check
```bash
# Lint and format check with Biome
npm run check
```

## Architecture

### Key Components

- **background.ts**: Extension background script managing side panel behavior configuration
- **tabs/panel.tsx**: Main side panel UI handling registration state, screenshot functionality, and Gemini iframe display
- **tabs/RegistrationForm.tsx**: Registration form component for first-time users
- **contents/gemini.ts**: Content script injected into Gemini page implementing input focus and image paste functionality

### Data Flow

1. User clicks screenshot button (panel.tsx)
2. panel.tsx captures screenshot using chrome.tabs API
3. Message sent to contents/gemini.ts
4. gemini.ts manipulates Gemini DOM to paste the image

### Security Configuration

`src/assets/rules.json` uses the declarativeNetRequest API to remove X-Frame-Options and CSP headers from Gemini and Google account pages, enabling iframe embedding.

## Plasmo Framework

This project uses Plasmo:
- `~` prefix references the `src/` directory (e.g., `~tabs/panel.tsx`)
- `url:` prefix imports assets (e.g., `url:../assets/corporate.png`)
- TypeScript configuration extends `plasmo/templates/tsconfig.base`

## Coding Conventions

### Style
- **Formatter**: Biome
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Line width**: 100 characters

### Git Workflow
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
  - Format: `<type>: <description>`
  - Common types: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `chore` (maintenance/tooling), `refactor` (code restructuring)
  - Examples: `feat: Add screenshot button`, `fix: Resolve paste issue`
- **Frequency**: Commit after completing tasks and push changes to remote

### Documentation Synchronization
- When `README.md` is updated, **must also update** `docs/README.en.md` to ensure content consistency
- The AI agent is responsible for translating and verifying the changes manually

## Release Process

**Automated Workflow**: The release process is triggered by a slash command. When performing a release, **must ensure** that a descriptive release note in Japanese is written in `docs/RELEASE_BODY.md`.

1. **Analyze Changes**: Review commits since the last release tag to understand scope of changes
2. **Determine Version**: Select appropriate Semantic Version increment (Major, Minor, or Patch) based on analysis
3. **Update Version**: Update the `version` field in `package.json`
4. **Write Release Notes**: Write release notes in Japanese in `docs/RELEASE_BODY.md`
5. **Commit Changes**: Commit the version bump and release notes
6. **Create Git Tag**: Create a git tag (e.g., `v2.2.0`)
7. **Push Tag**: Push the tag to remote repository to trigger GitHub Actions automated release workflow

## Development Notes

- Gemini DOM structure may change, so `contents/gemini.ts` selectors should have multiple fallbacks for flexibility
- Chrome extension permissions are defined in manifest; when changing, update the `manifest` section in `package.json`
- User registration information is stored in `chrome.storage.local` (REGISTRATION_KEY, USER_DATA_KEY)

# Repository Guidelines

This frontend is a WeChat mini‑program for the SUSTech Football platform. Use the guidelines below when working in this repo.

## Project Structure & Module Organization

- App root: `wechat-miniprogram/`
- Pages: `wechat-miniprogram/pages/` (feature folders like `home/`, `management/`, `profile_player/`)
- Components: `wechat-miniprogram/components/` (cards and reusable UI)
- Assets: `wechat-miniprogram/assets/`
- Utilities: `wechat-miniprogram/utils/`
- Docs: `docs/` and design materials in `materials/`

## Build, Test, and Development Commands

- Open `wechat-miniprogram/project.config.json` in WeChat DevTools to run locally.
- For API calls, the base URL is configured in `wechat-miniprogram/app.js` (e.g., `globalData.URL`).

## Coding Style & Naming Conventions

- JavaScript uses 2‑space indentation.
- WXML/WXSS follow WeChat conventions; component folder names and tags use kebab‑case (e.g., `match-card-big`).
- Keep page logic in `*.js`, view in `*.wxml`, and styles in `*.wxss`. Avoid cross‑page imports.

## Testing Guidelines

- No automated test suite is present. Validate changes in WeChat DevTools.
- For UI changes, verify on at least one small and one large device profile.

## Commit & Pull Request Guidelines

- Commit messages typically use `[update]`, `[add]`, `[fix]` with a short description.
- PRs should include screenshots for visual changes and list affected pages/components.

## Security & Configuration Tips

- Secrets/keys (e.g., `wx_AppSecret`, `private.*.key`) live under `wechat-miniprogram`; never expose them in issues or PRs.

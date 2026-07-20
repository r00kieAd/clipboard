# Web Clipboard

A responsive React, TypeScript, and Vite clipboard app.

## Features

- Save text notes locally in app state
- Copy the current note to the system clipboard
- Load and delete saved notes from history
- Light and dark themes
- Responsive sidebar with a mobile drawer

## Project Structure

Application code lives in `src/clipboard_files`.

Key folders:

- `app`: app composition
- `features/clipboard`: clipboard state, services, hooks, and components
- `styles`: SCSS variables, themes, reset, mixins, and globals

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Notes

The backend is not implemented. Clipboard API calls are routed through `clipboardService.ts` so a real backend can be added later.

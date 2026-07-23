# Web Clipboard

A responsive clipboard notes app built with React, TypeScript, Vite, and SCSS.

## Features

- Create notes with a name, content, and format type
- Supported formats: plain text, markdown, and code
- Save, copy, open, update, and delete notes
- Saved history with date and time
- Light and dark themes
- Mobile drawer sidebar
- Passcode protection for opening, editing, and deleting protected notes
- Email OTP verification for new notes and passcode reset

## Sync

The app uses `VITE_CLIPBOARD_API_URL` when configured for cross-device sync.

Expected API routes:

- `GET /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `POST /otp/send`
- `POST /otp/verify`

Without an API URL, notes are saved in browser storage and stay on that device only.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

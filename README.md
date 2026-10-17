# Zareqia-inspired Wedding Invitation

A completely separate React + Vite visual prototype. It does not depend on, merge with, or modify the existing Invitation repository.

## Requirements
- Node.js 18+ (Node.js 20+ recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Current prototype features
- Cinematic two-door opening with reduced-motion support
- Editorial ivory, deep green and antique-gold invitation design
- Hero, story, countdown, events, family, gallery, venue, RSVP preview and footer
- Responsive navigation and mobile layout
- Scroll-reveal animations
- RSVP form interaction (preview only; no server persistence)
- Music toggle is a UI preview only; no audio file is bundled yet

## Customization
The demo content is in `src/App.jsx` in the `wedding` object. Replace the sample names, date, venue, events and story with your real invitation content. Gallery photos currently use remote Unsplash image URLs.

## Scope note
This is the first visual milestone. No backend, database, authentication, invitation builder, or actual RSVP delivery is included yet.

# CareerMapper — Frontend

A career intelligence platform: upload a resume (or enter skills manually) →
see your detected domain and career matches → understand why each match was
made → see the skill gaps → follow a learning roadmap.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- React Router for the multi-page flow
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  types/          Domain types — the contract the real backend must satisfy
  services/
    api.ts         The ONLY file that should know mock vs. real backend
    mockData.ts     Phase 1-8 placeholder data (delete at Phase 10)
  components/      Reusable UI: Navbar, Footer, Button, cards, states, etc.
  pages/           One file per route (Landing, Upload, Dashboard, ...)
  hooks/           useInView (scroll-reveal)
```

## Connecting the real backend (Phase 9)

1. Open `src/services/api.ts`.
2. Set `USE_MOCKS = false`.
3. Replace each function body with a real `fetch()` call against your API,
   keeping the same `ApiResult<T>` return shape (`success` / `error` / `empty`).
4. No component code needs to change — every page already renders loading,
   error and empty states from the `ApiResult` envelope.

## Removing sample data (Phase 10)

Delete `src/services/mockData.ts` and the `import { mock } from './mockData'`
line in `src/services/api.ts` once every endpoint is live.

## Design system

Colors, type scale and spacing are defined as Tailwind theme extensions in
`tailwind.config.js`: warm mint-white background, emerald primary, and
dedicated semantic colors (green = strong match, amber = skill gap,
violet = advanced/expert, blue = domain/info). Type pairs Fraunces
(display) with IBM Plex Sans (body) and IBM Plex Mono (scores/data).

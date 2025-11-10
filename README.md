# Portfolio SPA

This Vite + React + TypeScript portfolio highlights marketing, design, and development work with rich storytelling and motion. Tailwind CSS powers the visual system alongside Framer Motion for subtle transitions.

## Key Sections
- **Reception** – Hero introduction with CTAs.

- **Background & Skills** – Career timeline and capability deep dive.
- **Projects** – Spotlight on selected builds and experiments.
- **Contact & Extras** – EmailJS contact form, GitHub insights, and a retro mini-game.

## Campaign Assets
Campaign data lives in [`src/data/campaigns.ts`](src/data/campaigns.ts). Each entry references media in `/public/assets/campaigns/<slug>/` with the following rules:

- 9:16 aspect ratio only (1080 × 1920) for both videos and images.

- Provide descriptive `alt` text and 3–6 KPI badges per campaign.
- Optional case-study PDFs belong in `/public/assets/case-studies/`.



## Development
```bash
npm install
npm run dev
```

Run ESLint and TypeScript checks before submitting changes:
```bash
npm run lint
npm run typecheck
```

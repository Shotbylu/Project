# Portfolio SPA

This Vite + React + TypeScript portfolio highlights marketing, design, and development work with rich storytelling and motion. Tailwind CSS powers the visual system alongside Framer Motion for subtle transitions.

## Key Sections
- **Reception** – Hero introduction with CTAs.
- **Campaigns** – Filterable gallery of full-funnel campaign case studies with 9:16 media, KPI badges, and an immersive modal experience.
- **Background & Skills** – Career timeline and capability deep dive.
- **Projects** – Spotlight on selected builds and experiments.
- **Contact & Extras** – EmailJS contact form, GitHub insights, and a retro mini-game.

## Campaign Assets
Campaign data lives in [`src/data/campaigns.ts`](src/data/campaigns.ts). Each entry references media in `/public/assets/campaigns/<slug>/` with the following rules:

- 9:16 aspect ratio only (1080 × 1920) for both videos and images.
- Videos should be H.264 MP4 with a matching poster image for previews.
- Images may be PNG or JPG.
- Provide descriptive `alt` text and 3–6 KPI badges per campaign.
- Optional case-study PDFs belong in `/public/assets/case-studies/`.

Placeholder files exist under `/public/assets/placeholders/` to keep the project compiling if branded assets are unavailable. They
are lightweight SVG/markdown-style stubs so binary assets never land in version control—replace them with final media before a
production deploy. Mazda video entries ship with `.txt` references; drop in the final 1080×1920 MP4 and update the `src` path
when assets are ready.

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

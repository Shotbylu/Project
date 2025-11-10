# Portfolio SPA

This Vite + React + TypeScript portfolio highlights marketing, design, and development work with rich storytelling and motion. Tailwind CSS powers the visual system alongside Framer Motion for subtle transitions.

## Key Sections
- **Reception** – Hero introduction with CTAs.
- **Campaigns** – Mazda’s “Brand Meaning Level 2” video series leads a filterable gallery of full-funnel case studies with 9:16 media, KPI badges, and an immersive modal experience.
- **Background & Skills** – Career timeline and capability deep dive.
- **Projects** – Spotlight on selected builds and experiments.
- **Contact & Extras** – EmailJS contact form, GitHub insights, and a retro mini-game.

## Campaign Assets
Campaign data lives in [`src/data/campaigns.ts`](src/data/campaigns.ts). Each entry references media in `/public/assets/campaigns/<slug>/` with the following rules:

- 9:16 aspect ratio only (1080 × 1920) for both videos and images (the Mazda cover art ships as a 1440×1440 poster but sits inside the same frame).
- Videos should be H.264 MP4 with a matching poster image for previews (lightweight SVG posters are acceptable during development).
- Images may be PNG or JPG.
- Provide descriptive `alt` text and 3–6 KPI badges per campaign.
- Optional case-study PDFs belong in `/public/assets/case-studies/`.

Placeholder files exist under `/public/assets/placeholders/` to keep the project compiling if branded assets are unavailable. They are lightweight SVG/text stubs so binary assets never land in version control—replace them with final media before a production deploy.

### Mazda Brand Meaning Level 2 videos

The featured Mazda Brand Meaning Level 2 campaign expects three MP4 files in `public/assets/campaigns/mazda-brand-meaning-lvl2-2025/`:

- `MAWR_06_240 - Mazda 3 6 A 1080 x 1920.mp4`
- `MAWR_06_223 - CX-5_6_A_Graded 1080 x 1920.mp4`
- `MAWR_06_214 - CX-60_06_A-2 Graded 1080 x 1920 (1).mp4`

They are intentionally `.gitignore`d so pull requests remain free of large binaries—drop the mastered exports into that folder locally or in deployment storage to enable autoplay previews in the modal.

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

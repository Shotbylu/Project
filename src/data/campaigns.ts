export type Channel =
  | 'Meta'
  | 'Google'
  | 'LinkedIn'
  | 'TikTok'
  | 'YouTube'
  | 'Programmatic'
  | 'Email/CRM'
  | 'Web';

export type Employer =
  | 'Mazda Southern Africa'
  | 'Sasol'
  | 'Empangeni High School'
  | 'Initium Venture Solutions'
  | 'South32'
  | 'Other';

export interface Asset {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
}

export interface KPI {
  label: string;
  value: string;
}

export interface Campaign {
  id: string;
  title: string;
  employer: Employer;
  role: string;
  period: string;
  channels: Channel[];
  summary: string;
  responsibilities: string[];
  assets: Asset[];
  kpis: KPI[];
  tech: string[];
  caseStudyUrl?: string;
  externalUrl?: string;
}

export const campaigns: Campaign[] = [
  // FEATURED — Mazda Brand Meaning Level 2 (3× videos)
  {
    id: 'mazda-brand-meaning-lvl2-2025',
    title: 'Brand Meaning Level 2',
    employer: 'Mazda Southern Africa',
    role: 'Digital Marketing Specialist',
    period: '2025',
    channels: ['Meta', 'YouTube', 'Email/CRM', 'Web'],
    summary: 'Video-led storytelling translating Mazda\'s brand meaning into measurable engagement and qualified demand.',
    responsibilities: [
      'Creative direction for 9:16 narrative',
      'Sequenced placements across the funnel',
      'Daily optimisation and reporting',
      'POPIA-compliant lead routing via HubSpot'
    ],
    assets: [
      {
        type: 'video',
        src: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/MAWR_06_240 - Mazda 3 6 A 1080 x 1920.mp4',
        poster: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/Brand Meaning.jpg',
        alt: 'Brand Meaning Level 2 — hero cut',
        width: 1080,
        height: 1920
      },
      {
        type: 'video',
        src: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/MAWR_06_223 - CX-5_6_A_Graded 1080 x 1920.mp4',
        poster: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/bm-level2-feature1-poster.svg',
        alt: 'Design & craft feature cut',
        width: 1080,
        height: 1920
      },
      {
        type: 'video',
        src: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/MAWR_06_214 - CX-60_06_A-2 Graded 1080 x 1920 (1).mp4',
        poster: '/assets/campaigns/mazda-brand-meaning-lvl2-2025/bm-level2-feature2-poster.svg',
        alt: 'Joy of driving feature cut',
        width: 1080,
        height: 1920
      }
    ],
    kpis: [
      { label: 'Engagement Rate', value: '↑+28%' },
      { label: 'Avg Watch Time', value: '6s' },
      { label: 'CTR', value: '3.0%' }
    ],
    tech: ['Meta Business Suite', 'GA4', 'HubSpot', 'Rival IQ', 'Power BI'],
    externalUrl: 'https://www.mazda.co.za/'
  },

  {
    id: 'mazda-gfv-q3-2025',
    title: 'Mazda2 Retail Finance Promotion',
    employer: 'Mazda Southern Africa',
    role: 'Digital Marketing Specialist',
    period: '2025 Q3',
    channels: ['Meta', 'Google', 'Web'],
    summary:
      'Retail promotion aimed at driving sales and increasing brand consideration among active car buyers. Live across our website, Google Media and Meta.',
    responsibilities: [
      'Full-funnel retail architecture (in-market prospecting, dynamic remarketing, lead nurture)',
      'Website journey optimisation (LP speed, forms, lead routing) and on-site merchandising',
      'A/B testing (creative, copy, CTA, placements) with daily optimisation',
      'Rival IQ benchmarking and Power BI reporting to leadership',
      'POPIA-compliant lead handling via HubSpot and CRM hygiene'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/mazda-gfv-q3-2025/Mazda2 Retail.jpg',
        poster: '/assets/campaigns/mazda-gfv-q3-2025/Mazda2.jpg',
        alt: 'Mazda2 9:16 paid social reel',
        width: 1080,
        height: 1920
      },
      {
        type: 'image',
        src: '/assets/campaigns/mazda-gfv-q3-2025/Mazda2 Retail2.jpg',
        alt: 'Mazda2 headline frame',
        width: 1080,
        height: 1920
      }
    ],
    kpis: [
      { label: 'ROAS', value: '4.2:1' },
      { label: 'CPL', value: 'R366' },
      { label: 'Leads', value: '1 240' },
      { label: 'CTR', value: '2.8%' },
      { label: 'Ad Recall Lift', value: 'TBC' }
    ],
    tech: ['Meta Business Suite', 'GA4', 'Rival IQ', 'Power BI', 'HubSpot'],
    caseStudyUrl: '/assets/case-studies/mazda-assured-q3-2025.pdf',
    externalUrl: 'https://www.mazda.co.za/'
  },

  {
    id: 'mazdacare-warranty-2025',
    title: 'MazdaCare Warranty Campaign',
    employer: 'Mazda Southern Africa',
    role: 'Digital Marketing Specialist',
    period: '2025',
    channels: ['Meta', 'Google', 'Web', 'TikTok', 'YouTube'],
    summary:
      "MazdaCare = Service Plan + Warranty + Roadside Assistance. Ownership made effortless. Live across Meta, Web, Youtube & Tiktok",
    responsibilities: [
      'Campaign architecture (prospecting, retargeting, lead nurture)',
      'Creative briefing and content organisation (Reels, 9:16 statics)',
      'A/B testing (copy, CTA, placements), daily optimisation',
      'Rival IQ benchmarking and Power BI reporting to leadership',
      'POPIA-compliant lead handling via HubSpot'
    ],
    assets: [
      {
        type: 'video',
        src: '/assets/campaigns/sasol-green-future-2024/MazdaCare 1.mp4',
        poster: '/assets/campaigns/sasol-green-future-2024/MazdaCare.png',
        alt: 'MazdaCare Warranty Stories',
        width: 1080,
        height: 1920
      },
      {
        type: 'video',
        src: '/assets/campaigns/sasol-green-future-2024/MazdaCare2.mp4',
        alt: 'Design & craft feature cut',
        width: 1080,
        height: 1920
      },
      {
        type: 'video',
        src: '/assets/campaigns/sasol-green-future-2024/MazdaCare3.mp4',
        alt: 'Joy of driving feature cut',
        width: 1080,
        height: 1920
      }
    ],
    kpis: [
      { label: 'Reach', value: '1 200 000' },
      { label: 'VTR (3s)', value: '35%' },
      { label: 'CTR', value: '0.95%' },
      { label: 'CPL', value: 'R85' },
      { label: 'Leads', value: '1 200' },
      { label: 'Test Drive Bookings', value: '180' },
      { label: 'Positive Sentiment', value: '75%' }
    ],
    tech: ['Meta Business Suite', 'Google Ads', 'GA4', 'HubSpot', 'Rival IQ', 'Power BI', 'SharePoint', 'TikTok Ads Manager', 'YouTube Studio']
  },

  {
    id: 'south32',
    title: 'South32 Hillside Campaign Series',
    employer: 'South32',
    role: 'Marketing & Alumni Lead',
    period: '2022',
    channels: ['LinkedIn', 'Web'],
    summary: "A series of internal and community-facing campaigns under the 'Brighter Futures, Together' platform. Covered wellness, education, visual storytelling and women's month advocacy. Campaigns showcased real employee stories, leadership development and community empowerment.",
    responsibilities: [
      'Digital Marketing, Creative direction and visual design',
      'Copywriting for campaign posters, spotlights, and impact stories',
      'Photography curation and layout design for internal branding'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/empangeni-open-day-2023/South 1.jpg',
        poster: '/assets/campaigns/empangeni-open-day-2023/South32 Cover.jpg',
        alt: 'Corporate Wellness Week Hero Visual',
        width: 1080,
        height: 1350
      },
      {
        type: 'image',
        src: '/assets/campaigns/empangeni-open-day-2023/South 2.jpg',
        alt: 'High School Leadership Programme Group Shot',
        width: 1080,
        height: 1350
      },
      {
        type: 'image',
        src: '/assets/campaigns/empangeni-open-day-2023/South 3.jpg',
        alt: 'Campaign Poster Visuals',
        width: 1080,
        height: 1350
      },
      {
        type: 'image',
        src: '/assets/campaigns/empangeni-open-day-2023/South 4.jpg',
        alt: 'Trek4Mandela Women's Month Spotlight Series',
        width: 1080,
        height: 1350
      }
    ],
    kpis: [
      { label: 'Employees Reached', value: '3 800+' },
      { label: 'Campaign Engagement Rate', value: '60%' },
      { label: 'Wellness Week Participants', value: '750+' },
      { label: 'LinkedIn Impressions', value: '85 000+' },
      { label: 'Internal Sentiment', value: 'Positive (Wellness Survey Score: 4.6/5)' }
    ],
    tech: ['Adobe Illustrator', 'Photoshop', 'Canva Pro', 'Microsoft SharePoint', 'Outlook Comms Planner']
  },

  {
    id: 'initium-b2b-acceleration-2025',
    title: 'Initium Venture Solutions LinkedIn Campaign',
    employer: 'Initium Venture Solutions',
    role: 'Growth Strategist',
    period: '2025 Cohort',
    channels: ['LinkedIn', 'Google', 'Email/CRM', 'Programmatic'],
    summary: 'Account-based ABM motion delivering net-new pipeline for SaaS partners.',
    responsibilities: [
      'Segmented ICP list building with firmographic enrichment',
      'Crafted LinkedIn conversation ads and nurtures by buying stage',
      'Optimised programmatic placements against attention scores',
      'Stitched attribution insights inside Power BI for investors'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/initium-b2b-acceleration-2025/panel.svg',
        alt: 'Initium accelerator promo panel',
        width: 1440,
        height: 1440
      },
      {
        type: 'image',
        src: '/assets/campaigns/initium-b2b-acceleration-2025/report.svg',
        alt: 'ABM report highlight frame',
        width: 1440,
        height: 1440
      }
    ],
    kpis: [
      { label: 'Pipeline', value: '$3.4M' },
      { label: 'SQL Rate', value: '28%' },
      { label: 'CPL', value: '$72' },
      { label: 'Email Reply', value: '19%' }
    ],
    tech: ['LinkedIn Campaign Manager', '6sense', 'HubSpot', 'Power BI']
  },

  {
    id: 'south32-community-2024',
    title: 'South32 Community Impact Drives',
    employer: 'South32',
    role: 'Integrated Marketing Manager',
    period: '2024 Programme',
    channels: ['Meta', 'Google', 'Programmatic', 'Web'],
    summary: 'Behaviour-change storytelling aligning ESG commitments with measurable community outcomes.',
    responsibilities: [
      'Power BI sustainability dashboards for leadership',
      'Programmatic guaranteed on premium news inventory',
      'Qualitative sentiment tracking in weekly retros'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/south32-community-2024/impact.svg',
        alt: 'Community upliftment campaign creative',
        width: 1440,
        height: 1440
      }
    ],
    kpis: [
      { label: 'Reach', value: '1.2M' },
      { label: 'ROAS', value: '3.1:1' },
      { label: 'Engagement', value: '5.2%' }
    ],
    tech: ['Campaign Manager 360', 'Google Ads', 'Power BI', 'Tableau']
  }
];

export default campaigns;

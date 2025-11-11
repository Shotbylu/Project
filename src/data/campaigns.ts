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
    title: 'Mazda2 Finance Campaign',
    employer: 'Mazda Southern Africa',
    role: 'Digital Marketing Specialist',
    period: '2025 Q3',
    channels: ['Meta', 'Google', 'LinkedIn', 'Email/CRM'],
    summary: 'Full-funnel GFV campaign driving qualified dealer enquiries at sub-R400 CPL and 4.2:1 ROAS.',
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
        src: '/assets/campaigns/mazda-gfv-q3-2025/Mazda2.jpg',
        poster: '/assets/campaigns/mazda-gfv-q3-2025/Mazda2.jpg',
        alt: 'Mazda2 9:16 paid social reel',
        width: 1080,
        height: 1920
      },
      {
        type: 'image',
        src: '/assets/campaigns/mazda-gfv-q3-2025/frame1.svg',
        alt: 'Mazda2 headline frame',
        width: 1440,
        height: 1440
      }
    ],
    kpis: [
      { label: 'ROAS', value: '4.2:1' },
      { label: 'CPL', value: 'R366' },
      { label: 'Leads', value: '1 240' },
      { label: 'CTR', value: '2.8%' }
    ],
    tech: ['Meta Business Suite', 'GA4', 'Rival IQ', 'Power BI', 'HubSpot'],
    caseStudyUrl: '/assets/case-studies/mazda-assured-q3-2025.pdf',
    externalUrl: 'https://www.mazda.co.za/'
  },

  {
    id: 'sasol-solar-energy-2024',
    title: 'Sasol Solar Energy Program',
    employer: 'Sasol',
    role: 'Digital Marketing Manager',
    period: '2024 Intake',
    channels: ['Meta', 'Google', 'Web'],
    summary: 'Scholarship acquisition wave pairing storytelling with conversion optimisation for STEM bursaries.',
    responsibilities: [
      'Designed landing journey with UX partner and implemented CRO testing plan',
      'Implemented lead scoring to prioritise high intent applicants',
      'Built executive dashboards highlighting ROI from regional media splits',
      'Collaborated with HR to align campaign messaging with campus presence'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/sasol-green-future-2024/visual.svg',
        alt: 'Sasol scholarship announcement creative',
        width: 1440,
        height: 1440
      }
    ],
    kpis: [
      { label: 'Applications', value: '8 400' },
      { label: 'CPL', value: 'R58' },
      { label: 'CTR', value: '3.1%' }
    ],
    tech: ['Google Ads', 'GA4', 'Power BI', 'Microsoft Dynamics'],
    externalUrl: 'https://www.sasol.com/'
  },

  {
    id: 'empangeni-open-day-2023',
    title: 'Empangeni High School Open Day',
    employer: 'Empangeni High School',
    role: 'Marketing & Alumni Lead',
    period: '2023 Q3',
    channels: ['Meta', 'TikTok', 'Email/CRM'],
    summary: 'Community-first recruitment weekend uniting parents, alumni and Grade 7 prospects.',
    responsibilities: [
      'Coordinated student ambassador programme to capture authentic stories',
      'Built automation journey nudging RSVPs, reminders and post-event surveys',
      'Managed real-time TikTok live stream crew and comment moderation'
    ],
    assets: [
      {
        type: 'image',
        src: '/assets/campaigns/empangeni-open-day-2023/poster.svg',
        alt: 'Empangeni open day hero poster',
        width: 1440,
        height: 1440
      }
    ],
    kpis: [
      { label: 'RSVPs', value: '620' },
      { label: 'Attendance', value: '94%' },
      { label: 'Email CTR', value: '42%' }
    ],
    tech: ['Meta Business Suite', 'Mailchimp', 'Canva', 'Google Forms']
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

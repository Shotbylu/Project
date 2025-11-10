import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  ExternalLink,
  Sparkles,
  Globe,
  Linkedin,
  Music4,
  Youtube,
  Mail,
  Network,
} from 'lucide-react';
import type { Campaign, Channel } from '../../data/campaigns';

interface CampaignCardProps {
  campaign: Campaign;
  onOpen?: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
  isFeatured?: boolean;
  className?: string;
}

const channelIconMap: Record<Channel, React.ReactNode> = {
  Meta: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
  Google: <Globe className="h-3.5 w-3.5" aria-hidden="true" />,
  LinkedIn: <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />,
  TikTok: <Music4 className="h-3.5 w-3.5" aria-hidden="true" />,
  YouTube: <Youtube className="h-3.5 w-3.5" aria-hidden="true" />,
  Programmatic: <Network className="h-3.5 w-3.5" aria-hidden="true" />,
  'Email/CRM': <Mail className="h-3.5 w-3.5" aria-hidden="true" />,
  Web: <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />,
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onOpen,
  isFeatured = false,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setIsVisible(true);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  const primaryAsset = campaign.assets[0];
  const topKpis = useMemo(() => campaign.kpis.slice(0, 3), [campaign.kpis]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>, assetIndex = 0) => {
    if (!onOpen) return;
    onOpen(campaign, assetIndex, event.currentTarget as HTMLElement);
  };

  const parseProgressValue = (value: string) => {
    if (!value.includes('%')) return null;
    const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) return null;
    return Math.max(0, Math.min(100, numeric));
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-7 text-slate-900 shadow-xl transition-all duration-500 ${
        isFeatured ? 'ring-2 ring-[#FF6B00]/80' : ''
      } ${className}`}
      data-analytics="campaign-card"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
        {isFeatured && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#0f1a2b]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow">
            Featured
          </span>
        )}

        {primaryAsset ? (
          primaryAsset.type === 'video' && primaryAsset.poster ? (
            <button
              type="button"
              onClick={(event) => handleOpen(event, 0)}
              className="group relative flex h-full w-full items-center justify-center"
              aria-label={`View ${campaign.title} media`}
              data-analytics="campaign-card-view"
            >
              <img
                src={primaryAsset.poster}
                alt={primaryAsset.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" aria-hidden="true" />
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0f1a2b] shadow-xl transition group-hover:scale-105">
                <Play className="h-6 w-6 fill-[#0f1a2b]" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => handleOpen(event, 0)}
              className="relative flex h-full w-full items-center justify-center"
              aria-label={`View ${campaign.title} media`}
              data-analytics="campaign-card-view"
            >
              <img
                src={primaryAsset.poster ?? primaryAsset.src}
                alt={primaryAsset.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/10" aria-hidden="true" />
            </button>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-600">
            Media preview unavailable
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
            <span className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-[#FF6B00]">
              {campaign.employer}
            </span>
            <span className="text-[11px] tracking-[0.32em] text-slate-400">{campaign.period}</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{campaign.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{campaign.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {campaign.channels.map((channel) => (
            <span
              key={channel}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                {channelIconMap[channel]}
              </span>
              {channel}
            </span>
          ))}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {topKpis.map((kpi) => {
            const progress = parseProgressValue(kpi.value);
            return (
              <li
                key={kpi.label}
                className="group/kpi relative overflow-hidden rounded-2xl border border-gray-200 bg-slate-50 p-4 transition duration-500"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{kpi.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</div>
                {progress !== null && (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                    <span className="block h-full rounded-full bg-[#FF6B00]" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={(event) => handleOpen(event, 0)}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          aria-label={`Open ${campaign.title} campaign detail`}
          data-analytics="campaign-card-view"
        >
          View
        </button>
      </div>
    </motion.article>
  );
};

export default CampaignCard;

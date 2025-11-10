import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles, Globe, Linkedin, Music4, Youtube, Mail, Network } from 'lucide-react';
import type { Campaign, Channel } from '../../data/campaigns';

interface CampaignCardProps {
  campaign: Campaign;
  onOpen: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
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
  Web: <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
};

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onOpen, isFeatured = false, className = '' }) => {
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

  const topKpis = useMemo(() => campaign.kpis.slice(0, 3), [campaign.kpis]);

  const primaryAsset = campaign.assets[0];
  if (!primaryAsset) return null;

  const handleOpen = (event: React.MouseEvent<HTMLElement>, assetIndex = 0) => {
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
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border px-6 py-7 text-slate-100 shadow-[0_30px_80px_-50px_rgba(8,47,73,0.8)] transition-all duration-500 ${
        isFeatured
          ? 'border-orange-400/50 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/40'
          : 'border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900 to-slate-950'
      } ${className}`}
      data-analytics="campaign-card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl transition-all duration-700 group-hover:-top-40 group-hover:bg-orange-400/20 group-hover:blur-[140px]"
      />
      <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg aspect-[9/16]">
        {isFeatured && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-300 shadow">
            Featured
          </span>
        )}

        {primaryAsset.type === 'video' && primaryAsset.poster ? (
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
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl transition group-hover:scale-105">
              <Play className="h-6 w-6 fill-neutral-900" />
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
        )}
      </div>

      <div className="mt-7 flex flex-col gap-5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-orange-200/90">
              {campaign.employer}
            </span>
            <span className="text-[11px] tracking-[0.35em] text-slate-500">{campaign.period}</span>
          </div>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{campaign.title}</h3>
          <p className="text-sm leading-relaxed text-slate-300">{campaign.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {campaign.channels.map((channel) => (
            <span
              key={channel}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100/90 backdrop-blur"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-orange-200">
                {channelIconMap[channel]}
              </span>
              {channel}
            </span>
          ))}
        </div>

      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={(event) => handleOpen(event, 0)}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-15px_rgba(236,72,153,0.8)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-200 hover:shadow-[0_18px_45px_-20px_rgba(236,72,153,0.9)]"
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

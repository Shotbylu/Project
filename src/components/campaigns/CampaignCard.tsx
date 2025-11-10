import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles, Globe, Linkedin, Music4, Youtube, Mail, Network } from 'lucide-react';
import type { Campaign, Channel } from '../../data/campaigns';

interface CampaignCardProps {
  campaign: Campaign;
  onOpen: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
  isFeatured?: boolean;
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

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onOpen, isFeatured = false }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const primaryAsset = campaign.assets[0];
  if (!primaryAsset) {
    return null;
  }
  const topKpis = campaign.kpis.slice(0, 3);

  const handleOpen = (event: React.MouseEvent<HTMLElement>, assetIndex = 0) => {
    onOpen(campaign, assetIndex, event.currentTarget as HTMLElement);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className={`flex h-full flex-col rounded-3xl border bg-white p-6 shadow-lg shadow-black/5 transition ${
        isFeatured
          ? 'border-orange-200/70 bg-gradient-to-br from-white via-white to-orange-50/30'
          : 'border-gray-100'
      }`}
      data-analytics="campaign-card"
    >
      <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg aspect-[9/16]">
        {isFeatured && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow">
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
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl">
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

      <div className="mt-6 flex flex-col gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
              {campaign.employer}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{campaign.period}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
          <p className="text-sm text-gray-600">{campaign.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {campaign.channels.map((channel) => (
            <span
              key={channel}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
            >
              {channelIconMap[channel]}
              {channel}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {topKpis.map((kpi) => (
            <span
              key={kpi.label}
              className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
            >
              {kpi.label} {kpi.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={(event) => handleOpen(event, 0)}
          className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
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

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import type { Campaign } from '../../data/campaigns';

interface CampaignCardProps {
  campaign: Campaign;
  onOpen?: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
  className?: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onOpen,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Simplified Intersection Observer for fade-in animation
  // NOTE: In a real application, you might use a shared hook for this to avoid repetition.
  // Keeping it here for demonstration of the simplified component.
  React.useEffect(() => {
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

  const handleOpen = (event: React.MouseEvent<HTMLElement>, assetIndex = 0) => {
    if (!onOpen) return;
    onOpen(campaign, assetIndex, event.currentTarget as HTMLElement);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-7 text-slate-900 shadow-xl transition-all duration-500 ${className}`}
      data-analytics="campaign-card"
    >
      {/* 1. Simplified Media Preview (Removed 'Featured' badge and complex asset logic) */}
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
        {primaryAsset ? (
          <button
            type="button"
            onClick={(event) => handleOpen(event, 0)}
            className="group relative flex h-full w-full items-center justify-center"
            aria-label={`View ${campaign.title} media`}
            data-analytics="campaign-card-view"
          >
            <img
              src={primaryAsset.poster ?? primaryAsset.src}
              alt={primaryAsset.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {primaryAsset.type === 'video' && (
              <>
                <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" aria-hidden="true" />
                <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0f1a2b] shadow-xl transition group-hover:scale-105">
                  <Play className="h-6 w-6 fill-[#0f1a2b]" />
                </span>
              </>
            )}
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-600">
            Media preview unavailable
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-5">
        <div className="space-y-3">
          {/* 2. Simplified Header (Removed period, kept employer) */}
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
            <span className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-[#FF6B00]">
              {campaign.employer}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{campaign.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{campaign.summary}</p>
        </div>

        {/* 3. Removed Channels list (Simplification) */}
        
        {/* 4. Removed KPIs list (Simplification) */}
        
      </div>

      {/* 5. Kept 'View' button */}
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={(event) => handleOpen(event, 0)}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          aria-label={`Open ${campaign.title} campaign detail`}
          data-analytics="campaign-card-view"
        >
          View Case Study
        </button>
      </div>
    </motion.article>
  );
};

export default CampaignCard;

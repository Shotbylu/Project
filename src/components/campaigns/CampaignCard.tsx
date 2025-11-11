import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Campaign } from "../../data/campaigns";

interface CampaignCardProps {
  campaign: Campaign;
  onOpen?: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
  className?: string;
}

/**
 * Premium Campaign Card
 *
 * Changes from previous version:
 * - Premium visual language (soft gradient ring, glass card, subtle shadows).
 * - Perfect square media well (aspect-square) for 1440×1440 creative.
 * - <img> width/height + sizes hints to prefer 1440×1440 assets.
 * - Larger, cleaner typography; compact metadata chip; elegant CTA with gradient border.
 * - Better hover states, performance-friendly intersection observer.
 */
const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onOpen, className = "" }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || isVisible) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  const primaryAsset = campaign.assets?.[0];

  const handleOpen = (event: React.MouseEvent<HTMLElement>, assetIndex = 0) => {
    if (!onOpen) return;
    onOpen(campaign, assetIndex, event.currentTarget as HTMLElement);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-3xl p-[1px] bg-[linear-gradient(135deg,#ECEFF5,white,#E6EAF2)] shadow-[0_10px_30px_rgba(2,8,23,0.06)] transition-all duration-500 ${className}`}
      data-analytics="campaign-card"
    >
      {/* Inner surface */}
      <article className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white/90 ring-1 ring-black/5 backdrop-blur-[2px]">
        {/* Media Well — square for 1440×1440 assets */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0b1220]/5">
          {primaryAsset ? (
            <button
              type="button"
              onClick={(event) => handleOpen(event, 0)}
              className="group/media relative block h-full w-full"
              aria-label={`View ${campaign.title} media`}
              data-analytics="campaign-card-view"
            >
              {/* IMPORTANT: 1440×1440 preferred. Ensure the actual file is exported at 1440px each side. */}
              <img
                src={primaryAsset.poster ?? primaryAsset.src}
                alt={primaryAsset.alt}
                loading="lazy"
                width={1440}
                height={1440}
                sizes="(max-width: 768px) 100vw, 640px"
                className="h-full w-full object-cover object-center transition duration-700 group-hover/media:scale-[1.03]"
              />

              {/* Premium overlay treatments */}
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-90" />
              <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-black/10 rounded-2xl" />

              {primaryAsset.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/85 text-[#0f1a2b] shadow-xl backdrop-blur-sm transition group-hover/media:scale-105">
                    <Play className="h-6 w-6" />
                  </span>
                </span>
              )}

              {/* Subtle top-left label */}
              <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f1a2b] shadow-sm ring-1 ring-black/5">
                {campaign.employer}
              </span>
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#4b5563]">Media preview unavailable</div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-6 sm:pt-7">
          <h3 className="text-[22px] font-semibold leading-snug text-[#0b1220] sm:text-[26px]">
            {campaign.title}
          </h3>
          {campaign.summary && (
            <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">{campaign.summary}</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto px-6 pb-6">
          <button
            type="button"
            onClick={(event) => handleOpen(event, 0)}
            className="relative inline-flex w-full items-center justify-center rounded-full p-[1.5px] focus-visible:outline-none"
            aria-label={`Open ${campaign.title} campaign detail`}
            data-analytics="campaign-card-view"
          >
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(at_0%_0%,#93C5FD,#E9D5FF,#FDE68A,#86EFAC,#93C5FD)] opacity-80 blur-[6px] transition-opacity group-hover:opacity-100" aria-hidden />
            <span className="relative inline-flex w-full items-center justify-center rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_6px_18px_rgba(2,8,23,0.25)] ring-1 ring-white/10 transition-colors hover:bg-[#0b1220]">
              View Case Study
            </span>
          </button>
        </div>
      </article>
    </motion.div>
  );
};

export default CampaignCard;

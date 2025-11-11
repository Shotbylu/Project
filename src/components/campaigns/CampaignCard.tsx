import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface Asset {
  src: string;
  poster?: string;
  alt: string;
  type?: string;
}

interface Campaign {
  title: string;
  employer: string;
  summary?: string;
  assets?: Asset[];
}

interface CampaignCardProps {
  campaign: Campaign;
  onOpen?: (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => void;
  className?: string;
}

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
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      data-analytics="campaign-card"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl">
        {/* Media Well */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          {primaryAsset ? (
            <button
              type="button"
              onClick={(event) => handleOpen(event, 0)}
              className="group/media relative block h-full w-full"
              aria-label={`View ${campaign.title} media`}
              data-analytics="campaign-card-view"
            >
              <img
                src={primaryAsset.poster ?? primaryAsset.src}
                alt={primaryAsset.alt}
                loading="lazy"
                width={1440}
                height={1440}
                sizes="(max-width: 768px) 100vw, 640px"
                className="h-full w-full object-cover object-center transition duration-500 group-hover/media:scale-105"
              />

              {primaryAsset.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition group-hover/media:scale-110">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </span>
              )}

              {/* Employer badge */}
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-700 shadow-sm">
                {campaign.employer}
              </span>
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              Media preview unavailable
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-5">
          <h3 className="text-lg font-semibold leading-tight text-gray-900">
            {campaign.title}
          </h3>
          {campaign.summary && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{campaign.summary}</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto px-5 pb-5">
          <button
            type="button"
            onClick={(event) => handleOpen(event, 0)}
            className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            aria-label={`Open ${campaign.title} campaign detail`}
            data-analytics="campaign-card-view"
          >
            View Case Study
          </button>
        </div>
      </article>
    </motion.div>
  );
};

export default CampaignCard;

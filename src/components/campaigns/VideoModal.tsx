import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import type { Campaign } from '../../data/campaigns';
import { trackAnalyticsEvent } from '../../utils/analytics';

interface VideoModalProps {
  campaign: Campaign | null;
  initialAssetIndex: number;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const focusableSelectors =
  'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

const VideoModal: React.FC<VideoModalProps> = ({
  campaign,
  initialAssetIndex,
  isOpen,
  onClose,
  triggerRef
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const assetContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialAssetIndex);
  const [assetVisible, setAssetVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) setCurrentIndex(initialAssetIndex);
  }, [initialAssetIndex, isOpen]);

  // Clamp index
  useEffect(() => {
    if (!campaign) return;
    if (currentIndex >= campaign.assets.length) setCurrentIndex(0);
  }, [campaign, currentIndex]);

  // Lazy load
  useEffect(() => {
    if (!isOpen) {
      setAssetVisible(false);
      return;
    }
    setAssetVisible(false);
    setVideoError(false);

    const node = assetContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setAssetVisible(true),
      { root: null, threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isOpen, currentIndex]);

  // Initial focus
  const campaignId = campaign?.id;

  useEffect(() => {
    if (!isOpen || !campaignId) return;
    const modalNode = modalRef.current;
    if (!modalNode) return;
    const focusable = Array.from(
      modalNode.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => !el.hasAttribute('data-focus-guard'));
    focusable[0]?.focus();
  }, [campaignId, isOpen]);

  const assets = campaign?.assets ?? [];
  const assetsLength = assets.length;
  const activeAsset = assets[currentIndex];
  const isVideoPlaceholder = activeAsset?.type === 'video' && activeAsset.src.endsWith('.txt');

  const analyticsContext = useMemo(
    () => ({
      campaignId: campaign?.id,
      campaignTitle: campaign?.title,
      assetIndex: currentIndex,
      assetType: activeAsset?.type,
      assetSrc: activeAsset?.src
    }),
    [activeAsset?.src, activeAsset?.type, campaign?.id, campaign?.title, currentIndex]
  );

  const goToPrevious = useCallback(() => {
    if (!assetsLength) return;
    setCurrentIndex((prev) => (prev - 1 + assetsLength) % assetsLength);
    setVideoError(false);
  }, [assetsLength]);

  const goToNext = useCallback(() => {
    if (!assetsLength) return;
    setCurrentIndex((prev) => (prev + 1) % assetsLength);
    setVideoError(false);
  }, [assetsLength]);

  const handleClose = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  }, [onClose, triggerRef]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === 'Tab') {
        const modalNode = modalRef.current;
        if (!modalNode) return;
        const focusable = Array.from(
          modalNode.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => !el.hasAttribute('data-focus-guard'));
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, goToNext, goToPrevious, isOpen]);

  const hasMultipleAssets = assetsLength > 1;
  const techList = useMemo(() => campaign?.tech.join(', ') ?? '', [campaign]);

  return (
    <AnimatePresence>
      {isOpen && campaign && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.9)] px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`campaign-${campaign.id}-title`}
          data-analytics="campaign-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            ref={modalRef}
            className="relative flex w-full max-w-6xl flex-col gap-6 overflow-hidden rounded-3xl bg-[#111827] p-6 shadow-2xl lg:flex-row"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.8)] text-[#111827] shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffffff]"
              aria-label="Close campaign detail"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div
                ref={assetContainerRef}
                className="relative w-full overflow-hidden rounded-2xl bg-[#111827] shadow-xl aspect-[9/16]"
              >
                <AnimatePresence mode="wait">
                  {activeAsset && (
                    <motion.div
                      key={`${campaign.id}-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full"
                    >
                      {activeAsset.type === 'video' ? (
                        assetVisible && !videoError && !isVideoPlaceholder ? (
                          <video
                            key={activeAsset.src}
                            className="h-full w-full object-cover"
                            controls
                            autoPlay
                            muted
                            playsInline
                            preload="none"
                            poster={activeAsset.poster}
                            onError={() => setVideoError(true)}
                          >
                            <source src={activeAsset.src} type="video/mp4" />
                          </video>
                        ) : (
                          <div className="relative flex h-full w-full items-center justify-center bg-[#111827] text-center text-[rgba(255,255,255,0.8)]">
                            <img
                              src={activeAsset.poster ?? activeAsset.src}
                              alt={activeAsset.alt}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover opacity-40"
                            />
                            <div className="relative mx-6 rounded-2xl bg-black/60 px-4 py-3 text-sm">
                              <p className="font-medium">Video preview unavailable in this workspace.</p>
                              <p>
                                Replace the placeholder file in <code>public/assets/campaigns/{campaign.id}</code> with a
                                1080×1920 MP4 and update the dataset.
                              </p>
                            </div>
                          </div>
                        )
                      ) : (
                        <img
                          src={activeAsset.src}
                          alt={activeAsset.alt}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasMultipleAssets && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
                      aria-label="Previous asset"
                      data-analytics="campaign-modal-previous"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
                      aria-label="Next asset"
                      data-analytics="campaign-modal-next"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {hasMultipleAssets && (
                <div className="flex items-center justify-center gap-2">
                  {assets.map((asset, index) => (
                    <button
                      key={asset.src}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 w-8 rounded-full transition ${
                        currentIndex === index ? 'bg-[#111827]' : 'bg-[#e5e7eb] hover:bg-[#e5e7eb]'
                      }`}
                      aria-label={`View asset ${index + 1} of ${assets.length}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto pr-2">
              <div>
                <span className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#c2410c]">
                  {campaign.employer}
                </span>
                <h2 id={`campaign-${campaign.id}-title`} className="mt-3 text-2xl font-semibold text-[#ffffff]">
                  {campaign.title}
                </h2>
                <p className="text-sm font-medium text-[rgba(255,255,255,0.7)]">{campaign.role}</p>
                <p className="text-sm text-[rgba(255,255,255,0.7)]">{campaign.period}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.7)]">Summary</h3>
                <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)]">{campaign.summary}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.7)]">Responsibilities</h3>
                <ul className="mt-2 space-y-2 text-sm text-[rgba(255,255,255,0.7)]">
                  {campaign.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-[#f97316]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.7)]">Channels</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {campaign.channels.map((channel) => (
                    <span key={channel} className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-[#1d4ed8]">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.7)]">Key Results</h3>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 whitespace-nowrap sm:grid sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:whitespace-normal">
                  {campaign.kpis.map((kpi) => (
                    <span
                      key={kpi.label}
                      className="inline-flex flex-shrink-0 items-center rounded-full border border-[#bfdbfe] bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#1d4ed8]"
                    >
                      {kpi.label} {kpi.value}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.7)]">Tech Stack</h3>
                <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)]">{techList}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {campaign.caseStudyUrl && (
                  <a
                    href={campaign.caseStudyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f97316] to-[#3b82f6] px-4 py-2 text-sm font-semibold text-[#ffffff] transition hover:from-[#ea580c] hover:to-[#2563eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                    data-analytics="campaign-modal-download"
                    onClick={() =>
                      trackAnalyticsEvent('campaign_modal_download_click', {
                        ...analyticsContext,
                        href: campaign.caseStudyUrl
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                    Download Case Study
                  </a>
                )}
                {campaign.externalUrl && (
                  <a
                    href={campaign.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.7)] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.9)] transition hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
                    data-analytics="campaign-modal-external"
                    onClick={() =>
                      trackAnalyticsEvent('campaign_modal_external_click', {
                        ...analyticsContext,
                        href: campaign.externalUrl
                      })
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Link
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;

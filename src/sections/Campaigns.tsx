import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import campaignsData, { Campaign, Channel, Employer } from '../data/campaigns';
import { CampaignCard, CampaignFilters, VideoModal } from '../components/campaigns';

const decodeList = <T extends string>(value: string | null, options: readonly T[]): T[] => {
  if (!value) return [];
  const decoded = value.split(',').map((i) => decodeURIComponent(i)).filter(Boolean) as T[];
  return decoded.filter((i) => options.includes(i));
};

const FEATURED_CAMPAIGN_ID = 'mazda-brand-meaning-lvl2-2025';

const Campaigns: React.FC = () => {
  const [selectedEmployers, setSelectedEmployers] = useState<Employer[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [initialAssetIndex, setInitialAssetIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const didParseHash = useRef(false);

  const employers = useMemo(() => {
    const unique = new Set<Employer>();
    campaignsData.forEach((c) => unique.add(c.employer));
    return Array.from(unique);
  }, []);

  const channels = useMemo(() => {
    const unique = new Set<Channel>();
    campaignsData.forEach((c) => c.channels.forEach((ch) => unique.add(ch)));
    return Array.from(unique);
  }, []);

  // Read URL hash
  useEffect(() => {
    if (typeof window === 'undefined' || didParseHash.current) return;

    const hash = window.location.hash;
    if (hash.startsWith('#campaigns')) {
      const [, query = ''] = hash.split('?');
      const params = new URLSearchParams(query);
      const empVals = decodeList(params.get('emp'), employers);
      const chVals = decodeList(params.get('ch'), channels);
      if (empVals.length) setSelectedEmployers(empVals);
      if (chVals.length) setSelectedChannels(chVals);
    }
    didParseHash.current = true;
  }, [employers, channels]);

  // Write URL hash
  useEffect(() => {
    if (typeof window === 'undefined' || !didParseHash.current) return;

    const params = new URLSearchParams();
    if (selectedEmployers.length) params.set('emp', selectedEmployers.join(','));
    if (selectedChannels.length) params.set('ch', selectedChannels.join(','));
    const query = params.toString();
    const newHash = `#campaigns${query ? `?${query}` : ''}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedEmployers, selectedChannels]);

  // Filtered list
  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((c) => {
      const employerMatch = selectedEmployers.length === 0 || selectedEmployers.includes(c.employer);
      const channelMatch = selectedChannels.length === 0 || c.channels.some((ch) => selectedChannels.includes(ch));
      return employerMatch && channelMatch;
    });
  }, [selectedChannels, selectedEmployers]);

  // Featured + secondary
  const featuredCampaign = useMemo(
    () => filteredCampaigns.find((c) => c.id === FEATURED_CAMPAIGN_ID) ?? null,
    [filteredCampaigns]
  );
  const secondaryCampaigns = useMemo(
    () => filteredCampaigns.filter((c) => c.id !== FEATURED_CAMPAIGN_ID),
    [filteredCampaigns]
  );


  const totalCampaigns = campaignsData.length;
  const filteredCount = filteredCampaigns.length;
  const hasActiveFilters = selectedEmployers.length > 0 || selectedChannels.length > 0;
  const shouldShowEmptyState = filteredCount === 0;

  const clearFilters = useCallback(() => {
    setSelectedEmployers([]);
    setSelectedChannels([]);
  }, [setSelectedChannels, setSelectedEmployers]);

  const handleOpen = useCallback((campaign: Campaign, assetIndex: number, trigger: HTMLElement) => {
    setActiveCampaign(campaign);
    setInitialAssetIndex(assetIndex);
    triggerRef.current = trigger;
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setActiveCampaign(null);
    setInitialAssetIndex(0);
  }, []);

  return (
    <section id="campaigns" className="relative overflow-hidden bg-slate-950 py-24 text-slate-100 sm:py-32">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-orange-500/40 blur-[160px]"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.08),_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-orange-200/80">
              Campaigns
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Full-funnel campaign leadership</h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              A high-impact gallery of integrated campaigns that ladder brand storytelling into measurable growth. Explore each
              narrative, analyse the multi-channel architecture, and see how testing insights compound into momentum.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Channels orchestrated</p>
                <p className="mt-1 text-2xl font-semibold text-white">{channelCount}</p>
                <p className="mt-2 text-xs text-slate-400">From paid social and video to CRM, web and programmatic placements.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Employers represented</p>
                <p className="mt-1 text-2xl font-semibold text-white">{employerCount}</p>
                <p className="mt-2 text-xs text-slate-400">Enterprise and growth-stage partners across automotive, tech and energy.</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_-60px_rgba(15,118,110,0.6)] backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Filter campaigns</p>
            <p className="mt-2 text-xs text-slate-400">
              Toggle employers and channels to surface the case studies most relevant to your objectives.
            </p>

            </div>
          </motion.div>
        </motion.div>

        <div className="mt-14 space-y-12">
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur"
            >
              <span className="font-semibold text-white">
                Showing {filteredCount} of {totalCampaigns} campaigns
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center rounded-full border border-white/20 bg-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200 transition hover:border-orange-300/60 hover:bg-orange-500/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-200"
              >
                Reset filters
              </button>
            </motion.div>
          )}

          {shouldShowEmptyState ? (

              </div>
              <button
                type="button"
                onClick={clearFilters}

              )}

              {secondaryCampaigns.length > 0 && (
                <motion.div

                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <VideoModal
        campaign={activeCampaign}
        initialAssetIndex={initialAssetIndex}
        isOpen={isModalOpen}
        onClose={handleClose}
        triggerRef={triggerRef}
      />
    </section>
  );
};

export default Campaigns;

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

  // Calculate counts
  const channelCount = channels.length;
  const employerCount = employers.length;

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

  const channelCount = channels.length;
  const employerCount = employers.length;
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
    <section id="campaigns" className="relative overflow-hidden bg-white py-24 text-slate-900 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-100/40 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF6B00]">
              Campaigns
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Full-funnel campaign leadership</h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              A high-impact gallery of integrated campaigns that ladder brand storytelling into measurable growth. Explore each
              narrative, analyse the multi-channel architecture, and see how testing insights compound into momentum.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Channels orchestrated</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{channelCount}</p>
                <p className="mt-2 text-xs text-slate-500">From paid social and video to CRM, web and programmatic placements.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Employers represented</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{employerCount}</p>
                <p className="mt-2 text-xs text-slate-500">Enterprise and growth-stage partners across automotive, tech and energy.</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Filter campaigns</p>
            <p className="mt-2 text-xs text-slate-500">
              Toggle employers and channels to surface the case studies most relevant to your objectives.
            </p>
            <div className="mt-6">
              <CampaignFilters
                employers={employers}
                channels={channels}
                selectedEmployers={selectedEmployers}
                selectedChannels={selectedChannels}
                onEmployersChange={setSelectedEmployers}
                onChannelsChange={setSelectedChannels}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-14 space-y-12">
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm text-slate-700"
            >
              <span className="font-semibold text-slate-900">
                Showing {filteredCount} of {totalCampaigns} campaigns
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center rounded-full border border-[#FF6B00] bg-[#FF6B00] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                Reset filters
              </button>
            </motion.div>
          )}

          {shouldShowEmptyState ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-10 py-16 text-center"
            >
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">No campaigns match these filters</h3>
                <p className="text-sm text-slate-600">Adjust the filters or reset to explore the full showcase again.</p>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center rounded-full bg-[#FF6B00] px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-lg transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                Reset filters
              </button>
            </motion.div>
          ) : (
            <>
              {featuredCampaign && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-stretch"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-transparent to-transparent" aria-hidden="true" />
                    <div className="relative space-y-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FF6B00]">Featured campaign</p>
                      <h3 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Brand Meaning Level 2 — Mazda Southern Africa</h3>
                      <p className="text-base leading-relaxed text-slate-600">{featuredCampaign.summary}</p>
                      <p className="text-sm text-slate-500">
                        Three cinematic 9:16 edits translate Mazda’s brand meaning into measurable demand. Dive into the carousel to
                        explore sequencing, KPIs and channel-specific insights.
                      </p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {featuredCampaign.kpis.slice(0, 2).map((kpi) => (
                          <div key={kpi.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{kpi.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:pl-4">
                    <CampaignCard campaign={featuredCampaign} onOpen={handleOpen} isFeatured className="break-inside-avoid" />
                  </div>
                </motion.div>
              )}

              {secondaryCampaigns.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="[column-fill:_balance] columns-1 gap-6 md:columns-2 xl:columns-3"
                >
                  {secondaryCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onOpen={handleOpen}
                      className="mb-6 break-inside-avoid"
                    />
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

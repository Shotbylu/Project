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
    <section id="campaigns" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Campaigns</p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">Full-funnel campaign leadership</h2>
            <p className="mt-4 text-sm text-gray-600">
              A curated view of performance, creative and analytics sprints that showcase how every brief was turned into
              measurable value. Filter by employer or channel to dive into what matters most to you.
            </p>
          </div>
          <div className="md:w-80">
            <p className="text-xs text-gray-500">
              Data-led storytelling, consistent branding and cross-functional orchestration power these case studies.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm">
          <CampaignFilters
            employers={employers}
            channels={channels}
            selectedEmployers={selectedEmployers}
            selectedChannels={selectedChannels}
            onEmployersChange={setSelectedEmployers}
            onChannelsChange={setSelectedChannels}
          />
        </div>

        <div className="mt-12 space-y-12">
          {featuredCampaign && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-orange-100/60 bg-white/80 p-6 shadow-sm shadow-orange-100/40 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Featured Campaign</p>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Brand Meaning Level 2 — Mazda Southern Africa
                </h3>
                <p className="mt-4 text-sm text-gray-600 sm:text-base">
                  {featuredCampaign.summary}
                </p>
                <p className="mt-4 text-xs text-gray-500">
                  Three cinematic 9:16 edits ladder Mazda’s brand meaning into measurable demand. Open the case to explore the
                  full video carousel, KPIs, and tech stack.
                </p>
              </div>
              <CampaignCard campaign={featuredCampaign} onOpen={handleOpen} isFeatured />
            </div>
          )}

          {secondaryCampaigns.length > 0 && (
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: {} }}
            >
              {secondaryCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} onOpen={handleOpen} />
              ))}
            </motion.div>
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

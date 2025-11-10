import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import campaignsData, { Campaign, Channel, Employer } from '../data/campaigns';
import { CampaignCard, CampaignFilters, VideoModal } from '../components/campaigns';

const decodeList = <T extends string>(value: string | null, options: readonly T[]): T[] => {
  if (!value) {
    return [];
  }
  const decoded = value
    .split(',')
    .map((item) => decodeURIComponent(item))
    .filter(Boolean) as T[];
  return decoded.filter((item) => options.includes(item));
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
    campaignsData.forEach((campaign) => unique.add(campaign.employer));
    return Array.from(unique);
  }, []);

  const channels = useMemo(() => {
    const unique = new Set<Channel>();
    campaignsData.forEach((campaign) => campaign.channels.forEach((channel) => unique.add(channel)));
    return Array.from(unique);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || didParseHash.current) {
      return;
    }

    const hash = window.location.hash;
    if (hash.startsWith('#campaigns')) {
      const [, query = ''] = hash.split('?');
      const params = new URLSearchParams(query);
      const employerValues = decodeList(params.get('emp'), employers);
      const channelValues = decodeList(params.get('ch'), channels);
      if (employerValues.length) {
        setSelectedEmployers(employerValues);
      }
      if (channelValues.length) {
        setSelectedChannels(channelValues);
      }
    }

    didParseHash.current = true;
  }, [employers, channels]);

  useEffect(() => {
    if (typeof window === 'undefined' || !didParseHash.current) {
      return;
    }

    const params = new URLSearchParams();
    if (selectedEmployers.length) {
      params.set('emp', selectedEmployers.join(','));
    }
    if (selectedChannels.length) {
      params.set('ch', selectedChannels.join(','));
    }
    const query = params.toString();
    const newHash = `#campaigns${query ? `?${query}` : ''}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedEmployers, selectedChannels]);

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((campaign) => {
      const employerMatch =
        selectedEmployers.length === 0 || selectedEmployers.includes(campaign.employer);
      const channelMatch =
        selectedChannels.length === 0 || campaign.channels.some((channel) => selectedChannels.includes(channel));
      return employerMatch && channelMatch;
    });
  }, [selectedChannels, selectedEmployers]);

  const featuredCampaign = useMemo(
    () => filteredCampaigns.find((campaign) => campaign.id === FEATURED_CAMPAIGN_ID) ?? null,
    [filteredCampaigns]
  );

  const secondaryCampaigns = useMemo(
    () => filteredCampaigns.filter((campaign) => campaign.id !== FEATURED_CAMPAIGN_ID),
    [filteredCampaigns]
  );

  const handleOpen = useCallback(
    (campaign: Campaign, assetIndex: number, trigger: HTMLElement) => {
      setActiveCampaign(campaign);
      setInitialAssetIndex(assetIndex);
      triggerRef.current = trigger;
      setIsModalOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setActiveCampaign(null);
    setInitialAssetIndex(0);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedEmployers([]);
    setSelectedChannels([]);
  }, []);

  const totalCampaigns = campaignsData.length;
  const filteredCount = filteredCampaigns.length;
  const filtersActive = selectedEmployers.length > 0 || selectedChannels.length > 0;
  const noResults = filteredCount === 0;

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
          {(filtersActive || noResults) && (
            <div className="flex flex-wrap items-center gap-4">
              {filtersActive && (
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-600">
                  Showing
                  <span className="font-semibold text-gray-900">{filteredCount}</span>
                  of
                  <span className="font-semibold text-gray-900">{totalCampaigns}</span>
                  campaigns
                </div>
              )}
              {filtersActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                  data-analytics="campaign-reset-filters"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          {noResults ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white/70 p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">No campaigns match these filters</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try clearing your selections or broaden the channels and employers you’re exploring.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                data-analytics="campaign-reset-filters"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {featuredCampaign && (
                <div className="space-y-6 md:grid md:grid-cols-2 md:items-start md:gap-8 md:space-y-0">
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
                  <div className="md:h-full">
                    <CampaignCard campaign={featuredCampaign} onOpen={handleOpen} isFeatured />
                  </div>
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

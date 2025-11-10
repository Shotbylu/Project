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

        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: {} }}
        >
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onOpen={handleOpen} />
          ))}
        </motion.div>
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

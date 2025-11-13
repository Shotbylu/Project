import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import campaignsData, { Campaign } from '../data/campaigns';
import { CampaignCard, VideoModal } from '../components/campaigns'; // Assuming CampaignCard is now the simplified one

// NOTE: All filtering and URL hash logic has been removed for simplification.
// The component now only displays all campaigns in a clean grid.

const Campaigns: React.FC = () => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [initialAssetIndex, setInitialAssetIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use all campaigns, no filtering
  const allCampaigns = useMemo(() => campaignsData, []);

  // Renamed to avoid collision with any existing 'handleOpen'
  const openCampaignModal = useCallback(
    (campaign: Campaign, assetIndex: number) => {
      setActiveCampaign(campaign);
      setInitialAssetIndex(assetIndex);
      // NOTE: Removed triggerRef logic as it's often for focus management after modal close,
      // which is an unnecessary detail for a simplified portfolio.
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
    <section
      id="campaigns"
      className="relative overflow-hidden bg-gradient-to-b from-[#f9fafb] to-[#ffffff] py-24 sm:py-32"
    >
      {/* Removed all complex background animations and effects for a cleaner look */}
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Simplified Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-6 pb-12"
        >
          <span className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#c2410c]">
            Case Studies
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
            Integrated Campaign Portfolio
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#4b5563] sm:text-lg">
            A curated selection of high-impact campaigns, showcasing strategic thinking and measurable results across various clients and channels. Click to view the full case study.
          </p>
        </motion.div>

        {/* Removed Filter UI and related logic entirely */}
        
        <div className="mt-14">
          {/* Display all campaigns in a simple grid */}
          {allCampaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {allCampaigns.map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* NOTE: Removed 'featured' prop from CampaignCard */}
                  <CampaignCard campaign={campaign} onOpen={openCampaignModal} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Kept VideoModal for viewing campaign details */}
      <VideoModal
        campaign={activeCampaign}
        initialAssetIndex={initialAssetIndex}
        isOpen={isModalOpen}
        onClose={handleClose}
        // Removed triggerRef from props
      />
    </section>
  );
};

export default Campaigns;

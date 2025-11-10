import React from 'react';
import { motion } from 'framer-motion';
import type { Channel, Employer } from '../../data/campaigns';

interface CampaignFiltersProps {
  employers: Employer[];
  channels: Channel[];
  selectedEmployers: Employer[];
  selectedChannels: Channel[];
  onEmployersChange: (values: Employer[]) => void;
  onChannelsChange: (values: Channel[]) => void;
}

const baseChipClasses =
  'relative inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300';

const toKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  employers,
  channels,
  selectedEmployers,
  selectedChannels,
  onEmployersChange,
  onChannelsChange
}) => {
  const toggleEmployer = (employer: Employer) => {
    if (selectedEmployers.includes(employer)) {
      onEmployersChange(selectedEmployers.filter((v) => v !== employer));
      return;
    }
    onEmployersChange([...selectedEmployers, employer]);
  };

  const toggleChannel = (channel: Channel) => {
    if (selectedChannels.includes(channel)) {
      onChannelsChange(selectedChannels.filter((v) => v !== channel));
      return;
    }
    onChannelsChange([...selectedChannels, channel]);
  };

  const renderChip = (
    key: string,
    label: string,
    isActive: boolean,
    onClick: () => void,
    analyticsId: string
  ) => (
    <motion.button
      key={key}
      layout
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`${baseChipClasses} ${
        isActive
          ? 'border-transparent bg-[#FF6B00] text-white shadow-md'
          : 'border-gray-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6B00]'
      }`}
      data-analytics={`campaign-filter-${analyticsId}`}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="space-y-8 text-slate-600">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Employers</h3>
        <div className="flex flex-wrap gap-2.5">
          {renderChip('employer-all', 'All', selectedEmployers.length === 0, () => onEmployersChange([]), 'employer-all')}
          {employers.map((employer) =>
            renderChip(
              `employer-${toKey(employer)}`,
              employer,
              selectedEmployers.includes(employer),
              () => toggleEmployer(employer),
              `employer-${toKey(employer)}`
            )
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Channels</h3>
        <div className="flex flex-wrap gap-2.5">
          {renderChip('channel-all', 'All', selectedChannels.length === 0, () => onChannelsChange([]), 'channel-all')}
          {channels.map((channel) =>
            renderChip(
              `channel-${toKey(channel)}`,
              channel,
              selectedChannels.includes(channel),
              () => toggleChannel(channel),
              `channel-${toKey(channel)}`
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignFilters;

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
  'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500';

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
      onEmployersChange(selectedEmployers.filter((value) => value !== employer));
      return;
    }
    onEmployersChange([...selectedEmployers, employer]);
  };

  const toggleChannel = (channel: Channel) => {
    if (selectedChannels.includes(channel)) {
      onChannelsChange(selectedChannels.filter((value) => value !== channel));
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
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`${baseChipClasses} ${
        isActive ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
      }`}
      data-analytics={`campaign-filter-${analyticsId}`}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Employers</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {renderChip(
            'employer-all',
            'All',
            selectedEmployers.length === 0,
            () => onEmployersChange([]),
            'employer-all'
          )}
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
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Channels</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {renderChip(
            'channel-all',
            'All',
            selectedChannels.length === 0,
            () => onChannelsChange([]),
            'channel-all'
          )}
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

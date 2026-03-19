import { Radio, Signal } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const ChannelDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="channels"
      title="Channel Drill"
      headerEyebrowColorClass="text-blue-200"
      orbClassName="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Signal}
      sideIcon={Radio}
      sideTitle="Memory Anchors"
      sideItems={[
        { text: 'Channel 16: voice distress, safety and calling.' },
        { text: 'Channel 70: DSC only, never voice.' },
        { text: 'Routine contact: make contact, then move to a working channel.' },
        { text: 'Use port operations / harbour channels for marinas and ports.' },
      ]}
      attemptsLabel="channel attempts recorded"
      resultPanelClassName="bg-blue-500/10 border-blue-500/20"
    />
  );
};

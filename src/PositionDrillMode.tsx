import { MapPinned, Target } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const PositionDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="position"
      title="Position / MMSI / Callsign"
      headerEyebrowColorClass="text-yellow-300"
      orbClassName="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Target}
      sideIcon={MapPinned}
      sideTitle="Memory Anchors"
      sideItems={[
        { text: 'Position is the most important single item in a distress message.' },
        { text: 'Use latitude first, then longitude.' },
        { text: 'Use phonetics and spoken digits for callsigns and awkward names.' },
        { text: 'MMSI identifies the radio installation and matters in DSC follow-up.' },
      ]}
      attemptsLabel="position/identity attempts recorded"
      resultPanelClassName="bg-yellow-500/10 border-yellow-500/20"
    />
  );
};

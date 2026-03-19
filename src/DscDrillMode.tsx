import { RadioTower, Satellite } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const DscDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="dsc"
      title="DSC Drill"
      headerEyebrowColorClass="text-blue-200"
      orbClassName="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Satellite}
      sideIcon={RadioTower}
      sideTitle="DSC Flow"
      sideItems={[
        { text: '1. Trigger DSC alert or call on Channel 70.' },
        { text: '2. Include MMSI and position data if the set has GPS input.' },
        { text: '3. Follow urgency/safety/distress logic correctly.' },
        { text: '4. Make the required voice follow-up on Channel 16 or working channel.' },
      ]}
      attemptsLabel="DSC attempts recorded"
      resultPanelClassName="bg-blue-500/10 border-blue-500/20"
    />
  );
};

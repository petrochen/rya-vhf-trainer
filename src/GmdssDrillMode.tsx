import { LifeBuoy, Satellite } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const GmdssDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="gmdss"
      title="GMDSS Systems Drill"
      headerEyebrowColorClass="text-emerald-300"
      orbClassName="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Satellite}
      sideIcon={LifeBuoy}
      sideTitle="System Anchors"
      sideItems={[
        { text: 'RCC coordinates SAR; sea-area awareness frames facility access.' },
        { text: 'NAVTEX is the MSI text broadcast subsystem.' },
        { text: 'EPIRB and SART are alerting/locating tools, not routine voice tools.' },
        { text: 'False-alert cancellation and distress-frequency protection are mandatory.' },
      ]}
      attemptsLabel="GMDSS theory attempts recorded"
      resultPanelClassName="bg-emerald-500/10 border-emerald-500/20"
    />
  );
};

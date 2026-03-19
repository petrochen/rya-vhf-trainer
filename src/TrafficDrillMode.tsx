import { Siren, VolumeX } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const TrafficDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="traffic"
      title="Acknowledgement / Mayday Relay"
      headerEyebrowColorClass="text-red-200"
      orbClassName="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Siren}
      sideIcon={VolumeX}
      sideTitle="Distress Discipline"
      sideItems={[
        { text: 'Subsequent distress traffic connected with the incident begins with `Mayday`.' },
        { text: 'Do not interfere if a coast station is likely handling the incident.' },
        { text: 'Use `Mayday Relay` only when relaying distress for another casualty.' },
        { text: '`Seelonce` protects distress traffic from interference.' },
      ]}
      attemptsLabel="distress-traffic attempts recorded"
      resultPanelClassName="bg-red-500/10 border-red-500/20"
    />
  );
};

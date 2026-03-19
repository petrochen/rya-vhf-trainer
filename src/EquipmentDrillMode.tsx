import { Radio, Signal } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const EquipmentDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="equipment"
      title="Equipment / Controls Drill"
      headerEyebrowColorClass="text-blue-200"
      orbClassName="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Signal}
      sideIcon={Radio}
      sideTitle="Control Essentials"
      sideItems={[
        { text: 'Know simplex/semi-duplex/duplex channel concepts.' },
        { text: 'Know dual watch, power/PTT/volume/squelch/dimmer behavior.' },
        { text: 'Use low power for local traffic where possible.' },
        { text: 'Battery and antenna readiness affect emergency reliability.' },
      ]}
      attemptsLabel="equipment/control attempts recorded"
      resultPanelClassName="bg-blue-500/10 border-blue-500/20"
    />
  );
};

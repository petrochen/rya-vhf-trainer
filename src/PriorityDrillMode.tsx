import { AlertTriangle, LifeBuoy } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';

export const PriorityDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="priority"
      title="Priority Drill"
      headerEyebrowColorClass="text-red-200"
      orbClassName="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={AlertTriangle}
      sideIcon={LifeBuoy}
      sideTitle="Decision Rule"
      sideItems={[
        { text: 'Mayday: grave and imminent danger.' },
        { text: 'Pan Pan: urgent situation, not yet distress.' },
        { text: 'Securite: navigational or meteorological warning.' },
        { text: 'Routine: ordinary communication and operations.' },
      ]}
      attemptsLabel="priority attempts recorded"
      resultPanelClassName="bg-red-500/10 border-red-500/20"
    />
  );
};

import { Compass, Map } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';
import { CHANNEL_PLAN_SIM_QUESTIONS } from './srcData';

export const ChannelPlanMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="channels"
      title="Channel Plan Simulator"
      headerEyebrowColorClass="text-sky-300"
      orbClassName="absolute top-0 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none"
      accuracyIcon={Compass}
      sideIcon={Map}
      sideTitle="Chart Decision Logic"
      sideItems={[
        { text: 'Classify service first: distress/safety/calling, intership, port ops, ship movement, or public correspondence.' },
        { text: 'Keep Channel 16 clear for calling/distress/safety. Shift routine traffic to the right working channel early.' },
        { text: 'Channel 70 is DSC only; never voice.' },
        { text: 'Use locally published channels for harbour, pilot, VTS, and port-operation traffic.' },
      ]}
      attemptsLabel="channel-plan attempts recorded"
      resultPanelClassName="bg-sky-500/10 border-sky-500/20"
      questionsOverride={CHANNEL_PLAN_SIM_QUESTIONS}
    />
  );
};

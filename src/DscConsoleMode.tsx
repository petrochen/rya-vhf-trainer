import { RadioTower, SlidersHorizontal } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';
import { DSC_CONSOLE_DRILL_QUESTIONS } from './srcData';

export const DscConsoleMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="dsc"
      title="DSC Console Drill"
      headerEyebrowColorClass="text-indigo-300"
      orbClassName="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"
      accuracyIcon={SlidersHorizontal}
      sideIcon={RadioTower}
      sideTitle="Console Flow Anchors"
      sideItems={[
        { text: 'Keep DSC watchkeeping active on Channel 70 and maintain controller readiness.' },
        { text: 'Use correct DSC call type/addressing: distress, all ships, individual, geographic area, group.' },
        { text: 'Protect distress channels: approved testing, false-alert cancellation, no voice on 70.' },
        { text: 'After DSC distress alert, send immediate MAYDAY voice follow-up on Channel 16.' },
      ]}
      attemptsLabel="DSC-console attempts recorded"
      resultPanelClassName="bg-indigo-500/10 border-indigo-500/20"
      questionsOverride={DSC_CONSOLE_DRILL_QUESTIONS}
    />
  );
};

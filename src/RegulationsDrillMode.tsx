import { BookOpen, Shield } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';
import type { ExamQuestion } from './srcData';

interface RegulationUsageExample {
  when: string;
  exchange: string[];
  note?: string;
}

const REGULATION_EXAMPLES: Record<string, RegulationUsageExample> = {
  'reg-licence': {
    when: 'Pre-departure checks on a charter yacht before first transmission.',
    exchange: [
      'Skipper: Before we call harbour control, confirm the ship station licence is valid.',
      'Crew: Licence is onboard and current; SRC-qualified operator on watch.',
      'Skipper: Good. We are compliant to transmit.',
    ],
  },
  'reg-operator-control': {
    when: 'A non-certified crew member is asked to pass a message while the SRC holder supervises.',
    exchange: [
      'Crew: Shall I answer the harbour office now?',
      'SRC Holder: Yes, I am controlling this exchange. Keep standard format and read back exactly.',
      'Crew: Harbour Office, this is Yacht Meridian, received your instruction, Over.',
    ],
  },
  'reg-secrecy': {
    when: 'You overhear private medical traffic not addressed to your vessel.',
    exchange: [
      'Crew: We heard their patient details. Should I share this on the marina chat?',
      'Skipper: Negative. Secrecy of correspondence applies. We do not disclose private traffic.',
      'Crew: Understood. I will keep it confidential.',
    ],
  },
  'reg-logbook': {
    when: 'After handling urgency traffic and a follow-up working-channel exchange.',
    exchange: [
      'Skipper: Log entry please: Pan Pan at 1420 UTC on channel 16, shifted working channel 67.',
      'Crew: Logged with time, station, channel, and action taken.',
      'Skipper: Good. Keep records aligned with national rules.',
    ],
  },
  'reg-prohibited-traffic': {
    when: 'Crew proposes an on-air fake emergency as a test.',
    exchange: [
      'Crew: Should we send a practice Pan Pan now to test range?',
      'Skipper: Negative. False or improper traffic is prohibited.',
      'Skipper: We use approved test procedures only.',
    ],
  },
  'reg-public-correspondence': {
    when: 'Routine request for a coast-station link call to a shore number.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, Solent Coastguard, this is Yacht Meridian, request public correspondence link call, Over.',
      'Solent Coastguard: Yacht Meridian, this is Solent Coastguard, pass destination number and billing details, Over.',
      'Yacht Meridian: Destination plus details passed, request link establishment, Over.',
    ],
  },
  'reg-aaic': {
    when: 'The coast station asks for charging authority details before connecting a billed service.',
    exchange: [
      'Coast Station: Yacht Meridian, pass your AAIC for charging, Over.',
      'Yacht Meridian: AAIC passed, request continuation of public correspondence call, Over.',
      'Coast Station: Received AAIC, link call being established, Over.',
    ],
  },
  'reg-garbled-unanswered': {
    when: 'Initial call gets no reply, then unreadable fragments are received.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, Solent Coastguard, this is Yacht Meridian, Over.',
      'Yacht Meridian: No reply observed. Repeating call in standard format.',
      'Yacht Meridian: Your last transmission unreadable, say again all after "Yacht Meridian", Over.',
    ],
  },
  'reg-coast-call-methods': {
    when: 'Routine coast-station contact where both voice and DSC are available.',
    exchange: [
      'Operator briefing: Use DSC routine call setup when suitable; confirm follow-up voice channel.',
      'Operator briefing: If required, call directly by radiotelephony in correct coast-station format.',
      'Operator briefing: Both methods are valid and exam-relevant.',
    ],
  },
  'reg-channel-routine-scope': {
    when: 'Same communication discipline applied across different service contexts.',
    exchange: [
      'Intership: Yacht Aurora, this is Yacht Meridian, request passing arrangement, Over.',
      'Port ops: Harbour Control, this is Yacht Meridian, request inbound instruction, Over.',
      'Public correspondence: Coast Station, this is Yacht Meridian, request link call, Over.',
    ],
  },
};

const getRegulationExample = (question: ExamQuestion): RegulationUsageExample | null => {
  if (question.topic !== 'regulations') {
    return null;
  }
  return REGULATION_EXAMPLES[question.id] ?? null;
};

export const RegulationsDrillMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="regulations"
      title="Regulations / Public Correspondence"
      headerEyebrowColorClass="text-red-200"
      orbClassName="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Shield}
      sideIcon={BookOpen}
      sideTitle="Regulatory Anchors"
      sideItems={[
        { text: 'Licence + operator control: who can legally control transmissions.' },
        { text: 'Secrecy + prohibited traffic: what must never be disclosed or transmitted.' },
        { text: 'Radio records: keep required logs under national regulations.' },
        { text: 'Public correspondence: coast-call flow, AAIC, unanswered/garbled recovery.' },
      ]}
      attemptsLabel="regulatory attempts recorded"
      resultPanelClassName="bg-red-500/10 border-red-500/20"
      getCorrectAnswerExample={getRegulationExample}
    />
  );
};

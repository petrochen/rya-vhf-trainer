import { MessageSquareQuote, Type } from 'lucide-react';
import { TopicDrillMode } from './TopicDrillMode';
import type { SharedDrillProps } from './TopicDrillMode';
import type { ExamQuestion } from './srcData';

const PROCEDURE_WORDS = [
  { word: 'This is', meaning: 'Introduces your station identity.' },
  { word: 'Over', meaning: 'End of transmission, reply expected.' },
  { word: 'Out', meaning: 'Exchange finished, no reply expected.' },
  { word: 'Received', meaning: 'Message received and understood.' },
  { word: 'Say again', meaning: 'Please repeat what you just transmitted.' },
  { word: 'I say again', meaning: 'I am repeating part of my own message for emphasis/clarity.' },
  { word: 'Read back', meaning: 'Repeat my message back to me.' },
  { word: 'Radio check', meaning: 'Report readability and signal strength.' },
  { word: 'Station calling', meaning: 'Used when the calling station identity is unknown/unclear.' },
  { word: 'All before', meaning: 'Repeat all words before the reference word/group.' },
  { word: 'All after', meaning: 'Repeat all words after the reference word/group.' },
  { word: 'Word before', meaning: 'Repeat the single word immediately before the reference word.' },
  { word: 'Word after', meaning: 'Repeat the single word immediately after the reference word.' },
  { word: 'In figures', meaning: 'Following details are to be passed as numerical figures.' },
  { word: 'In letters', meaning: 'Following details are to be passed letter by letter.' },
  { word: 'Correct', meaning: 'Confirms previously repeated information is correct.' },
  { word: 'Correction', meaning: 'I am correcting what I just transmitted.' },
  { word: 'Wrong', meaning: 'The repeated or received information is incorrect.' },
  { word: 'I spell', meaning: 'Next word will be spelt phonetically.' },
  { word: 'Text', meaning: 'Indicates message text/content follows.' },
  { word: 'Traffic', meaning: 'Indicates traffic/message context.' },
  { word: 'Wait', meaning: 'Pause and stand by for further transmission.' },
];

interface ProcedureUsageExample {
  when: string;
  exchange: string[];
  note?: string;
}

const PROCEDURE_WORD_EXAMPLES: Record<string, ProcedureUsageExample> = {
  'proc-over': {
    when: 'Routine berth request where you are passing the turn back to the harbour office for instructions.',
    exchange: [
      'Yacht Meridian: Lymington Harbour, Lymington Harbour, Lymington Harbour, this is Yacht Meridian, Yacht Meridian, Yacht Meridian, request visitor berth for one night, Over.',
      'Lymington Harbour: Yacht Meridian, this is Lymington Harbour, allocated berth F12 on hammerhead pontoon, report when secure, Over.',
      'Yacht Meridian: Lymington Harbour, Yacht Meridian, Received berth F12, will report secure, Out.',
    ],
    note: 'Use `Over` only when the other station is expected to respond immediately.',
  },
  'proc-readback': {
    when: 'After transmitting critical details such as position, channel, ETA, or safety restrictions.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, this is Yacht Meridian, position five-zero degrees four-eight decimal two minutes North, zero-zero-one degrees two-two decimal six minutes West, one engine disabled, Read back, Over.',
      'Solent Coastguard: Yacht Meridian, read back: position five-zero degrees four-eight decimal two minutes North, zero-zero-one degrees two-two decimal six minutes West, one engine disabled, Over.',
      'Yacht Meridian: Solent Coastguard, Correct, Out.',
    ],
  },
  'proc-say-again': {
    when: 'When words were lost or masked by static and you need repetition of the transmission.',
    exchange: [
      'Yacht Meridian: Yarmouth Harbour, your last unreadable in static, Say again all after "visitor berth", Over.',
      'Yarmouth Harbour: Yacht Meridian, all after "visitor berth": pontoon Bravo, berth B7, Over.',
      'Yacht Meridian: Yarmouth Harbour, Received pontoon Bravo berth B7, Out.',
    ],
  },
  'proc-radio-check': {
    when: 'Pre-departure equipment check or after antenna/power changes.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, Solent Coastguard, this is Yacht Meridian on channel one-six, Radio check, Over.',
      'Solent Coastguard: Yacht Meridian, readability five, signal strength four, Out.',
      'Yacht Meridian: Solent Coastguard, Received, thank you, Out.',
    ],
  },
  'proc-i-spell': {
    when: 'When vessel name, berth code, or callsign is unusual and could be misunderstood.',
    exchange: [
      'Yacht Xylia: Haslar Marina, Haslar Marina, this is Yacht Xylia, I spell Xylia: X-ray Yankee Lima India Alpha, Over.',
      'Haslar Marina: Yacht Xylia, Received spelling, proceed to fuel berth Charlie, Over.',
      'Yacht Xylia: Haslar Marina, Received fuel berth Charlie, Out.',
    ],
  },
  'proc-over-out': {
    when: 'Never as a single phrase. Use either `Over` or `Out` depending on whether a reply is expected.',
    exchange: [
      'Incorrect: "Lymington Harbour, request berth F12, Over and out."',
      'Correct (reply expected): "Lymington Harbour, request berth F12, Over."',
      'Correct (exchange complete): "Lymington Harbour, Received berth F12, Out."',
    ],
    note: '`Over` and `Out` are mutually exclusive in the same transmission.',
  },
  'proc-correction': {
    when: 'Immediate self-correction in the same transmission after a spoken error.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, position five-zero degrees one-two decimal four minutes North,',
      'Yacht Meridian: Correction, five-zero degrees two-one decimal four minutes North, zero-zero-one degrees one-eight decimal zero minutes West, drifting east, Over.',
      'Solent Coastguard: Yacht Meridian, Received corrected position, Over.',
      'Yacht Meridian: Solent Coastguard, Received, Out.',
    ],
  },
  'proc-wait': {
    when: 'You need the other station to hold while checking details or coordinating internally.',
    exchange: [
      'Yacht Meridian: Poole Harbour Radio, request next bridge opening for Town Quay, Over.',
      'Poole Harbour Radio: Yacht Meridian, Wait one minute while I confirm commercial traffic window, Over.',
      'Yacht Meridian: Poole Harbour Radio, Waiting, Out.',
      'Poole Harbour Radio: Yacht Meridian, opening at one-six-two-zero local, Over.',
      'Yacht Meridian: Poole Harbour Radio, Received one-six-two-zero, Out.',
    ],
  },
  'proc-this-is': {
    when: 'After calling a station, before giving your vessel identity and callsign.',
    exchange: [
      'Yacht Meridian: Cowes Harbour, Cowes Harbour, Cowes Harbour,',
      'Yacht Meridian: This is Yacht Meridian, call sign Mike Echo Romeo India Delta, request inbound instructions, Over.',
      'Cowes Harbour: Yacht Meridian, this is Cowes Harbour, stand by for traffic update, Over.',
    ],
  },
  'proc-received': {
    when: 'To confirm instructions were heard and understood correctly.',
    exchange: [
      'Solent Coastguard: Yacht Meridian, switch to channel six-seven for working traffic, Over.',
      'Yacht Meridian: Solent Coastguard, Received, switching to six-seven now, Out.',
      'Solent Coastguard: Yacht Meridian, Out.',
    ],
  },
  'proc-station-calling': {
    when: 'You hear your vessel being called but cannot identify the caller.',
    exchange: [
      'Unknown station: ...Meridian... unreadable transmission...',
      'Yacht Meridian: Station calling Yacht Meridian, this is Yacht Meridian, say again your station name and channel, Over.',
      'Yacht Aurora: Yacht Meridian, this is Yacht Aurora on six-eight, Over.',
      'Yacht Meridian: Yacht Aurora, Received, switch to six-eight, Out.',
    ],
  },
  'proc-all-before': {
    when: 'You need repeat of everything before a reference word in a long instruction.',
    exchange: [
      'Harbour Office: Yacht Meridian, proceed to buoy ALFA then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Say again all before "DELTA", Over.',
      'Harbour Office: Yacht Meridian, proceed to buoy ALFA then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Received, Out.',
    ],
  },
  'proc-all-after': {
    when: 'You need repeat of everything after a reference word.',
    exchange: [
      'Harbour Office: Yacht Meridian, proceed to buoy ALFA then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Say again all after "ALFA", Over.',
      'Harbour Office: Yacht Meridian, all after "ALFA": then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Received, Out.',
    ],
  },
  'proc-word-before': {
    when: 'Only one missing word immediately before a known reference word.',
    exchange: [
      'Harbour Office: Yacht Meridian, proceed to buoy ALFA then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Word before "DELTA", Over.',
      'Harbour Office: Yacht Meridian, "berth", Over.',
      'Yacht Meridian: Harbour Office, Received, Out.',
    ],
  },
  'proc-word-after': {
    when: 'Only one missing word immediately after a known reference word.',
    exchange: [
      'Harbour Office: Yacht Meridian, proceed to buoy ALFA then berth DELTA seven, Over.',
      'Yacht Meridian: Harbour Office, Word after "ALFA", Over.',
      'Harbour Office: Yacht Meridian, "then", Over.',
      'Yacht Meridian: Harbour Office, Received, Out.',
    ],
  },
  'proc-in-figures': {
    when: 'Before numeric data such as ETA, distance, speed, headings, or coordinates.',
    exchange: [
      'Yacht Meridian: Portsmouth Harbour, Traffic.',
      'Yacht Meridian: In figures: ETA one-five-four-five, distance two decimal four miles, speed five knots, Over.',
      'Portsmouth Harbour: Yacht Meridian, Received figures, Over.',
      'Yacht Meridian: Portsmouth Harbour, Out.',
    ],
  },
  'proc-in-letters': {
    when: 'Before transmitting letters one by one, for berth codes, references, or identifiers.',
    exchange: [
      'Harbour Office: Yacht Meridian, confirm berth code, Over.',
      'Yacht Meridian: Harbour Office, In letters: DELTA, D Echo Lima Tango Alpha, Over.',
      'Harbour Office: Yacht Meridian, Received DELTA, Over.',
      'Yacht Meridian: Harbour Office, Out.',
    ],
  },
  'proc-i-say-again': {
    when: 'You, as sender, intentionally repeat your own phrase for emphasis and clarity.',
    exchange: [
      'Yacht Meridian: All stations, all stations, all stations, this is Yacht Meridian.',
      'Yacht Meridian: Keep clear of fairway entrance due outbound ferry.',
      'Yacht Meridian: I say again, keep clear of fairway entrance due outbound ferry, Over.',
      'Yacht Aurora: Yacht Meridian, Received, Out.',
    ],
  },
  'proc-correct': {
    when: 'After another station reads back your message accurately and you need to approve it.',
    exchange: [
      'Harbour Office: Yacht Meridian, your working channel is six-seven. Read back, Over.',
      'Yacht Meridian: Harbour Office, working channel six-seven, Over.',
      'Harbour Office: Yacht Meridian, Correct, Out.',
      'Yacht Meridian: Harbour Office, Out.',
    ],
  },
  'proc-wrong': {
    when: 'During verification, when read-back contains an error before issuing corrected content.',
    exchange: [
      'Harbour Office: Yacht Meridian, read back your allocated berth, Over.',
      'Yacht Meridian: Harbour Office, berth Charlie one-two, Over.',
      'Harbour Office: Yacht Meridian, Wrong. Correction: berth Charlie one-three, Over.',
      'Yacht Meridian: Harbour Office, Received berth Charlie one-three, Out.',
    ],
  },
  'proc-text': {
    when: 'Use as an explicit marker that the message body/content follows.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, this is Yacht Meridian, Traffic: safety advisory.',
      'Yacht Meridian: Text: drifting container one mile south of Calshot Spit, Over.',
      'Solent Coastguard: Yacht Meridian, Received text, maintain watch on one-six, Over.',
      'Yacht Meridian: Solent Coastguard, Received, Out.',
    ],
  },
  'proc-traffic': {
    when: 'Use as a context marker to classify the transmission before details follow.',
    exchange: [
      'Yacht Meridian: Cowes Harbour, this is Yacht Meridian, Traffic: routine arrival.',
      'Yacht Meridian: Text: request visitor berth and fuel on arrival at one-six-three-zero, Over.',
      'Cowes Harbour: Yacht Meridian, Received routine traffic, call again at fairway buoy, Over.',
      'Yacht Meridian: Cowes Harbour, Out.',
    ],
  },
  'proc-smnv-question-marker': {
    when: 'SMNV marker `QUESTION` before an interrogative message in constrained traffic situations.',
    exchange: [
      'Yacht Meridian: Southampton VTS, Southampton VTS, this is Yacht Meridian.',
      'Yacht Meridian: QUESTION: what is the inbound working channel for small craft from west, Over.',
      'Southampton VTS: Yacht Meridian, inbound working channel is six-eight, Over.',
      'Yacht Meridian: Southampton VTS, Received six-eight, Out.',
    ],
  },
  'proc-smnv-intention-marker': {
    when: 'SMNV marker `INTENTION` to announce immediate manoeuvring actions to nearby traffic.',
    exchange: [
      'Yacht Meridian: All stations in Yarmouth entrance, this is Yacht Meridian.',
      'Yacht Meridian: INTENTION: altering to starboard and entering fairway at slow speed, Over.',
      'Pilot Boat Alpha: Yacht Meridian, Received your intention, keeping clear to port, Over.',
      'Yacht Meridian: Pilot Boat Alpha, Received, Out.',
    ],
  },
  'proc-smnv-answer-marker': {
    when: 'SMNV marker `ANSWER` to signal that your message is a reply to a previous question.',
    exchange: [
      'Southampton VTS: Yacht Meridian, QUESTION: confirm your destination berth, Over.',
      'Yacht Meridian: Southampton VTS, ANSWER: destination Ocean Village visitor pontoon, Over.',
      'Southampton VTS: Yacht Meridian, Received, Out.',
    ],
  },
  'proc-smnv-request-marker': {
    when: 'SMNV marker `REQUEST` before asking another station to take an action.',
    exchange: [
      'Yacht Meridian: Harbour Control, REQUEST: advise inbound sequence for small craft, Over.',
      'Harbour Control: Yacht Meridian, stand by for sequence assignment, Over.',
      'Yacht Meridian: Harbour Control, Received, Out.',
    ],
  },
  'proc-smnv-information-marker': {
    when: 'SMNV marker `INFORMATION` for factual observed conditions only.',
    exchange: [
      'Yacht Meridian: All stations, INFORMATION: visibility now less than one cable near river entrance, Over.',
      'Pilot Boat Alpha: Yacht Meridian, Received visibility report, Out.',
    ],
  },
  'proc-smnv-warning-marker': {
    when: 'SMNV marker `WARNING` when alerting traffic to danger.',
    exchange: [
      'Yacht Meridian: All stations, WARNING: semi-submerged object south of Calshot Spit, Over.',
      'Solent Coastguard: Yacht Meridian, Received warning, continue to monitor one-six, Over.',
      'Yacht Meridian: Solent Coastguard, Received, Out.',
    ],
  },
  'proc-smnv-advice-marker': {
    when: 'SMNV marker `ADVICE` for recommendation intended to influence another vessel safely.',
    exchange: [
      'Harbour Control: Yacht Meridian, ADVICE: keep to east side of channel due outbound ferry, Over.',
      'Yacht Meridian: Harbour Control, Received advice, keeping east side, Out.',
    ],
  },
  'proc-smnv-instruction-marker': {
    when: 'SMNV marker `INSTRUCTION` for mandatory direction/regulatory control.',
    exchange: [
      'Harbour Control: Yacht Meridian, INSTRUCTION: hold position north of buoy Alfa until released, Over.',
      'Yacht Meridian: Harbour Control, Received instruction, holding north of buoy Alfa, Out.',
    ],
  },
  'proc-smnv-standby-response': {
    when: 'Use `Stand by` when information is not immediately available but will follow shortly.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, QUESTION: latest tug movement at entrance, Over.',
      'Solent Coastguard: Yacht Meridian, Stand by, checking with harbour control, Over.',
      'Yacht Meridian: Solent Coastguard, Standing by, Out.',
      'Solent Coastguard: Yacht Meridian, ANSWER: tug movement in ten minutes, Over.',
      'Yacht Meridian: Solent Coastguard, Received, Out.',
    ],
  },
  'proc-smnv-no-information': {
    when: 'Use this exact response when requested information is unavailable at that moment.',
    exchange: [
      'Yacht Meridian: Solent Coastguard, request latest report on drifting flare sighting in central Solent, Over.',
      'Solent Coastguard: Yacht Meridian, No information at this time, Over.',
      'Yacht Meridian: Solent Coastguard, Received no information, Out.',
    ],
  },
  'proc-smnv-not-understood': {
    when: 'Transmission is heard but meaning is unclear; then request repetition.',
    exchange: [
      'Harbour Office: Yacht Meridian, berth allocation partially unreadable due interference, Over.',
      'Yacht Meridian: Harbour Office, Message not understood, Say again all after "allocation", Over.',
      'Harbour Office: Yacht Meridian, all after "allocation": berth Bravo nine, Over.',
      'Yacht Meridian: Harbour Office, Received berth Bravo nine, Out.',
    ],
  },
};

const getProcedureExample = (question: ExamQuestion): ProcedureUsageExample | null => {
  if (question.topic !== 'procedure') {
    return null;
  }
  return PROCEDURE_WORD_EXAMPLES[question.id] ?? null;
};

export const ProcedureWordsMode = (props: SharedDrillProps) => {
  return (
    <TopicDrillMode
      {...props}
      topic="procedure"
      title="Procedure Words"
      headerEyebrowColorClass="text-emerald-300"
      orbClassName="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"
      accuracyIcon={Type}
      sideIcon={MessageSquareQuote}
      sideTitle="Reference"
      sideItems={PROCEDURE_WORDS.map((entry) => ({
        label: entry.word,
        text: entry.meaning,
      }))}
      attemptsLabel="procedure-word attempts recorded"
      resultPanelClassName="bg-emerald-500/10 border-emerald-500/20"
      getCorrectAnswerExample={getProcedureExample}
    />
  );
};

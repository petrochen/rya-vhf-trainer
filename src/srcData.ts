export type ExamTopic =
  | 'equipment'
  | 'priority'
  | 'channels'
  | 'dsc'
  | 'procedure'
  | 'position'
  | 'traffic'
  | 'gmdss'
  | 'regulations';

export interface HandbookModule {
  id: string;
  title: string;
  pages: string;
  summary: string;
  skills: string[];
}

export interface ExamQuestionOption {
  id: string;
  label: string;
}

export interface ExamQuestion {
  id: string;
  topic: ExamTopic;
  eyebrow: string;
  title: string;
  prompt: string;
  options: ExamQuestionOption[];
  answer: string;
  explanation: string;
  handbookRef: string;
}

export interface TopicRules {
  title: string;
  bullets: string[];
}

export interface LearnSection {
  id: string;
  title: string;
  pages: string;
  objective: string;
  examFocus: string[];
  essentials: string[];
}

export interface SyllabusBlock {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  title: string;
  pages: string;
  exactKnowledge: string[];
}

export interface ExamCriticalItem {
  id: string;
  label: string;
  why: string;
  handbookRef: string;
}

export interface ProcedureTemplate {
  id: string;
  type: ExamTopic | 'routine-call';
  title: string;
  intro: string;
  steps: string[];
}

export const HANDBOOK_MODULES: HandbookModule[] = [
  {
    id: 'radio-basics',
    title: 'Radio Basics And Channels',
    pages: 'pp. 21-29',
    summary: 'Controls, watchkeeping, simplex vs duplex, Channel 16, Channel 70 and working channels.',
    skills: ['radio setup', 'channel discipline', 'working-channel shift'],
  },
  {
    id: 'routine-procedure',
    title: 'Routine Voice Procedure',
    pages: 'pp. 30-42',
    summary: 'Routine calls, coast stations, radio checks, standard vocabulary and phonetic spelling.',
    skills: ['call format', 'over vs out', 'phonetic alphabet'],
  },
  {
    id: 'priority-calls',
    title: 'Priority Calls',
    pages: 'pp. 43-54',
    summary: 'Distress, urgency and safety criteria with Mayday, Pan Pan and Securite examples.',
    skills: ['scenario classification', 'message order', 'medical advice'],
  },
  {
    id: 'dsc',
    title: 'DSC And GMDSS',
    pages: 'pp. 55-71',
    summary: 'MMSI, DSC categories, distress alerts, urgency/safety calls and follow-up voice actions.',
    skills: ['DSC flow', 'MMSI awareness', 'post-alert procedure'],
  },
  {
    id: 'gmdss-systems',
    title: 'GMDSS Systems And SAR',
    pages: 'pp. 74-76',
    summary: 'Sea areas, RCC/SAR role, NAVTEX MSI, EPIRB and SART operation/testing expectations.',
    skills: ['SAR awareness', 'NAVTEX', 'EPIRB/SART'],
  },
  {
    id: 'regulations',
    title: 'Regulations And Public Correspondence',
    pages: 'p. 77',
    summary: 'Licence/operator control, secrecy, radio record keeping, prohibited calls, AAIC and public correspondence.',
    skills: ['regulatory compliance', 'public correspondence', 'radio log discipline'],
  },
  {
    id: 'exam-syllabus',
    title: 'Exam Syllabus And SMNV',
    pages: 'pp. 72-84',
    summary: 'What the SRC exam checks: procedures, signals, standard words, channels and practical operation.',
    skills: ['exam coverage', 'standard responses', 'channel recall'],
  },
];

export const EXAM_TOPIC_LABELS: Record<ExamTopic, string> = {
  equipment: 'Equipment / Controls',
  priority: 'Priority',
  channels: 'Channels',
  dsc: 'DSC',
  procedure: 'Procedure Words',
  position: 'Position / Identity',
  traffic: 'Distress Traffic',
  gmdss: 'GMDSS Systems',
  regulations: 'Regulations',
};

export const QUICK_RULES: Record<ExamTopic, TopicRules> = {
  equipment: {
    title: 'Equipment And Control Discipline',
    bullets: [
      'Know simplex, semi-duplex and duplex channel concepts.',
      'Know core controls: power, PTT, volume, squelch, high/low power, dimmer, dual watch.',
      'Use high power for range when needed; keep low power for short-range local calls.',
      'Battery state, charging and antenna condition directly affect reliability.',
    ],
  },
  priority: {
    title: 'Priority Ladder',
    bullets: [
      'Use `Mayday` only for grave and imminent danger to a vessel, aircraft, vehicle or person.',
      'Use `Pan Pan` for urgent situations that need priority but are not yet distress.',
      'Use `Securite` for navigational or meteorological safety information.',
      'Routine traffic belongs on a working channel after initial contact.',
    ],
  },
  channels: {
    title: 'Channel Memory',
    bullets: [
      'Channel 16 is for distress, safety and calling.',
      'Channel 70 is for DSC alerts and calls only, never voice traffic.',
      'Routine calls should move off 16 onto a working channel as soon as contact is made.',
      'Use the published port operations channel for harbours and marinas; do not occupy 16.',
    ],
  },
  dsc: {
    title: 'DSC Essentials',
    bullets: [
      'A DSC distress alert should be followed immediately by a Mayday voice call on 16.',
      'A DSC controller should ideally receive GPS position and time updates.',
      '`MMSI` is the nine-digit identity for the radio installation.',
      'Urgency and safety DSC calls still require a follow-up voice message.',
    ],
  },
  procedure: {
    title: 'Words That Matter',
    bullets: [
      '`Over` means you expect a reply; `Out` means the exchange is finished.',
      '`Say again` asks for repetition; `Read back` asks the other station to repeat your message.',
      '`Radio check` asks for signal readability and strength.',
      'Appendix basic signals also include `All before/after`, `Word before/after`, `In figures/letters`, `Received`, `Wrong`, and `Station calling`.',
    ],
  },
  position: {
    title: 'Identity And Position',
    bullets: [
      'Identity must be clear: vessel name, callsign and MMSI where relevant.',
      'Position is the most important single item in a distress message.',
      'Speak coordinates clearly using degrees, minutes and cardinal directions.',
      'Use phonetic alphabet and spoken digits to avoid ambiguity in names and identifiers.',
    ],
  },
  traffic: {
    title: 'Distress Traffic Discipline',
    bullets: [
      'After receiving a Mayday, acknowledgements and subsequent traffic begin with `Mayday`.',
      'Use `Mayday Relay` only when your vessel is not itself the casualty and relay is justified.',
      'Keep silence discipline on distress channels unless involved or assisting.',
      '`Seelonce Mayday` controls distress traffic and protects the channel.',
    ],
  },
  gmdss: {
    title: 'GMDSS Systems',
    bullets: [
      'Understand RCC role, SAR organization and sea-area access to GMDSS facilities.',
      'NAVTEX delivers Maritime Safety Information, including distress and safety broadcasts.',
      'EPIRB and SART are alerting/locating tools and must be tested/maintained correctly.',
      'False alerts and harmful interference are exam-critical compliance topics.',
    ],
  },
  regulations: {
    title: 'Regulatory And Traffic Rules',
    bullets: [
      'A valid ship station licence and certified operator are required where regulations demand it.',
      'Preserve secrecy of correspondence and avoid prohibited traffic types.',
      'Keep required radio records/logs according to national regulations.',
      'Public correspondence procedures and AAIC charging principles are part of syllabus coverage.',
    ],
  },
};

export const LEARN_SECTIONS: LearnSection[] = [
  {
    id: 'equipment-controls',
    title: 'Equipment, Power And Controls',
    pages: 'pp. 21-29, 73',
    objective: 'Be confident with VHF controls, channel types, and station power sources.',
    examFocus: ['simplex/semi-duplex/duplex', 'dual watch', 'power/PTT/volume/squelch/dimmer', 'battery/antenna basics'],
    essentials: [
      'Know simplex, semi-duplex and duplex channel concepts and when each appears in channel plans.',
      'Core controls are examinable: power, PTT, high/low power, volume, squelch, dimmer and dual watch.',
      'Battery condition and charging discipline directly affect distress reliability.',
      'Antenna condition/range limitations matter for both voice and DSC performance.',
    ],
  },
  {
    id: 'message-priority',
    title: 'Message Priority',
    pages: 'pp. 43-54',
    objective: 'Decide fast whether the incident is distress, urgency, safety or routine.',
    examFocus: ['grave and imminent danger test', 'medical advice', 'hazard to navigation'],
    essentials: [
      'Use `Mayday` only when there is grave and imminent danger to a vessel, aircraft, vehicle or person.',
      'Use `Pan Pan` when the situation is urgent but not yet distress.',
      'Use `Securite` for navigational or meteorological warnings.',
      'Do not escalate routine traffic into priority traffic just because assistance would be convenient.',
    ],
  },
  {
    id: 'channels',
    title: 'Channels And Watchkeeping',
    pages: 'pp. 25-29, 82-83',
    objective: 'Choose the correct channel and get off the calling channel quickly.',
    examFocus: ['Channel 16', 'Channel 70', 'working channels', 'port operations'],
    essentials: [
      'Channel 16 is the voice distress, safety and calling channel.',
      'Channel 70 is DSC only. No voice transmissions belong there.',
      'After contact on 16, move to an agreed working channel for routine traffic.',
      'Use published harbour or marina working channels for port operations.',
    ],
  },
  {
    id: 'routine-voice',
    title: 'Routine Voice Procedure',
    pages: 'pp. 30-42',
    objective: 'Handle normal calls cleanly, briefly and with the right procedure words.',
    examFocus: ['calling another vessel', 'calling coast stations', 'radio check', 'phonetic alphabet'],
    essentials: [
      'Listen before transmitting and think before speaking.',
      'Identify who you are calling and who you are.',
      'Use `Over` only when a reply is expected; use `Out` when the exchange is finished.',
      'Use the phonetic alphabet and spoken digits when clarity matters.',
    ],
  },
  {
    id: 'distress-voice',
    title: 'Distress Voice Procedure',
    pages: 'pp. 44-51',
    objective: 'Deliver a complete Mayday call and message in the right order.',
    examFocus: ['distress call', 'MIPDANIO', 'acknowledgement', 'mayday relay'],
    essentials: [
      'The distress call is a broadcast and starts with `Mayday` three times.',
      'The distress message should immediately follow the call.',
      'Remember `MIPDANIO`: Mayday, Identity, Position, Distress, Assistance, Number, Information, Over.',
      'If DSC distress was sent first, include the MMSI in the follow-up voice message.',
    ],
  },
  {
    id: 'dsc',
    title: 'DSC And Follow-Up Actions',
    pages: 'pp. 61-71',
    objective: 'Understand the DSC alert flow and what must happen after the digital alert.',
    examFocus: ['MMSI', 'GPS feed', 'distress alert', 'urgency/safety follow-up'],
    essentials: [
      'MMSI is the nine-digit identity of the ship radio installation.',
      'A DSC controller should ideally receive GPS position and time automatically.',
      'A DSC distress alert must be followed immediately by a Mayday voice call on 16.',
      'Urgency and safety DSC calls still need a follow-up voice message.',
    ],
  },
  {
    id: 'smnv',
    title: 'Standard Marine Vocabulary',
    pages: 'pp. 41-42, 78-79',
    objective: 'Use the standard words the examiner expects to hear.',
    examFocus: ['over/out', 'say again', 'read back', 'radio check', 'I spell'],
    essentials: [
      '`Say again` asks for repetition.',
      '`Read back` asks the other station to repeat your message back to you.',
      '`Radio check` asks for readability and signal strength.',
      '`I spell` introduces phonetic spelling of a word, callsign or vessel name.',
    ],
  },
  {
    id: 'position-identity',
    title: 'Position, MMSI And Callsigns',
    pages: 'pp. 42, 45, 47, 62-64',
    objective: 'State who you are and where you are in a way rescuers can act on immediately.',
    examFocus: ['spoken digits', 'phonetics', 'MMSI', 'position format'],
    essentials: [
      'In distress traffic, identity and position must be easy to understand first time.',
      'MMSI is included in DSC and may be repeated in the follow-up voice message.',
      'Use phonetic alphabet and spoken digit forms when spelling callsigns or vessel names.',
      'Position should be transmitted calmly and unambiguously using accepted spoken coordinate format.',
    ],
  },
  {
    id: 'distress-traffic',
    title: 'Acknowledgement And Relay',
    pages: 'pp. 48-51, 68-71',
    objective: 'Know what to do after a distress call or alert is heard.',
    examFocus: ['acknowledgement', 'Seelonce', 'Mayday Relay', 'coast station priority'],
    essentials: [
      'Acknowledge distress traffic correctly and avoid interfering if a coast station is handling it.',
      'Subsequent distress traffic connected with the incident begins with `Mayday`.',
      'Use `Mayday Relay` only when relaying distress for another vessel or person.',
      'Silence procedures exist to keep the distress channel clear for traffic that matters.',
    ],
  },
  {
    id: 'gmdss-systems',
    title: 'GMDSS Systems, MSI And Locating Signals',
    pages: 'pp. 74-76',
    objective: 'Cover the Appendix 1 theory block on SAR/GMDSS systems.',
    examFocus: ['RCC role', 'NAVTEX', 'EPIRB', 'SART', 'false alert protection'],
    essentials: [
      'Know what RCC does and how SAR organisation fits GMDSS incident handling.',
      'NAVTEX is the MSI subsystem for navigational, meteorological and safety text broadcasts.',
      'EPIRB and SART purpose/operation/testing are explicit exam topics.',
      'False alert cancellation and distress-frequency protection are mandatory compliance skills.',
    ],
  },
  {
    id: 'regulations',
    title: 'Regulations, Public Correspondence And Logging',
    pages: 'p. 77',
    objective: 'Cover the regulatory part of the exam, often underestimated.',
    examFocus: ['ship station licence', 'operator entitlement', 'secrecy', 'radio record keeping', 'AAIC/public correspondence'],
    essentials: [
      'Know requirement for ship station licence and operation by holder of appropriate certificate.',
      'Preserve secrecy of correspondence and avoid prohibited call/message types.',
      'Understand radio record-keeping duties under national rules.',
      'Know public correspondence flow and AAIC charging context at exam-awareness level.',
    ],
  },
];

export const APPENDIX_SYLLABUS_BLOCKS: SyllabusBlock[] = [
  {
    id: 'syllabus-a',
    code: 'A',
    title: 'General VHF Maritime Mobile Knowledge',
    pages: 'p. 72',
    exactKnowledge: [
      'Types of communication: distress/urgency/safety, public correspondence, port operations, ship movement, intership, onboard.',
      'Station types: ship/coast/pilot-port/aircraft/RCC.',
      'VHF channel/frequency basics, propagation range and channel planning.',
      'Distress/safety channels and national small-craft safety channel awareness.',
      'Sources of energy, battery types/charging/maintenance fundamentals.',
    ],
  },
  {
    id: 'syllabus-b',
    code: 'B',
    title: 'Detailed Radio Equipment And DSC Knowledge',
    pages: 'pp. 73-74',
    exactKnowledge: [
      'Radiotelephone channel selection and dual-watch controls.',
      'Core controls: power/PTT/high-low power/volume/squelch/dimmer.',
      'Portable VHF apparatus and marine antenna basics.',
      'DSC message lifecycle: attempt, acknowledgement, relay.',
      'DSC call types: distress, all ships, individual, geographic area, group.',
      'MMSI and MID numbering concepts + call priority categorisation.',
    ],
  },
  {
    id: 'syllabus-c',
    code: 'C',
    title: 'GMDSS Operational Procedures',
    pages: 'pp. 74-76',
    exactKnowledge: [
      'Sea areas and access to GMDSS facilities, SAR organisation, RCC role.',
      'Distress/urgency/safety procedures via VHF DSC and acknowledgements.',
      'Protection of distress frequencies and false-alert procedures.',
      'MSI via NAVTEX (purpose/capability).',
      'Alerting/locating signals: EPIRB and SART operation/testing.',
    ],
  },
  {
    id: 'syllabus-d',
    code: 'D',
    title: 'Operational Procedure And Regulations',
    pages: 'pp. 76-77',
    exactKnowledge: [
      'Correct use of MAYDAY/PAN PAN/SECURITE and associated message forms.',
      'SEELONCE MAYDAY / SEELONCE FEENEE meanings and traffic control.',
      'SMNV basic signals and phonetic alphabet use.',
      'Ship station licence, operator entitlement, secrecy of correspondence, radio record keeping.',
      'Public correspondence routines, DSC coast-station calling, charging/AAIC awareness.',
    ],
  },
];

export const EXAM_CRITICAL_ITEMS: ExamCriticalItem[] = [
  {
    id: 'critical-priority-ladder',
    label: 'Correctly classify Distress vs Urgency vs Safety vs Routine',
    why: 'This is central to almost every practical and theoretical decision in the exam.',
    handbookRef: 'pp. 43-54',
  },
  {
    id: 'critical-channel-discipline',
    label: 'Channel 16/70 discipline and immediate move to working channel for routine traffic',
    why: 'Frequent fail point in procedural questions.',
    handbookRef: 'pp. 25-31, 61-66',
  },
  {
    id: 'critical-dsc-followup',
    label: 'After DSC distress alert, send Mayday voice call/message on 16 immediately',
    why: 'Exam expects strict DSC-to-voice continuity.',
    handbookRef: 'pp. 67-68',
  },
  {
    id: 'critical-mipdanio',
    label: 'Deliver distress message in complete MIPDANIO order',
    why: 'Order and content accuracy are assessed directly.',
    handbookRef: 'pp. 45-47',
  },
  {
    id: 'critical-distress-traffic',
    label: 'Mayday acknowledgement, Seelonce control and Mayday Relay discipline',
    why: 'Traffic-control errors are high-risk in practical assessment.',
    handbookRef: 'pp. 48-51, 68-71',
  },
  {
    id: 'critical-gmdss-systems',
    label: 'NAVTEX, EPIRB, SART and RCC/SAR role awareness',
    why: 'Explicit Appendix 1 theory block (C).',
    handbookRef: 'pp. 74-76',
  },
  {
    id: 'critical-regulations',
    label: 'Licence/operator entitlement, secrecy, logbook duties, prohibited traffic',
    why: 'Explicit Appendix 1 regulations block (D2).',
    handbookRef: 'p. 77',
  },
  {
    id: 'critical-smnv',
    label: 'Use core SMNV markers and phonetic alphabet correctly',
    why: 'Communication clarity and vocabulary are directly tested.',
    handbookRef: 'pp. 77-81',
  },
];

export const PROCEDURE_TEMPLATES: ProcedureTemplate[] = [
  {
    id: 'routine-call',
    type: 'routine-call',
    title: 'Routine Call',
    intro: 'Use for normal yacht-to-yacht, marina or harbour traffic.',
    steps: [
      'Called station name x3',
      '`This is`',
      'Your vessel name x3',
      'Call sign if needed',
      'Working request or reason for call',
      '`Over`',
      'Move to a working channel as soon as contact is made',
    ],
  },
  {
    id: 'distress-template',
    type: 'priority',
    title: 'Mayday Template',
    intro: 'Use only for grave and imminent danger.',
    steps: [
      '`Mayday` x3',
      '`This is`',
      'Vessel name x3',
      'Call sign and MMSI',
      '`Mayday` once to begin the message',
      'Identity once',
      'Position',
      'Nature of distress',
      'Assistance required',
      'Persons on board',
      'Additional useful information',
      '`Over`',
    ],
  },
  {
    id: 'urgency-template',
    type: 'priority',
    title: 'Pan Pan Template',
    intro: 'Use for urgent safety situations that do not meet the distress threshold.',
    steps: [
      '`Pan Pan` x3',
      'Addressee, often `All Stations` or a Coastguard station',
      '`This is`',
      'Vessel name x3',
      'Call sign and MMSI if useful',
      'Position',
      'Problem',
      'Assistance or advice required',
      'Persons on board if relevant',
      '`Over`',
    ],
  },
  {
    id: 'safety-template',
    type: 'priority',
    title: 'Securite Template',
    intro: 'Use for navigational or meteorological safety information.',
    steps: [
      '`Securite` x3',
      'Addressee, often `All Stations`',
      '`This is`',
      'Station or vessel identity',
      'Nature of warning',
      'Position or affected area',
      'Instruction to listen on working channel if needed',
      '`Out` or follow with the message on the nominated working channel',
    ],
  },
  {
    id: 'dsc-flow',
    type: 'dsc',
    title: 'DSC Distress Flow',
    intro: 'Digital alert first, voice follow-up immediately after.',
    steps: [
      'Lift distress cover / enter distress menu as required by the set',
      'Select nature of distress if time allows',
      'Transmit DSC distress alert on Channel 70',
      'Immediately switch to / remain on Channel 16',
      'Send full Mayday voice call and message',
      'Listen for acknowledgement and maintain discipline on the distress channel',
    ],
  },
  {
    id: 'position-format',
    type: 'position',
    title: 'Position Format Reminder',
    intro: 'Deliver coordinates slowly and in a stable spoken order.',
    steps: [
      'Say latitude first, then longitude',
      'Use degrees and minutes',
      'State North or South clearly',
      'State East or West clearly',
      'Repeat once if asked using `Say again` / `Read back` discipline',
    ],
  },
  {
    id: 'mayday-relay-template',
    type: 'traffic',
    title: 'Mayday Relay Template',
    intro: 'Use when relaying distress for another vessel or person, not when your own vessel is the casualty.',
    steps: [
      '`Mayday Relay` x3',
      'Addressee such as coast station or all stations as appropriate',
      '`This is`',
      'Your vessel identity',
      'Identity of vessel or person in distress',
      'Position of casualty',
      'Nature of distress and assistance required',
      '`Over`',
    ],
  },
  {
    id: 'distress-acknowledgement',
    type: 'traffic',
    title: 'Distress Acknowledgement',
    intro: 'Used when acknowledging a distress message and taking control of the incident.',
    steps: [
      '`Mayday`',
      'Identity of casualty station',
      '`This is`',
      'Identity of acknowledging station',
      '`Received Mayday`',
      'Control / stand by instruction',
      '`Over`',
    ],
  },
];

export const EXAM_QUESTIONS: Record<ExamTopic, ExamQuestion[]> = {
  equipment: [
    {
      id: 'equip-simplex',
      topic: 'equipment',
      eyebrow: 'General Knowledge A1.3',
      title: 'Simplex channel concept',
      prompt:
        'Which statement best describes simplex operation in the VHF maritime service?',
      options: [
        { id: 'same-frequency', label: 'Transmit and receive on one shared channel frequency' },
        { id: 'two-frequency', label: 'Transmit and receive always use two paired frequencies' },
        { id: 'dsc-only', label: 'Simplex is used only for DSC signalling' },
        { id: 'shore-only', label: 'Simplex is for shore stations only' },
      ],
      answer: 'same-frequency',
      explanation:
        'Simplex means both stations use the same channel frequency in turn.',
      handbookRef: 'pp. 28-29, 72-73',
    },
    {
      id: 'equip-duplex',
      topic: 'equipment',
      eyebrow: 'General Knowledge A1.3',
      title: 'Duplex channel concept',
      prompt:
        'What is the key characteristic of duplex/semi-duplex channel use in marine VHF planning?',
      options: [
        { id: 'paired', label: 'Ship and coast sides may use paired transmit/receive frequencies' },
        { id: 'single', label: 'Both always use a single frequency only' },
        { id: 'voice-ban', label: 'Duplex channels cannot carry voice traffic' },
        { id: 'distress-only', label: 'Duplex is reserved only for distress messages' },
      ],
      answer: 'paired',
      explanation:
        'Duplex/semi-duplex channels are planned with paired ship/coast frequencies where applicable.',
      handbookRef: 'pp. 28-29, 72-73',
    },
    {
      id: 'equip-dual-watch',
      topic: 'equipment',
      eyebrow: 'Detailed Equipment B1',
      title: 'Dual watch purpose',
      prompt:
        'In normal SRC operating practice, what is dual watch mainly used for?',
      options: [
        { id: 'two-voice', label: 'Monitor Channel 16 while also watching a selected working channel' },
        { id: 'double-power', label: 'Monitor Channel 16 and Channel 70 only as a fixed pair' },
        { id: 'dsc-alert', label: 'Monitor two chosen working channels while leaving Channel 16 unwatched' },
        { id: 'antenna-test', label: 'Increase transmit range by alternating between channels' },
      ],
      answer: 'two-voice',
      explanation:
        'Dual watch is used to keep safety/calling awareness while working another channel.',
      handbookRef: 'p. 73',
    },
    {
      id: 'equip-squelch',
      topic: 'equipment',
      eyebrow: 'Detailed Equipment B1',
      title: 'Squelch control',
      prompt:
        'What does the squelch control primarily manage?',
      options: [
        { id: 'noise-threshold', label: 'Background noise threshold when no valid signal is present' },
        { id: 'speaker-volume', label: 'Loudspeaker volume level' },
        { id: 'tx-power', label: 'Transmission output power selection' },
        { id: 'screen-light', label: 'Backlight brightness' },
      ],
      answer: 'noise-threshold',
      explanation:
        'Squelch is adjusted to suppress hiss/noise while still opening for real received signals.',
      handbookRef: 'p. 73',
    },
    {
      id: 'equip-power-selection',
      topic: 'equipment',
      eyebrow: 'Detailed Equipment B1',
      title: 'High/low power switch',
      prompt:
        'You are calling a nearby marina in good conditions. Which is the single best power-setting principle?',
      options: [
        { id: 'high-always', label: 'Use high power for every initial call, then reduce only if asked' },
        { id: 'low-local', label: 'Use low power for nearby local traffic, increase only if needed' },
        { id: 'dsc-only', label: 'Leave the previous setting because power choice mainly affects receiving, not transmitting' },
        { id: 'off-before-call', label: 'Choose power by route type (harbour/offshore), not by range to station' },
      ],
      answer: 'low-local',
      explanation:
        'Use the minimum practical power for local traffic to reduce unnecessary interference.',
      handbookRef: 'pp. 25-27, 73',
    },
    {
      id: 'equip-ptt',
      topic: 'equipment',
      eyebrow: 'Detailed Equipment B1',
      title: 'PTT switch behavior',
      prompt:
        'What is the correct use of the press-to-transmit (PTT) switch?',
      options: [
        { id: 'hold-while-speaking', label: 'Hold while speaking; release to listen' },
        { id: 'tap-once', label: 'Tap once at start and once at end only' },
        { id: 'receive-mode', label: 'Use PTT to improve receive sensitivity' },
        { id: 'volume-up', label: 'Use PTT to raise speaker volume' },
      ],
      answer: 'hold-while-speaking',
      explanation:
        'Marine VHF is push-to-talk half-duplex operation: transmit while pressed, receive when released.',
      handbookRef: 'pp. 25-27, 73',
    },
    {
      id: 'equip-battery-maintenance',
      topic: 'equipment',
      eyebrow: 'General Knowledge A1.4',
      title: 'Battery reliability',
      prompt:
        'Which maintenance principle best supports dependable emergency communications?',
      options: [
        { id: 'ignore', label: 'Depend on alternator charging while engine runs and skip planned battery checks' },
        { id: 'planned', label: 'Maintain battery charging/condition checks as part of routine readiness' },
        { id: 'replace-yearly', label: 'Check handheld battery only; fixed-set supply can wait for annual servicing' },
        { id: 'discharge', label: 'Perform regular deep-discharge cycles to keep emergency batteries "fresh"' },
      ],
      answer: 'planned',
      explanation:
        'The syllabus explicitly includes battery source, charging and maintenance knowledge.',
      handbookRef: 'p. 72',
    },
    {
      id: 'equip-dimmer',
      topic: 'equipment',
      eyebrow: 'Detailed Equipment B1',
      title: 'Dimmer control',
      prompt:
        'What is the purpose of the dimmer function on marine VHF sets?',
      options: [
        { id: 'screen', label: 'Adjust display/backlight brightness for readability and night adaptation' },
        { id: 'channel', label: 'Switch between simplex and duplex channel plans' },
        { id: 'gain', label: 'Boost microphone gain for weak voice' },
        { id: 'alert', label: 'Cancel incoming DSC alerts' },
      ],
      answer: 'screen',
      explanation:
        'Dimmer controls display illumination; it does not change channel planning or DSC behavior.',
      handbookRef: 'p. 73',
    },
  ],
  priority: [
    {
      id: 'priority-sinking',
      topic: 'priority',
      eyebrow: 'Voice Procedure 2',
      title: 'Hull breach and abandon ship prep',
      prompt:
        'You have struck a submerged object, the boat is flooding fast, pumps cannot cope and you are preparing to abandon ship. What is the correct priority?',
      options: [
        { id: 'routine', label: 'Routine call' },
        { id: 'safety', label: 'Safety call: Securite' },
        { id: 'urgency', label: 'Urgency call: Pan Pan' },
        { id: 'distress', label: 'Distress call: Mayday' },
      ],
      answer: 'distress',
      explanation:
        'This is grave and imminent danger, so it meets the handbook definition of distress and requires a Mayday.',
      handbookRef: 'pp. 43-47',
    },
    {
      id: 'priority-engine',
      topic: 'priority',
      eyebrow: 'Voice Procedure 3',
      title: 'Engine failure near traffic',
      prompt:
        'Your engine has failed, there is no wind and you are drifting toward a traffic lane. You need priority and probably a tow, but the vessel is not yet in grave and imminent danger.',
      options: [
        { id: 'routine', label: 'Routine working call' },
        { id: 'safety', label: 'Securite message' },
        { id: 'urgency', label: 'Pan Pan urgency call' },
        { id: 'distress', label: 'Immediate Mayday' },
      ],
      answer: 'urgency',
      explanation:
        'The situation is urgent and safety-related, but not yet distress. The handbook uses Pan Pan for this class of problem.',
      handbookRef: 'pp. 52-53',
    },
    {
      id: 'priority-container',
      topic: 'priority',
      eyebrow: 'Voice Procedure 3',
      title: 'Hazard to navigation',
      prompt:
        'You spot a half-submerged container posing a danger to passing vessels. Which call category fits best?',
      options: [
        { id: 'routine', label: 'Routine call' },
        { id: 'safety', label: 'Safety call: Securite' },
        { id: 'urgency', label: 'Urgency call: Pan Pan' },
        { id: 'distress', label: 'Distress call: Mayday' },
      ],
      answer: 'safety',
      explanation:
        'This is navigational safety information for other traffic, so it belongs in a Securite call/message.',
      handbookRef: 'p. 54',
    },
    {
      id: 'priority-medico',
      topic: 'priority',
      eyebrow: 'Voice Procedure 3',
      title: 'Requesting medical advice',
      prompt:
        'A crew member has symptoms that need urgent medical advice from the Coastguard, but the vessel itself is not in distress. What should you send first?',
      options: [
        { id: 'routine', label: 'Routine call' },
        { id: 'safety', label: 'Securite call' },
        { id: 'urgency', label: 'Pan Pan to the Coastguard' },
        { id: 'distress', label: 'Mayday to all stations' },
      ],
      answer: 'urgency',
      explanation:
        'The handbook treats requests for medical advice as a special case of urgency traffic using Pan Pan.',
      handbookRef: 'p. 53',
    },
    {
      id: 'priority-berth',
      topic: 'priority',
      eyebrow: 'Voice Procedure 1',
      title: 'Calling for a berth',
      prompt:
        'You are approaching a marina and want to ask for a visitor berth for the night. Which traffic category is correct?',
      options: [
        { id: 'routine', label: 'Routine call' },
        { id: 'safety', label: 'Securite call' },
        { id: 'urgency', label: 'Pan Pan urgency call' },
        { id: 'distress', label: 'Mayday distress call' },
      ],
      answer: 'routine',
      explanation:
        'This is ordinary operational traffic and should be handled as a routine call on the appropriate working channel.',
      handbookRef: 'pp. 30-31',
    },
    {
      id: 'priority-dog-overboard',
      topic: 'priority',
      eyebrow: 'Definition Of Distress',
      title: 'Dog overboard',
      prompt:
        'Your dog has fallen overboard and is in danger of drowning, but no person is at immediate risk. Which classification matches the handbook definition best?',
      options: [
        { id: 'routine', label: 'Routine only' },
        { id: 'safety', label: 'Safety call' },
        { id: 'urgency', label: 'Urgency call' },
        { id: 'not-distress', label: 'Not a distress situation under the formal definition' },
      ],
      answer: 'not-distress',
      explanation:
        'The handbook is explicit that distress must concern a vessel, aircraft, vehicle or person. A dog overboard is distressing, but not formally a distress situation.',
      handbookRef: 'p. 43',
    },
    {
      id: 'priority-mob',
      topic: 'priority',
      eyebrow: 'Definition Of Distress',
      title: 'Skipper overboard',
      prompt:
        'The skipper has fallen overboard in cold water and you are not fully confident of recovery. Which message priority is correct?',
      options: [
        { id: 'routine', label: 'Routine call' },
        { id: 'safety', label: 'Securite' },
        { id: 'urgency', label: 'Pan Pan' },
        { id: 'distress', label: 'Mayday' },
      ],
      answer: 'distress',
      explanation:
        'A person overboard with grave and imminent danger is a distress situation and calls for Mayday.',
      handbookRef: 'p. 43',
    },
    {
      id: 'priority-mud-grounding',
      topic: 'priority',
      eyebrow: 'Definition Of Distress',
      title: 'Grounded in mud, sheltered water',
      prompt:
        'A yacht has grounded in a river estuary on a falling tide and is stuck in mud in sheltered water. There is no immediate threat to life. Which answer fits the handbook?',
      options: [
        { id: 'routine', label: 'Routine / local assistance only' },
        { id: 'safety', label: 'Securite' },
        { id: 'urgency', label: 'Pan Pan' },
        { id: 'distress', label: 'Mayday' },
      ],
      answer: 'routine',
      explanation:
        'The handbook uses this example to show that not every grounding is distress. Without grave danger to vessel or life, it does not meet the distress test.',
      handbookRef: 'p. 44',
    },
  ],
  channels: [
    {
      id: 'channel-16',
      topic: 'channels',
      eyebrow: 'VHF Channels',
      title: 'Initial voice distress, safety and calling channel',
      prompt: 'Which VHF channel is reserved for distress, safety and initial calling by voice?',
      options: [
        { id: '06', label: 'Channel 06' },
        { id: '16', label: 'Channel 16' },
        { id: '67', label: 'Channel 67' },
        { id: '70', label: 'Channel 70' },
      ],
      answer: '16',
      explanation:
        'The handbook identifies Channel 16 as the distress, safety and calling channel for voice traffic.',
      handbookRef: 'pp. 28-29',
    },
    {
      id: 'channel-70',
      topic: 'channels',
      eyebrow: 'VHF Channels',
      title: 'DSC traffic channel',
      prompt: 'Which channel is used for DSC distress, urgency, safety and calling alerts?',
      options: [
        { id: '16', label: 'Channel 16' },
        { id: '67', label: 'Channel 67' },
        { id: '70', label: 'Channel 70' },
        { id: '72', label: 'Channel 72' },
      ],
      answer: '70',
      explanation:
        'Channel 70 is the DSC-only channel. Voice transmissions do not belong there.',
      handbookRef: 'pp. 29, 61-66',
    },
    {
      id: 'channel-working-shift',
      topic: 'channels',
      eyebrow: 'Routine Procedure',
      title: 'After contact on 16',
      prompt:
        'You have called another yacht on Channel 16 and made contact. What should happen next for a routine conversation?',
      options: [
        { id: 'stay-16', label: 'Remain on 16 if the exchange is short and does not block others' },
        { id: 'to-working', label: 'Move promptly to an agreed working channel' },
        { id: 'to-70', label: 'Move to Channel 70 because it is the DSC calling channel' },
        { id: 'off', label: 'Stay on 16 until a coast station explicitly instructs a change' },
      ],
      answer: 'to-working',
      explanation:
        'Channel 16 should be cleared quickly once contact is made. The handbook shows shifting to a working channel such as 72.',
      handbookRef: 'pp. 30-31',
    },
    {
      id: 'channel-67',
      topic: 'channels',
      eyebrow: 'Channel Selection Chart',
      title: 'UK small-craft safety / SAR working channel',
      prompt: 'Which channel does the handbook chart flag for UK small-craft safety and HM Coastguard SAR work?',
      options: [
        { id: '06', label: 'Channel 06' },
        { id: '16', label: 'Channel 16' },
        { id: '67', label: 'Channel 67' },
        { id: '77', label: 'Channel 77' },
      ],
      answer: '67',
      explanation:
        'In the Channel Selection Chart, Channel 67 is marked for UK small-craft safety / HMCG SAR working context.',
      handbookRef: 'pp. 82-83',
    },
    {
      id: 'channel-port-ops',
      topic: 'channels',
      eyebrow: 'Operating A Marine VHF',
      title: 'Calling a harbour or marina',
      prompt:
        'You need a marina, harbour office or port authority. Which principle is correct?',
      options: [
        { id: 'always-16', label: 'Use 16 for the whole exchange' },
        { id: 'dsc-only', label: 'Use only DSC on 70 and wait silently' },
        { id: 'published-port', label: 'Use the published port operations / working channel' },
        { id: 'intership', label: 'Use any inter-ship simplex channel' },
      ],
      answer: 'published-port',
      explanation:
        'Routine marina and port traffic belongs on the published working channel, not by occupying Channel 16.',
      handbookRef: 'pp. 25-29, 30-31',
    },
    {
      id: 'channel-no-voice-70',
      topic: 'channels',
      eyebrow: 'Channel Discipline',
      title: 'Where voice must not go',
      prompt:
        'Which channel must remain clear of voice traffic because it is reserved for DSC signalling?',
      options: [
        { id: '06', label: 'Channel 06' },
        { id: '16', label: 'Channel 16' },
        { id: '67', label: 'Channel 67' },
        { id: '70', label: 'Channel 70' },
      ],
      answer: '70',
      explanation:
        'Channel 70 is reserved for DSC alerts and calls. Voice transmissions do not belong there.',
      handbookRef: 'pp. 29, 61',
    },
    {
      id: 'channel-safety-announcement',
      topic: 'channels',
      eyebrow: 'Safety Procedure',
      title: 'Announcing a safety message',
      prompt:
        'You are about to issue a Securite call. Which channel is normally used for the initial voice announcement before the message moves to a working channel?',
      options: [
        { id: '16', label: 'Channel 16' },
        { id: '67', label: 'Channel 67 only' },
        { id: '70', label: 'Channel 70' },
        { id: '72', label: 'Any leisure working channel only' },
      ],
      answer: '16',
      explanation:
        'The handbook states that safety calls are announced on Channel 16, then the detailed safety message is passed on a working channel.',
      handbookRef: 'p. 54',
    },
  ],
  dsc: [
    {
      id: 'dsc-follow-up',
      topic: 'dsc',
      eyebrow: 'DSC Distress',
      title: 'What follows a DSC distress alert?',
      prompt:
        'You have transmitted a DSC distress alert successfully. What should you do immediately afterwards?',
      options: [
        { id: 'wait', label: 'Stay silent until a coast station acknowledges your DSC alert' },
        { id: 'voice16', label: 'Send a Mayday voice call and message on Channel 16' },
        { id: 'cancel', label: 'Send a second DSC distress alert first to add details digitally' },
        { id: 'switch67', label: 'Change to a working channel and pass voice distress traffic there' },
      ],
      answer: 'voice16',
      explanation:
        'The handbook is explicit: a DSC distress alert should be followed immediately by a Mayday call and message by voice on 16.',
      handbookRef: 'pp. 67-68',
    },
    {
      id: 'dsc-gps',
      topic: 'dsc',
      eyebrow: 'DSC Controllers',
      title: 'Best position source for DSC',
      prompt:
        'What should ideally be interfaced to the DSC controller so the controller can include up-to-date location information?',
      options: [
        { id: 'depth', label: 'Depth sounder' },
        { id: 'gps', label: 'GPS receiver' },
        { id: 'ais', label: 'AIS transceiver only' },
        { id: 'radar', label: 'Radar scanner' },
      ],
      answer: 'gps',
      explanation:
        'The handbook states that DSC controllers should be interfaced with GPS so position and time can be sent automatically.',
      handbookRef: 'p. 64',
    },
    {
      id: 'dsc-mmsi',
      topic: 'dsc',
      eyebrow: 'Routine DSC',
      title: 'Nine-digit identity',
      prompt:
        'Which identifier is the nine-digit number that uniquely identifies the ship radio installation in DSC?',
      options: [
        { id: 'atis', label: 'ATIS code' },
        { id: 'mmsi', label: 'MMSI' },
        { id: 'callsign', label: 'Call sign' },
        { id: 'epirb', label: 'EPIRB HEX ID' },
      ],
      answer: 'mmsi',
      explanation:
        'DSC relies on the vessel MMSI as the core digital identifier.',
      handbookRef: 'pp. 62-63',
    },
    {
      id: 'dsc-priority-map',
      topic: 'dsc',
      eyebrow: 'DSC Categories',
      title: 'DSC equivalent of Pan Pan',
      prompt: 'In DSC call categorisation, which priority corresponds to the voice proword `Pan Pan`?',
      options: [
        { id: 'routine', label: 'Routine' },
        { id: 'safety', label: 'Safety' },
        { id: 'urgency', label: 'Urgency' },
        { id: 'ship-business', label: 'Ship business' },
      ],
      answer: 'urgency',
      explanation:
        'The handbook maps DSC `Urgency` directly to the voice procedure proword `Pan Pan`.',
      handbookRef: 'p. 64',
    },
    {
      id: 'dsc-calltype-allships',
      topic: 'dsc',
      eyebrow: 'DSC Types Of Call',
      title: 'All ships call use case',
      prompt:
        'Which DSC call type is intended to address all stations rather than one individual MMSI?',
      options: [
        { id: 'all-ships', label: 'All ships call' },
        { id: 'individual', label: 'Individual call' },
        { id: 'group', label: 'Group call only' },
        { id: 'distress-relay', label: 'Distress relay only' },
      ],
      answer: 'all-ships',
      explanation:
        'Appendix 1 B2 lists all ships call as a distinct DSC type from individual/geographic/group calls.',
      handbookRef: 'p. 73',
    },
    {
      id: 'dsc-calltype-geographic',
      topic: 'dsc',
      eyebrow: 'DSC Types Of Call',
      title: 'Geographic area call concept',
      prompt:
        'What distinguishes a DSC geographic area call from an individual call?',
      options: [
        { id: 'area-target', label: 'It targets stations in a defined sea area rather than one MMSI' },
        { id: 'voice-mode', label: 'It is voice-only and not DSC data' },
        { id: 'shore-only', label: 'Only shore stations can receive it' },
        { id: 'routine-ban', label: 'It cannot be used for urgency/safety categories' },
      ],
      answer: 'area-target',
      explanation:
        'Geographic area call is explicitly listed as a DSC call type targeting stations by area.',
      handbookRef: 'p. 73',
    },
    {
      id: 'dsc-calltype-group',
      topic: 'dsc',
      eyebrow: 'DSC Types Of Call',
      title: 'Group call concept',
      prompt:
        'Which description best matches DSC group call?',
      options: [
        { id: 'predefined-group', label: 'Calling a predefined group identity rather than one station' },
        { id: 'all-vessels', label: 'Calling every vessel in range automatically' },
        { id: 'pilot-only', label: 'Calling only pilot stations by default' },
        { id: 'distress-only', label: 'Available only for distress category' },
      ],
      answer: 'predefined-group',
      explanation:
        'Appendix 1 distinguishes group call as a separate DSC call type alongside individual and all ships.',
      handbookRef: 'p. 73',
    },
    {
      id: 'dsc-safety-followup',
      topic: 'dsc',
      eyebrow: 'Urgency And Safety',
      title: 'Voice follow-up after urgency or safety DSC',
      prompt:
        'After sending a DSC urgency or safety call, what is still required?',
      options: [
        { id: 'nothing', label: 'Nothing else; DSC is enough by itself' },
        { id: 'voice', label: 'A follow-up Pan Pan or Securite voice message' },
        { id: 'morse', label: 'A Morse transmission on 500 kHz' },
        { id: 'repeat70', label: 'Repeat the same voice text on 70' },
      ],
      answer: 'voice',
      explanation:
        'Unlike a distress alert, urgency and safety DSC calls carry very limited information and must be followed by voice.',
      handbookRef: 'pp. 70-71',
    },
    {
      id: 'dsc-false-alert',
      topic: 'dsc',
      eyebrow: 'False Alert Procedure',
      title: 'Accidental DSC distress alert',
      prompt:
        'You send a DSC distress alert by mistake. What is the single best immediate response?',
      options: [
        { id: 'ignore', label: 'Wait for a challenge call before taking cancellation action' },
        { id: 'switch-off', label: 'Power-cycle the set to stop the alert chain' },
        { id: 'cancel-inform', label: 'Follow the false-alert cancellation procedure and inform the Coastguard / all stations as required' },
        { id: 'repeat', label: 'Send an individual DSC call to Coastguard and explain only if requested' },
      ],
      answer: 'cancel-inform',
      explanation:
        'The handbook treats false distress alerts seriously. They require the proper cancellation procedure and immediate notification, not silence.',
      handbookRef: 'p. 69',
    },
    {
      id: 'dsc-ack-wait',
      topic: 'dsc',
      eyebrow: 'Receiving A Distress Alert',
      title: 'Before you acknowledge by voice',
      prompt:
        'You receive a DSC distress alert and believe a coast station is likely to have received it too. What does the handbook advise before you acknowledge by voice yourself?',
      options: [
        { id: 'immediate', label: 'Acknowledge instantly on 70' },
        { id: 'wait-five', label: 'Allow the coast station up to about five minutes first' },
        { id: 'never', label: 'Never acknowledge any distress traffic' },
        { id: 'switch-off', label: 'Silence your set and stand by off-watch' },
      ],
      answer: 'wait-five',
      explanation:
        'The handbook advises allowing a coast station a short period, around five minutes, to respond if they are likely to have received the alert.',
      handbookRef: 'p. 68',
    },
    {
      id: 'dsc-relay-limit',
      topic: 'dsc',
      eyebrow: 'DSC Distress Relay',
      title: 'Using DSC distress relay',
      prompt:
        'Which statement best matches the handbook guidance on DSC distress relay?',
      options: [
        { id: 'free-use', label: 'Any Class D user may freely relay any distress alert by DSC' },
        { id: 'restricted', label: 'DSC distress relay is restricted; routine relay by Class D users is not the normal tool' },
        { id: 'voice-only-bad', label: 'Voice Mayday relay should never be used' },
        { id: 'channel67', label: 'Relays should always be sent on Channel 67' },
      ],
      answer: 'restricted',
      explanation:
        'The handbook explains that DSC distress relay is restricted and not a normal casual function for Class D users; voice Mayday relay remains important.',
      handbookRef: 'p. 71',
    },
    {
      id: 'dsc-coast-vs-ship-ack',
      topic: 'dsc',
      eyebrow: 'Receipt And Acknowledgement C2',
      title: 'Who should acknowledge first when coast station is available',
      prompt:
        'A DSC distress alert is received by nearby vessels and by a coast station in range. Which action best matches handbook/syllabus procedure?',
      options: [
        { id: 'coast-first', label: 'Allow coast-station acknowledgement/control first; ship stations avoid unnecessary interference' },
        { id: 'all-ships-70', label: 'All ships should acknowledge immediately on Channel 70' },
        { id: 'nobody', label: 'Nobody should acknowledge until the casualty repeats the alert' },
        { id: 'marina', label: 'A marina station should always acknowledge before RCC/coast station' },
      ],
      answer: 'coast-first',
      explanation:
        'Appendix 1 separates acknowledgement procedure for coast and ship stations. In normal conditions, coast-station control should be allowed to develop first.',
      handbookRef: 'pp. 68, 74',
    },
    {
      id: 'dsc-test-protocol',
      topic: 'dsc',
      eyebrow: 'Protection Of Distress Frequencies C3',
      title: 'Testing DSC equipment correctly',
      prompt:
        'Which statement reflects the syllabus requirement for DSC testing?',
      options: [
        { id: 'approved-tests', label: 'Use approved test protocols/procedures to avoid false alerts and harmful interference' },
        { id: 'real-alert', label: 'Send a real distress alert and cancel afterwards as a routine test method' },
        { id: 'voice70', label: 'Use a voice test on Channel 70 instead of DSC test functions' },
        { id: 'disable-watch', label: 'Disable DSC watchkeeping while underway to avoid nuisance alerts' },
      ],
      answer: 'approved-tests',
      explanation:
        'Appendix 1 C3 explicitly includes test protocols and testing DSC equipment while protecting distress frequencies.',
      handbookRef: 'p. 75',
    },
  ],
  position: [
    {
      id: 'position-most-important',
      topic: 'position',
      eyebrow: 'Distress Message',
      title: 'Most important single item',
      prompt:
        'According to the handbook, what is the single most important piece of information in the distress message?',
      options: [
        { id: 'callsign', label: 'Callsign' },
        { id: 'distress', label: 'Nature of distress' },
        { id: 'persons', label: 'Number of persons on board' },
        { id: 'position', label: 'Position' },
      ],
      answer: 'position',
      explanation:
        'The handbook explicitly says position is the single most important piece of information in the distress message.',
      handbookRef: 'p. 45',
    },
    {
      id: 'position-order',
      topic: 'position',
      eyebrow: 'Distress Message',
      title: 'What follows identity in MIPDANIO?',
      prompt:
        'In the distress-message mnemonic used by the handbook, which item comes immediately after identity?',
      options: [
        { id: 'assistance', label: 'Assistance required' },
        { id: 'position', label: 'Position' },
        { id: 'distress', label: 'Nature of distress' },
        { id: 'number', label: 'Number of persons' },
      ],
      answer: 'position',
      explanation:
        'The handbook mnemonic is MIPDANIO: Mayday, Identity, Position, Distress, Assistance, Number, Information, Over.',
      handbookRef: 'p. 45',
    },
    {
      id: 'position-callsign-phonetic',
      topic: 'position',
      eyebrow: 'Phonetic Alphabet',
      title: 'How to give a callsign',
      prompt:
        'You need to pass the callsign `2BXC` clearly over VHF. Which is the best handbook-compliant approach?',
      options: [
        { id: 'plain', label: 'Say each character once in plain language without phonetics' },
        { id: 'phonetic', label: 'Use spoken digits and phonetic alphabet forms' },
        { id: 'skip', label: 'Use vessel name only unless the other station challenges your identity' },
        { id: 'morse', label: 'Repeat plain-language characters twice to improve clarity' },
      ],
      answer: 'phonetic',
      explanation:
        'The handbook expects callsigns and awkward spellings to be passed using phonetic alphabet and spoken number forms for clarity.',
      handbookRef: 'pp. 41-42',
    },
    {
      id: 'position-mmsi-purpose',
      topic: 'position',
      eyebrow: 'Routine DSC',
      title: 'Why the MMSI matters',
      prompt:
        'What is the MMSI in SRC practice?',
      options: [
        { id: 'weather', label: 'A weather-area number' },
        { id: 'identity', label: 'The radio installation identity number' },
        { id: 'licence', label: 'The operator licence number' },
        { id: 'channel', label: 'A stored working-channel code' },
      ],
      answer: 'identity',
      explanation:
        'The MMSI is the nine-digit identity of the ship radio installation used in DSC and relevant follow-up voice procedure.',
      handbookRef: 'pp. 62-63',
    },
    {
      id: 'position-lat-long-order',
      topic: 'position',
      eyebrow: 'Specifying Position',
      title: 'Coordinate order',
      prompt:
        'When giving a full coordinate position by voice, which order should you use?',
      options: [
        { id: 'long-lat', label: 'Longitude first, then latitude' },
        { id: 'lat-long', label: 'Latitude first, then longitude' },
        { id: 'either', label: 'Any order is equally good' },
        { id: 'bearing-range', label: 'Only by bearing and range, never by coordinates' },
      ],
      answer: 'lat-long',
      explanation:
        'The normal maritime voice format is latitude first, then longitude, delivered clearly and steadily.',
      handbookRef: 'pp. 45-47',
    },
    {
      id: 'position-degrees-minutes',
      topic: 'position',
      eyebrow: 'SMNV Appendix 2',
      title: 'Coordinate format in voice reporting',
      prompt:
        'How should latitude/longitude be expressed when passed by voice under SMNV guidance?',
      options: [
        { id: 'deg-min', label: 'In degrees and minutes (with decimal minute if needed), with N/S and E/W' },
        { id: 'decimal-only', label: 'Only in decimal degrees without cardinal directions' },
        { id: 'bearing-only', label: 'Only as a bearing from your own vessel heading' },
        { id: 'chart-grid', label: 'Only as local chart grid references' },
      ],
      answer: 'deg-min',
      explanation:
        'Appendix 2 states latitude/longitude should be expressed in degrees and minutes, including cardinal directions.',
      handbookRef: 'p. 80',
    },
    {
      id: 'position-from-mark-bearing',
      topic: 'position',
      eyebrow: 'SMNV Appendix 2',
      title: 'Reporting position from a charted mark',
      prompt:
        'When reporting position relative to a charted mark, what bearing rule is given?',
      options: [
        { id: 'from-mark', label: 'Use 360-degree bearing from true north, from the mark to your position' },
        { id: 'to-mark', label: 'Always give relative bearing from your bow only' },
        { id: 'magnetic-only', label: 'Use magnetic bearing only and omit reference direction' },
        { id: 'any', label: 'Any bearing method is acceptable if distance is included' },
      ],
      answer: 'from-mark',
      explanation:
        'Appendix 2 position guidance specifies 360-degree notation from true north and bearing from the mark when reporting position relative to a mark.',
      handbookRef: 'p. 80',
    },
    {
      id: 'position-distance-units',
      topic: 'position',
      eyebrow: 'SMNV Appendix 2',
      title: 'Expressing distance clearly',
      prompt:
        'Which distance expression best follows SMNV recommendations?',
      options: [
        { id: 'nm-cable', label: 'Use nautical miles or cables (tenths of a mile), and always state the unit' },
        { id: 'number-only', label: 'Say only the number and let the receiver assume units' },
        { id: 'metres-only', label: 'Never use nautical miles in voice procedure' },
        { id: 'relative-only', label: 'Only use "near/far" qualitative language' },
      ],
      answer: 'nm-cable',
      explanation:
        'Appendix 2 advises expressing distance preferably in nautical miles/cables and stating the unit.',
      handbookRef: 'p. 81',
    },
    {
      id: 'position-time-format',
      topic: 'position',
      eyebrow: 'SMNV Appendix 2',
      title: 'Time format in radio reports',
      prompt:
        'How should times be transmitted according to SMNV guidance?',
      options: [
        { id: '24h', label: 'In 24-hour notation, specifying UTC, zone time, or local shore time' },
        { id: '12h', label: 'In 12-hour notation without timezone context' },
        { id: 'local-only', label: 'Always local time only, never UTC' },
        { id: 'optional', label: 'Time standard is optional in maritime messages' },
      ],
      answer: '24h',
      explanation:
        'Appendix 2 states time should be in 24-hour format and should indicate UTC/zone/local basis.',
      handbookRef: 'p. 81',
    },
  ],
  traffic: [
    {
      id: 'traffic-ack-prefix',
      topic: 'traffic',
      eyebrow: 'Acknowledging Distress',
      title: 'How the acknowledgement begins',
      prompt:
        'A station is acknowledging a distress message by voice. Which proword begins that acknowledgement according to the handbook examples?',
      options: [
        { id: 'panpan', label: 'Pan Pan' },
        { id: 'mayday', label: 'Mayday' },
        { id: 'securite', label: 'Securite' },
        { id: 'received', label: 'Received' },
      ],
      answer: 'mayday',
      explanation:
        'The handbook notes that the reply to the distress call and all subsequent distress traffic connected with the incident begins with `Mayday`.',
      handbookRef: 'p. 46',
    },
    {
      id: 'traffic-relay-when',
      topic: 'traffic',
      eyebrow: 'Mayday Relay',
      title: 'When to use Mayday Relay',
      prompt:
        'When is `Mayday Relay` the correct voice procedure?',
      options: [
        { id: 'own-vessel', label: 'When your own vessel is in distress' },
        { id: 'other-casualty', label: 'When relaying distress for another vessel or person' },
        { id: 'routine-delay', label: 'When a routine call goes unanswered' },
        { id: 'medical', label: 'Whenever requesting medical advice' },
      ],
      answer: 'other-casualty',
      explanation:
        'Mayday Relay is used when your vessel is not itself the casualty and you are relaying distress traffic for someone else.',
      handbookRef: 'pp. 51, 71',
    },
    {
      id: 'traffic-seelonce',
      topic: 'traffic',
      eyebrow: 'Seelonce',
      title: 'Purpose of Seelonce',
      prompt:
        'What is the function of the `Seelonce` procedure in distress traffic?',
      options: [
        { id: 'move-working', label: 'Move routine traffic to a working channel' },
        { id: 'clear-channel', label: 'Impose radio silence to protect distress traffic' },
        { id: 'close-call', label: 'End the distress situation formally' },
        { id: 'repeat-position', label: 'Ask the casualty to repeat position' },
      ],
      answer: 'clear-channel',
      explanation:
        'Seelonce procedures exist to keep the distress channel clear for traffic connected with the distress incident.',
      handbookRef: 'p. 50',
    },
    {
      id: 'traffic-garbled',
      topic: 'traffic',
      eyebrow: 'Routine And Distress Handling',
      title: 'When a message is not properly heard',
      prompt:
        'If a message is not properly heard, which standard response from the handbook fits best?',
      options: [
        { id: 'say-again', label: 'Say again' },
        { id: 'received', label: 'Received' },
        { id: 'wait', label: 'Wait' },
        { id: 'out', label: 'Out' },
      ],
      answer: 'say-again',
      explanation:
        'The standard response to a message not properly heard is `Say again`.',
      handbookRef: 'pp. 41, 79',
    },
    {
      id: 'traffic-coast-priority',
      topic: 'traffic',
      eyebrow: 'Receiving Distress',
      title: 'Who should handle first if likely available',
      prompt:
        'On hearing a distress alert or message, if a coast station is likely in range and handling the incident, what is the correct discipline for another vessel?',
      options: [
        { id: 'interfere', label: 'Send an immediate acknowledgement so the casualty hears at least one reply' },
        { id: 'standby', label: 'Stand by briefly and avoid unnecessary interference' },
        { id: 'switchoff', label: 'Call the coast station on another channel to report you heard the distress' },
        { id: 'relay-routine', label: 'Start a Mayday Relay on nearby working channels without waiting' },
      ],
      answer: 'standby',
      explanation:
        'The handbook advises discipline: allow likely coast-station control to develop and avoid interfering unless you are needed to assist or relay.',
      handbookRef: 'pp. 48-49, 68',
    },
    {
      id: 'traffic-ack-obligation',
      topic: 'traffic',
      eyebrow: 'Operational Procedures D1',
      title: 'Obligation to acknowledge distress',
      prompt:
        'What does Appendix 1 D1 include regarding distress acknowledgements?',
      options: [
        { id: 'must-understand', label: 'Obligation and correct form of acknowledgement are examinable knowledge' },
        { id: 'optional', label: 'Acknowledging distress is optional and never assessed' },
        { id: 'dsc-only', label: 'Only DSC acknowledgements matter; voice form is not required' },
        { id: 'coast-exclusive', label: 'Only coast stations may acknowledge distress messages' },
      ],
      answer: 'must-understand',
      explanation:
        'D1 explicitly includes obligation to acknowledge a distress message and correct acknowledgement form/action.',
      handbookRef: 'p. 76',
    },
    {
      id: 'traffic-seelonce-feenee-meaning',
      topic: 'traffic',
      eyebrow: 'Operational Procedures D1',
      title: 'Meaning of Seelonce Feenee',
      prompt:
        'In distress traffic control, what does `Seelonce Feenee` indicate?',
      options: [
        { id: 'end-distress-silence', label: 'Distress silence is ended and normal traffic may resume as directed' },
        { id: 'start-silence', label: 'Immediate start of distress silence' },
        { id: 'position-repeat', label: 'Request for casualty to repeat position' },
        { id: 'relay-order', label: 'Order for every ship to send a relay message' },
      ],
      answer: 'end-distress-silence',
      explanation:
        'Appendix D1 lists Seelonce Mayday and Seelonce Feenee as control signals in distress traffic lifecycle.',
      handbookRef: 'p. 76',
    },
    {
      id: 'traffic-transmissions-during-distress',
      topic: 'traffic',
      eyebrow: 'Protection Of Distress Frequencies C3',
      title: 'During active distress traffic',
      prompt:
        'What is the correct channel-discipline rule during distress traffic?',
      options: [
        { id: 'restrict', label: 'Keep transmissions restricted to distress-related traffic; avoid interference' },
        { id: 'routine-ok', label: 'Routine calls are acceptable if brief' },
        { id: 'chat-safe', label: 'Safety and marina chat may continue normally' },
        { id: 'blind-repeat', label: 'Repeat every distress message regardless of instruction' },
      ],
      answer: 'restrict',
      explanation:
        'C3 includes transmissions during distress traffic and distress-frequency protection, requiring strict interference avoidance.',
      handbookRef: 'pp. 75-76',
    },
    {
      id: 'traffic-on-scene-purpose',
      topic: 'traffic',
      eyebrow: 'GMDSS C2',
      title: 'On-scene communications focus',
      prompt:
        'What is the primary focus of on-scene communications in SAR distress handling?',
      options: [
        { id: 'sar-tasking', label: 'Coordination and tasking directly related to the SAR/distress operation' },
        { id: 'public-calls', label: 'Passing administrative and charging details for public correspondence' },
        { id: 'routine-berths', label: 'Continuing routine harbour and berth traffic while monitoring the incident' },
        { id: 'maintenance-chat', label: 'Passing weather and routine reports not directly tied to SAR tasking' },
      ],
      answer: 'sar-tasking',
      explanation:
        'Appendix C2 includes on-scene communications and SAR operation as dedicated distress-handling functions.',
      handbookRef: 'p. 74',
    },
  ],
  procedure: [
    {
      id: 'proc-over',
      topic: 'procedure',
      eyebrow: 'Standard Vocabulary',
      title: 'Handing turn to the other station',
      prompt:
        'You finish passing berth details and now expect the marina to reply. Which final proword should you use?',
      options: [
        { id: 'out', label: 'Out' },
        { id: 'over', label: 'Over' },
        { id: 'wait', label: 'Wait' },
        { id: 'received', label: 'Received' },
      ],
      answer: 'over',
      explanation:
        '`Over` invites a reply. `Out` ends the exchange and means no reply is expected.',
      handbookRef: 'pp. 41, 79',
    },
    {
      id: 'proc-readback',
      topic: 'procedure',
      eyebrow: 'Standard Vocabulary',
      title: 'Verifying copied details',
      prompt:
        'You have just transmitted a position report and want confirmation that it was copied exactly. Which phrase should you use?',
      options: [
        { id: 'say-again', label: 'Say again' },
        { id: 'read-back', label: 'Read back' },
        { id: 'correction', label: 'I say again' },
        { id: 'word-before', label: 'Message not understood' },
      ],
      answer: 'read-back',
      explanation:
        '`Read back` is the request for the other station to repeat the message you have just passed.',
      handbookRef: 'p. 41',
    },
    {
      id: 'proc-say-again',
      topic: 'procedure',
      eyebrow: 'Standard Vocabulary',
      title: 'Not heard vs not understood',
      prompt:
        'A transmission is broken by static and key words were not heard at all. Which phrase is the best request?',
      options: [
        { id: 'say-again', label: 'Say again' },
        { id: 'received', label: 'Message not understood' },
        { id: 'radio-check', label: 'Read back' },
        { id: 'wait', label: 'Stand by' },
      ],
      answer: 'say-again',
      explanation:
        '`Say again` is the handbook phrase for asking someone to repeat what they just said.',
      handbookRef: 'pp. 41, 79',
    },
    {
      id: 'proc-radio-check',
      topic: 'procedure',
      eyebrow: 'Routine Calls',
      title: 'Testing readability and strength',
      prompt:
        'Before departure, you need another station to grade your readability and signal strength. What is the correct opening request?',
      options: [
        { id: 'radio-check', label: 'Radio check' },
        { id: 'received', label: 'How do you read me?' },
        { id: 'i-spell', label: 'Readability five' },
        { id: 'station-calling', label: 'Read back' },
      ],
      answer: 'radio-check',
      explanation:
        '`Radio check` is the standard phrase for requesting a report on signal quality and readability.',
      handbookRef: 'pp. 36, 41',
    },
    {
      id: 'proc-i-spell',
      topic: 'procedure',
      eyebrow: 'Phonetic Alphabet',
      title: 'Spelling an awkward boat name',
      prompt: 'You need to spell an unusual yacht name to avoid confusion. Which phrase should introduce the spelling?',
      options: [
        { id: 'i-spell', label: 'I spell' },
        { id: 'all-after', label: 'In letters' },
        { id: 'correction', label: 'In figures' },
        { id: 'message', label: 'Read back' },
      ],
      answer: 'i-spell',
      explanation:
        'The handbook uses `I spell` before giving a word in the phonetic alphabet.',
      handbookRef: 'pp. 41-42',
    },
    {
      id: 'proc-over-out',
      topic: 'procedure',
      eyebrow: 'Routine Procedure',
      title: 'Ending correctly',
      prompt:
        'Which phrase should be avoided because it combines contradictory turn-taking meanings?',
      options: [
        { id: 'over-out', label: 'Over and out' },
        { id: 'read-back', label: 'Over' },
        { id: 'radio-check', label: 'Out' },
        { id: 'say-again', label: 'Wait, out' },
      ],
      answer: 'over-out',
      explanation:
        'The handbook says `Over` expects a reply and `Out` does not. Putting them together is contradictory.',
      handbookRef: 'p. 30',
    },
    {
      id: 'proc-correction',
      topic: 'procedure',
      eyebrow: 'Standard Vocabulary',
      title: 'Fixing your own mistake',
      prompt:
        'You transmit the wrong latitude minute and need to fix it immediately in the same transmission. Which word should start the fix?',
      options: [
        { id: 'correction', label: 'Correction' },
        { id: 'received', label: 'Wrong' },
        { id: 'wait', label: 'I say again' },
        { id: 'all-after', label: 'Read back' },
      ],
      answer: 'correction',
      explanation:
        'Use `Correction` when you have made a mistake and need to put it right immediately.',
      handbookRef: 'p. 41',
    },
    {
      id: 'proc-wait',
      topic: 'procedure',
      eyebrow: 'Standard Vocabulary',
      title: 'Asking the other station to pause',
      prompt:
        'You need a short pause to check charted data before continuing. Which phrase best manages the pause?',
      options: [
        { id: 'wait', label: 'Wait' },
        { id: 'out', label: 'Out' },
        { id: 'station-calling', label: 'Stand by' },
        { id: 'read-back', label: 'Received' },
      ],
      answer: 'wait',
      explanation:
        '`Wait` means expect me to pause, and ideally you should qualify it by time if possible.',
      handbookRef: 'p. 41',
    },
    {
      id: 'proc-this-is',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Identifying your own station',
      prompt:
        'After calling another station, which phrase introduces your own station identity block?',
      options: [
        { id: 'this-is', label: 'This is' },
        { id: 'station-calling', label: 'Station calling' },
        { id: 'received', label: 'Received' },
        { id: 'traffic', label: 'Text' },
      ],
      answer: 'this-is',
      explanation:
        '`This is` is the standard identifier before giving your station name/callsign.',
      handbookRef: 'pp. 30, 77',
    },
    {
      id: 'proc-received',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Confirming reception',
      prompt:
        'A coast station asks you to confirm receipt of instructions that you copied correctly. Which acknowledgement signal fits best?',
      options: [
        { id: 'received', label: 'Received' },
        { id: 'say-again', label: 'Correct' },
        { id: 'read-back', label: 'Read back' },
        { id: 'wait', label: 'Message not understood' },
      ],
      answer: 'received',
      explanation:
        '`Received` confirms the message has been heard and understood.',
      handbookRef: 'pp. 41, 77',
    },
    {
      id: 'proc-station-calling',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Unknown caller identity',
      prompt:
        'You hear a weak call addressed to your vessel, but the caller identity is unclear. Which phrase should you use to respond?',
      options: [
        { id: 'station-calling', label: 'Station calling' },
        { id: 'this-is', label: 'This is' },
        { id: 'received', label: 'All stations' },
        { id: 'out', label: 'Say again all before' },
      ],
      answer: 'station-calling',
      explanation:
        '`Station calling` is used when the calling station identity is unknown or unclear.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-all-before',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Repeat preceding section',
      prompt:
        'Message received: "Proceed to buoy ALFA then berth DELTA". You missed the part before "berth". Which request is correct?',
      options: [
        { id: 'all-before', label: 'All before' },
        { id: 'all-after', label: 'All after' },
        { id: 'word-before', label: 'Word before' },
        { id: 'word-after', label: 'Word after' },
      ],
      answer: 'all-before',
      explanation:
        'Appendix basic signal `ALL BEFORE` requests repetition of the message part before the reference word/group.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-all-after',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Repeat following section',
      prompt:
        'Message received: "Proceed to buoy ALFA then berth DELTA". You missed everything after "ALFA". Which request is correct?',
      options: [
        { id: 'all-after', label: 'All after' },
        { id: 'all-before', label: 'All before' },
        { id: 'word-after', label: 'Word after' },
        { id: 'word-before', label: 'Word before' },
      ],
      answer: 'all-after',
      explanation:
        'Appendix basic signal `ALL AFTER` requests repetition of the message part after the reference word/group.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-word-before',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Repeat one word before',
      prompt:
        'You need only one missing word: the word immediately before "DELTA". Which request is correct?',
      options: [
        { id: 'word-before', label: 'Word before' },
        { id: 'all-before', label: 'All before' },
        { id: 'word-after', label: 'Word after' },
        { id: 'all-after', label: 'All after' },
      ],
      answer: 'word-before',
      explanation:
        '`Word before` is used to recover one specific preceding word only.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-word-after',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Repeat one word after',
      prompt:
        'You need only one missing word: the word immediately after "ALFA". Which request is correct?',
      options: [
        { id: 'word-after', label: 'Word after' },
        { id: 'all-after', label: 'All after' },
        { id: 'word-before', label: 'Word before' },
        { id: 'all-before', label: 'All before' },
      ],
      answer: 'word-after',
      explanation:
        '`Word after` is used to recover one specific following word only.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-in-figures',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Numeric format marker',
      prompt:
        'You are about to pass ETA 1545 and distance 2.4 miles. Which marker best indicates numeric details follow?',
      options: [
        { id: 'in-figures', label: 'In figures' },
        { id: 'in-letters', label: 'In letters' },
        { id: 'i-spell', label: 'I spell' },
        { id: 'text', label: 'Traffic' },
      ],
      answer: 'in-figures',
      explanation:
        'Appendix basic signal `IN FIGURES` indicates the following data should be transmitted as figures.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-in-letters',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Letter format marker',
      prompt:
        'You are about to pass a berth code as letters rather than numbers. Which marker should you use?',
      options: [
        { id: 'in-letters', label: 'In letters' },
        { id: 'in-figures', label: 'In figures' },
        { id: 'i-spell', label: 'I spell' },
        { id: 'traffic', label: 'Text' },
      ],
      answer: 'in-letters',
      explanation:
        '`In letters` marks that the following content is to be given in letters.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-i-say-again',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Repeating your own words',
      prompt:
        'As the transmitting station, you intentionally repeat your last phrase for clarity (not because requested). Which phrase fits best?',
      options: [
        { id: 'i-say-again', label: 'I say again' },
        { id: 'say-again', label: 'Say again' },
        { id: 'read-back', label: 'Read back' },
        { id: 'correction', label: 'Correction' },
      ],
      answer: 'i-say-again',
      explanation:
        '`I say again` is used by the sender to repeat part of their own message.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-correct',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Confirming accuracy',
      prompt:
        'After the other station reads back your message exactly, which signal confirms the read-back is accurate?',
      options: [
        { id: 'correct', label: 'Correct' },
        { id: 'received', label: 'Received' },
        { id: 'wrong', label: 'Wrong' },
        { id: 'wait', label: 'I say again' },
      ],
      answer: 'correct',
      explanation:
        'Appendix basic signal `CORRECT` confirms that repeated information is accurate.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-wrong',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Indicating an error',
      prompt:
        'During read-back verification, the other station repeats one key value incorrectly. Which signal indicates the error?',
      options: [
        { id: 'wrong', label: 'Wrong' },
        { id: 'correct', label: 'Correct' },
        { id: 'received', label: 'Received' },
        { id: 'out', label: 'Message not understood' },
      ],
      answer: 'wrong',
      explanation:
        '`Wrong` is the basic signal for indicating that the repeated/received content is incorrect.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-text',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Message-content label',
      prompt:
        'In the Appendix basic-signal list, which label denotes message text/content follows?',
      options: [
        { id: 'text', label: 'Text' },
        { id: 'traffic', label: 'Traffic' },
        { id: 'in-letters', label: 'In letters' },
        { id: 'in-figures', label: 'In figures' },
      ],
      answer: 'text',
      explanation:
        '`Text` is listed in Appendix basic signals as a message-content label.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-traffic',
      topic: 'procedure',
      eyebrow: 'Appendix 1 Basic Signals',
      title: 'Traffic label signal',
      prompt:
        'Which listed term is explicitly used as a traffic/context label in the Appendix basic signals?',
      options: [
        { id: 'traffic', label: 'Traffic' },
        { id: 'text', label: 'Text' },
        { id: 'station-calling', label: 'Station calling' },
        { id: 'read-back', label: 'In letters' },
      ],
      answer: 'traffic',
      explanation:
        '`Traffic` appears in the Appendix basic-signal set as a traffic/message label term.',
      handbookRef: 'p. 77',
    },
    {
      id: 'proc-smnv-question-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: QUESTION',
      prompt:
        'What does the message marker `QUESTION` indicate in SMNV usage?',
      options: [
        { id: 'interrogative', label: 'The following message is interrogative (a question)' },
        { id: 'warning', label: 'The following message is a danger warning' },
        { id: 'instruction', label: 'The following message is a mandatory order' },
        { id: 'answer', label: 'The following message is a reply to previous traffic' },
      ],
      answer: 'interrogative',
      explanation:
        'Appendix 2 defines `QUESTION` as a marker indicating interrogative character.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-intention-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: INTENTION',
      prompt:
        'In SMNV, what does the marker `INTENTION` tell other stations?',
      options: [
        { id: 'planned-action', label: 'It informs others about immediate navigational actions intended by the sender' },
        { id: 'historical-fact', label: 'It reports only previously completed actions' },
        { id: 'charge-note', label: 'It announces traffic charging information' },
        { id: 'radio-test', label: 'It requests a radiotelephone test report' },
      ],
      answer: 'planned-action',
      explanation:
        '`INTENTION` is defined in Appendix 2 as information about immediate navigational actions intended to be taken.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-answer-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: ANSWER',
      prompt:
        'In SMNV marker usage, what does `ANSWER` indicate?',
      options: [
        { id: 'answer-reply', label: 'The following message is the reply to a previous question' },
        { id: 'answer-order', label: 'The following message is a mandatory order' },
        { id: 'answer-hazard', label: 'The following message is only a hazard warning' },
        { id: 'answer-intent', label: 'The following message states intended manoeuvre only' },
      ],
      answer: 'answer-reply',
      explanation:
        'Appendix 2 defines `ANSWER` as a reply marker linked to a previous question.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-request-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: REQUEST',
      prompt:
        'What does `REQUEST` tell the receiving station in SMNV?',
      options: [
        { id: 'request-action', label: 'The following message asks others to take action' },
        { id: 'request-observed', label: 'The following message is restricted to observed facts' },
        { id: 'request-warning', label: 'The following message is a danger warning only' },
        { id: 'request-reply', label: 'The following message is the final answer in the exchange' },
      ],
      answer: 'request-action',
      explanation:
        '`REQUEST` marks that action is being requested from other traffic participants.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-information-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: INFORMATION',
      prompt:
        'Which statement matches SMNV marker `INFORMATION`?',
      options: [
        { id: 'info-facts', label: 'The message is restricted to observed facts' },
        { id: 'info-order', label: 'The message is a compulsory instruction' },
        { id: 'info-intent', label: 'The message describes intended manoeuvre only' },
        { id: 'info-request', label: 'The message asks for immediate action from others' },
      ],
      answer: 'info-facts',
      explanation:
        '`INFORMATION` is used for factual observed content in the SMNV marker set.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-warning-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: WARNING',
      prompt:
        'What is the role of SMNV marker `WARNING`?',
      options: [
        { id: 'warning-danger', label: 'To inform other traffic participants about danger' },
        { id: 'warning-request', label: 'To request a routine radio check' },
        { id: 'warning-billing', label: 'To communicate public-correspondence charging details' },
        { id: 'warning-readback', label: 'To request read back of previous message only' },
      ],
      answer: 'warning-danger',
      explanation:
        'Appendix 2 defines `WARNING` as traffic-danger information for other participants.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-advice-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: ADVICE',
      prompt:
        'How does `ADVICE` differ from strict instruction in SMNV terms?',
      options: [
        { id: 'advice-recommend', label: 'It is a recommendation intended to influence the recipient' },
        { id: 'advice-order', label: 'It is always a mandatory order with no discretion' },
        { id: 'advice-question', label: 'It always introduces an interrogative question' },
        { id: 'advice-answer', label: 'It is only used as a reply marker' },
      ],
      answer: 'advice-recommend',
      explanation:
        '`ADVICE` indicates recommendation intent, distinct from mandatory instruction.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-instruction-marker',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'Message marker: INSTRUCTION',
      prompt:
        'What does marker `INSTRUCTION` indicate in SMNV?',
      options: [
        { id: 'instruction-order', label: 'A mandatory directive/regulation to influence recipient action' },
        { id: 'instruction-facts', label: 'Observed factual information only' },
        { id: 'instruction-intent', label: 'Only intended manoeuvre by sender' },
        { id: 'instruction-delay', label: 'Information will be provided later' },
      ],
      answer: 'instruction-order',
      explanation:
        '`INSTRUCTION` represents required direction/regulation rather than optional recommendation.',
      handbookRef: 'p. 78',
    },
    {
      id: 'proc-smnv-standby-response',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'When information will be available soon',
      prompt:
        'SMNV responses state that information is not immediately available but will be shortly. Which response is correct?',
      options: [
        { id: 'stand-by', label: 'Stand by' },
        { id: 'no-information', label: 'No information' },
        { id: 'message-not-understood', label: 'Message not understood' },
        { id: 'say-again', label: 'Say again' },
      ],
      answer: 'stand-by',
      explanation:
        'The response table uses `Stand by` when information is not immediately available but expected soon.',
      handbookRef: 'p. 79',
    },
    {
      id: 'proc-smnv-no-information',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'When information cannot be obtained',
      prompt:
        'If the requested information cannot be obtained, what response does SMNV give?',
      options: [
        { id: 'no-information', label: 'No information' },
        { id: 'wait', label: 'Stand by' },
        { id: 'received', label: 'Message not understood' },
        { id: 'out', label: 'No message available' },
      ],
      answer: 'no-information',
      explanation:
        'Appendix 2 response table states "No information" when information cannot be obtained.',
      handbookRef: 'p. 79',
    },
    {
      id: 'proc-smnv-not-understood',
      topic: 'procedure',
      eyebrow: 'SMNV Appendix 2',
      title: 'When message is not understood',
      prompt:
        'What standard phrase should be used if a message is heard but not understood?',
      options: [
        { id: 'message-not-understood', label: 'Message not understood' },
        { id: 'say-again', label: 'Say again' },
        { id: 'read-back', label: 'Read back' },
        { id: 'station-calling', label: 'Station calling' },
      ],
      answer: 'message-not-understood',
      explanation:
        'SMNV distinguishes not-heard ("Say again") from not-understood ("Message not understood").',
      handbookRef: 'p. 79',
    },
  ],
  gmdss: [
    {
      id: 'gmdss-rcc',
      topic: 'gmdss',
      eyebrow: 'GMDSS C1',
      title: 'Role of RCC',
      prompt:
        'What is the primary role of an RCC (Rescue Coordination Centre) in GMDSS context?',
      options: [
        { id: 'coordinates-sar', label: 'Coordinate search-and-rescue operations' },
        { id: 'issues-licences', label: 'Issue ship radio licences' },
        { id: 'collects-aaic', label: 'Calculate and collect AAIC call charges' },
        { id: 'repairs-vhf', label: 'Provide technical VHF equipment repair' },
      ],
      answer: 'coordinates-sar',
      explanation:
        'Appendix 1 includes RCC role and SAR organisation knowledge under GMDSS procedures.',
      handbookRef: 'p. 74',
    },
    {
      id: 'gmdss-navtex-purpose',
      topic: 'gmdss',
      eyebrow: 'GMDSS C4',
      title: 'NAVTEX system purpose',
      prompt:
        'What is NAVTEX primarily used for in SRC syllabus context?',
      options: [
        { id: 'msi', label: 'Receiving Maritime Safety Information broadcasts' },
        { id: 'voice-call', label: 'Making routine voice calls to marinas' },
        { id: 'position-fix', label: 'Generating GNSS position fixes' },
        { id: 'dsc-replacement', label: 'Replacing DSC distress alerts completely' },
      ],
      answer: 'msi',
      explanation:
        'The syllabus explicitly names NAVTEX under MSI with distress/safety information capability.',
      handbookRef: 'p. 75',
    },
    {
      id: 'gmdss-epirb-function',
      topic: 'gmdss',
      eyebrow: 'Alerting And Locating C5',
      title: 'EPIRB function',
      prompt:
        'What is the core function of an EPIRB in an emergency?',
      options: [
        { id: 'alert-locate', label: 'Transmit distress alerting/locating information to SAR services' },
        { id: 'voice-bridge', label: 'Provide duplex voice bridge on VHF channels' },
        { id: 'ais-routing', label: 'Route AIS targets to port control channels' },
        { id: 'battery-charge', label: 'Charge handheld VHF batteries' },
      ],
      answer: 'alert-locate',
      explanation:
        'EPIRB is an alerting and locating signal device in GMDSS emergency architecture.',
      handbookRef: 'p. 75',
    },
    {
      id: 'gmdss-epirb-checks',
      topic: 'gmdss',
      eyebrow: 'Alerting And Locating C5',
      title: 'Routine EPIRB checks',
      prompt:
        'Which maintenance checks are explicitly relevant to EPIRB readiness?',
      options: [
        { id: 'battery-float', label: 'Battery expiry and float-free mechanism checks' },
        { id: 'paint-colour', label: 'Self-test only; battery-expiry and float-free checks are not routine requirements' },
        { id: 'mast-height', label: 'EPIRB readiness is mainly verified through VHF antenna and VSWR checks' },
        { id: 'aaic-update', label: 'Regular firmware/software updates are the primary readiness requirement' },
      ],
      answer: 'battery-float',
      explanation:
        'Appendix 1 mentions battery expiry and float-free mechanism checks in EPIRB maintenance.',
      handbookRef: 'p. 75',
    },
    {
      id: 'gmdss-sart-purpose',
      topic: 'gmdss',
      eyebrow: 'Alerting And Locating C5',
      title: 'SART role',
      prompt:
        'What is the purpose of a SART (Search and Rescue Radar Transponder)?',
      options: [
        { id: 'radar-location', label: 'Help rescuers locate survival craft by radar response' },
        { id: 'voice-channel', label: 'Provide emergency voice communications channel' },
        { id: 'encrypt', label: 'Encrypt distress traffic for privacy' },
        { id: 'battery-backup', label: 'Act only as backup battery for fixed VHF' },
      ],
      answer: 'radar-location',
      explanation:
        'SART is a locating transponder for SAR, not a normal voice communications unit.',
      handbookRef: 'p. 76',
    },
    {
      id: 'gmdss-false-alert',
      topic: 'gmdss',
      eyebrow: 'Protection Of Distress Frequencies C3',
      title: 'False-alert handling principle',
      prompt:
        'Which statement best matches syllabus expectations for false distress alerts?',
      options: [
        { id: 'ignore', label: 'Ignore the alert and continue normal traffic' },
        { id: 'cancel-procedure', label: 'Follow formal cancellation/informing procedure immediately' },
        { id: 'switch-off', label: 'Switch equipment off and avoid further transmission' },
        { id: 'repeat', label: 'Repeat the same alert until acknowledged' },
      ],
      answer: 'cancel-procedure',
      explanation:
        'False-alert procedures and distress-frequency protection are explicit C3 syllabus requirements.',
      handbookRef: 'pp. 75, 69',
    },
    {
      id: 'gmdss-channel70-status',
      topic: 'gmdss',
      eyebrow: 'Protection Of Distress Frequencies C3',
      title: 'Status of Channel 70',
      prompt:
        'How should Channel 70 be treated in operating practice?',
      options: [
        { id: 'dsc-guard', label: 'As a protected DSC distress/safety/calling channel with no voice traffic' },
        { id: 'voice-backup', label: 'As an emergency voice backup channel when Channel 16 is congested' },
        { id: 'marina-chat', label: 'As a local marina/harbour calling channel when traffic is light' },
        { id: 'music', label: 'As a training voice channel while alongside if no DSC distress is active' },
      ],
      answer: 'dsc-guard',
      explanation:
        'Channel 70 status/protection is named directly in the syllabus and must remain clear of voice.',
      handbookRef: 'pp. 75, 61',
    },
    {
      id: 'gmdss-sea-areas',
      topic: 'gmdss',
      eyebrow: 'GMDSS C1',
      title: 'Sea areas topic relevance',
      prompt:
        'Why does Appendix 1 include awareness of sea areas in SRC knowledge?',
      options: [
        { id: 'facility-access', label: 'To understand access to different GMDSS alerting/facility coverage' },
        { id: 'tax-zones', label: 'To calculate customs and harbour tax zones' },
        { id: 'fishing-law', label: 'To identify recreational fishing restrictions' },
        { id: 'anchor-scope', label: 'To choose anchor scope tables' },
      ],
      answer: 'facility-access',
      explanation:
        'Sea areas are included to frame which GMDSS facilities are accessible and how alerts are routed.',
      handbookRef: 'p. 74',
    },
    {
      id: 'gmdss-navtex-station-identifier',
      topic: 'gmdss',
      eyebrow: 'MSI / NAVTEX C4',
      title: 'NAVTEX station identifier role',
      prompt:
        'What does the NAVTEX station identifier letter allow the receiver to do?',
      options: [
        { id: 'service-area-filter', label: 'Select/print messages for the desired service area' },
        { id: 'voice-channel-select', label: 'Choose VHF voice working channel automatically' },
        { id: 'epirb-activation', label: 'Activate EPIRB remotely through NAVTEX broadcast' },
        { id: 'charge-calc', label: 'Calculate AAIC charging category for public correspondence' },
      ],
      answer: 'service-area-filter',
      explanation:
        'The handbook NAVTEX appendix notes that station identifier supports programming reception for the intended service area.',
      handbookRef: 'p. 85',
    },
    {
      id: 'gmdss-sart-range-factors',
      topic: 'gmdss',
      eyebrow: 'Alerting And Locating C5',
      title: 'SART range influences',
      prompt:
        'Which factors are explicitly listed for SART performance awareness?',
      options: [
        { id: 'height-reflector', label: 'Operating height and radar-reflector effects influence effective range' },
        { id: 'hull-colour', label: 'Hull colour and deck paint are primary range factors' },
        { id: 'aaic', label: 'AAIC code class directly changes SART range' },
        { id: 'dimmer', label: 'VHF dimmer level determines SART output range' },
      ],
      answer: 'height-reflector',
      explanation:
        'Appendix 1 C5 includes operating height and radar reflector effect in SART knowledge points.',
      handbookRef: 'p. 76',
    },
  ],
  regulations: [
    {
      id: 'reg-licence',
      topic: 'regulations',
      eyebrow: 'Regulations D2',
      title: 'Can you legally transmit?',
      prompt:
        'You join a friend for a cross-Channel passage. Before using the fixed VHF set, which baseline regulatory condition must be in place?',
      options: [
        { id: 'station-licence', label: 'The vessel must have a valid ship station licence and operate under licensing rules' },
        { id: 'mmsi-only', label: 'A programmed MMSI and working set are sufficient, even if station licensing is unresolved' },
        { id: 'insurance', label: 'Current vessel insurance and marina registration are accepted in place of station licensing' },
        { id: 'offshore-only', label: 'Licensing becomes mandatory only for offshore passages, not coastal operation' },
      ],
      answer: 'station-licence',
      explanation:
        'Appendix 1 D2 explicitly requires awareness of ship station licensing. Why this matters: legal status of the station underpins every routine and emergency transmission.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-operator-control',
      topic: 'regulations',
      eyebrow: 'Regulations D2',
      title: 'Who controls radio operation?',
      prompt:
        'A non-certified crew member offers to "run the radio watch all day". Which statement matches the regulation focus in SRC?',
      options: [
        { id: 'cert-holder', label: 'Radio operation should be controlled by a holder of an appropriate certificate of competence' },
        { id: 'any-crew', label: 'Any crew member may independently control operation once briefed by the skipper' },
        { id: 'helm-only', label: 'The person on the helm automatically becomes radio controller regardless of qualification' },
        { id: 'coast-transfer', label: 'In harbour waters, routine radio control defaults to coast-station direction' },
      ],
      answer: 'cert-holder',
      explanation:
        'D2 includes operator entitlement and control by an appropriately certificated person. Why this matters: comms errors under pressure are reduced when a qualified operator controls procedures.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-secrecy',
      topic: 'regulations',
      eyebrow: 'Regulations D2',
      title: 'Secrecy of correspondence in practice',
      prompt:
        'You overhear another vessel passing private medical details on VHF. What is the compliant response?',
      options: [
        { id: 'confidentiality', label: 'Treat received correspondence as confidential and do not disclose it improperly' },
        { id: 'relay-to-marina', label: 'Pass private details to marina control if it may help local traffic planning' },
        { id: 'publish-online', label: 'Share sensitive details with your sailing group for case logging and learning' },
        { id: 'repeat-on-working', label: 'Repeat private traffic on a clearer working channel to improve intelligibility' },
      ],
      answer: 'confidentiality',
      explanation:
        'D2 requires preservation of secrecy of correspondence. Why this matters: trust and legal compliance depend on not redistributing private traffic heard on the radio.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-logbook',
      topic: 'regulations',
      eyebrow: 'Regulations D2',
      title: 'Radio record keeping after an incident',
      prompt:
        'You handled a Pan Pan exchange, then moved to a working channel for follow-up coordination. What is expected regarding records?',
      options: [
        { id: 'required-awareness', label: 'Keep required radio records in line with national regulations' },
        { id: 'optional-leisure', label: 'On leisure craft, logging is discretionary even where national rules set requirements' },
        { id: 'distress-only', label: 'Only distress communications require records; urgency and safety do not' },
        { id: 'paper-only', label: 'Compliance requires a paper-only log; electronic records are not acceptable' },
      ],
      answer: 'required-awareness',
      explanation:
        'D2 explicitly references national regulations concerning radio record keeping. Why this matters: records support operational continuity and post-incident accountability.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-prohibited-traffic',
      topic: 'regulations',
      eyebrow: 'Regulations D2',
      title: 'Recognising prohibited traffic',
      prompt:
        'A crew member suggests sending a fake urgency call as a "quick test". Which response is correct under regulations?',
      options: [
        { id: 'must-know', label: 'Some call/message types are prohibited, and false or improper traffic must not be transmitted' },
        { id: 'training-exempt', label: 'False traffic is acceptable if you declare "exercise" at the start of the call' },
        { id: 'coast-only-prohibited', label: 'Prohibited-message rules apply to coast stations, while ships may improvise' },
        { id: 'free-channel-rule', label: 'If no one is using the channel, improvised call content is acceptable' },
      ],
      answer: 'must-know',
      explanation:
        'D2 explicitly includes awareness of prohibited call/message types. Why this matters: misuse can obstruct safety traffic and create legal exposure.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-public-correspondence',
      topic: 'regulations',
      eyebrow: 'Procedures D3',
      title: 'Public correspondence call flow',
      prompt:
        'You need to place a routine public correspondence call via a coast station. Which knowledge is explicitly in scope?',
      options: [
        { id: 'coast-call-method', label: 'How to call the coast station by radiotelephony, order the link call, and end it correctly' },
        { id: 'working-channel-only', label: 'Only working-channel selection is required; ordering and ending procedures are not assessed' },
        { id: 'coast-calls-first', label: 'Ships should wait for coast stations to initiate all public correspondence traffic' },
        { id: 'distress-format', label: 'Public correspondence calls follow distress-message format to standardise call setup' },
      ],
      answer: 'coast-call-method',
      explanation:
        'D3 includes public correspondence radiotelephone call methods, ordering a link call, and call closure. Why this matters: correct flow reduces air-time and avoids confusion during billed communications.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-aaic',
      topic: 'regulations',
      eyebrow: 'Traffic Charges D3',
      title: 'Why the operator asks for AAIC',
      prompt:
        'During a billed public correspondence service, the coast station asks for AAIC details. What does AAIC refer to?',
      options: [
        { id: 'accounting-id', label: 'Accounting Authority Identification Code used within the international charging system' },
        { id: 'routeing-id', label: 'A routeing code used by coast stations to choose working-channel duplex pairs' },
        { id: 'dsc-priority-id', label: 'A DSC priority token that authorises routine traffic charging' },
        { id: 'licence-class-id', label: 'A station-licence class identifier linked to transmitter power limits' },
      ],
      answer: 'accounting-id',
      explanation:
        'D3 specifically names traffic charges and the Accounting Authority Identification Code (AAIC). Why this matters: charging/accounting details are part of real public correspondence workflow.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-garbled-unanswered',
      topic: 'regulations',
      eyebrow: 'Practical Traffic Routines D3',
      title: 'No reply or unreadable reply',
      prompt:
        'You call a coast station, get no answer, then receive broken unreadable audio. Which action matches D3 practical routine discipline?',
      options: [
        { id: 'unanswered-garbled', label: 'Apply unanswered/garbled call procedures, repeat correctly, and keep communications controlled' },
        { id: 'rapid-repeat', label: 'Use rapid repeat transmissions until contact is forced, then sort details later' },
        { id: 'skip-callsign', label: 'Shorten repeat calls by omitting callsigns and identity blocks' },
        { id: 'self-shift', label: 'Shift unilaterally to another channel without re-establishing controlled contact' },
      ],
      answer: 'unanswered-garbled',
      explanation:
        'D3 explicitly includes procedures for unanswered and garbled calls plus communication control. Why this matters: disciplined recovery keeps calling channels usable and avoids escalating confusion.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-coast-call-methods',
      topic: 'regulations',
      eyebrow: 'Public Correspondence D3',
      title: 'General communications: voice or DSC?',
      prompt:
        'Your set supports voice and DSC, and you need routine coast-station contact. What is the exam-relevant expectation?',
      options: [
        { id: 'both-methods', label: 'Both radiotelephony calling method and DSC calling method are part of required knowledge' },
        { id: 'voice-only', label: 'Only radiotelephony method is expected; DSC coast calling is outside routine scope' },
        { id: 'dsc-only', label: 'Routine coast communication should be taught as DSC-only to reduce voice occupancy' },
        { id: 'context-dependent', label: 'Only one method is expected at exam level, chosen by local coast-station policy' },
      ],
      answer: 'both-methods',
      explanation:
        'D3 explicitly lists calling a coast station by radiotelephony and by DSC for general communications. Why this matters: in service, available method depends on equipment, channel loading, and service type.',
      handbookRef: 'p. 77',
    },
    {
      id: 'reg-channel-routine-scope',
      topic: 'regulations',
      eyebrow: 'Practical Traffic Routines D3',
      title: 'Where call-establishment routines apply',
      prompt:
        'In practical traffic routines, communication-establishment procedure is expected across which contexts?',
      options: [
        { id: 'full-set', label: 'Intership, public correspondence, small-craft safety, port-operation and ship-movement channels' },
        { id: 'distress-only', label: 'Distress channels only, because routine channels follow local custom' },
        { id: 'marina-only', label: 'Marina and harbour channels only' },
        { id: 'onboard-only', label: 'Only onboard crew coordination channels' },
      ],
      answer: 'full-set',
      explanation:
        'D3 names these contexts explicitly, alongside unanswered/garbled-call handling and communication control. Why this matters: exam tasks and real traffic both require consistent procedure across multiple service channel types.',
      handbookRef: 'p. 77',
    },
  ],
};

export const CHANNEL_PLAN_SIM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'cp-distress-voice-16',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.3',
    title: 'Initial voice distress channel',
    prompt:
      'You must make an initial MAYDAY voice call. Which channel is correct?',
    options: [
      { id: 'ch16', label: 'Channel 16 (voice distress/safety/calling)' },
      { id: 'ch70', label: 'Channel 70 (DSC)' },
      { id: 'ch80', label: 'Channel 80 (port operations)' },
      { id: 'ch77', label: 'Channel 77 (intership)' },
    ],
    answer: 'ch16',
    explanation:
      'Initial voice distress traffic belongs on Channel 16. Channel 70 is DSC signalling only.',
    handbookRef: 'pp. 25-29, 82-83',
  },
  {
    id: 'cp-distress-dsc-70',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.3 / B2',
    title: 'Distress alert signalling channel',
    prompt:
      'You are sending a DSC distress alert from the controller. Which channel carries the digital alert?',
    options: [
      { id: 'ch70', label: 'Channel 70 (DSC distress/safety/calling)' },
      { id: 'ch16', label: 'Channel 16 (voice calling/distress)' },
      { id: 'ch67', label: 'Channel 67 (UK small-craft safety/HMCG working)' },
      { id: 'ch06', label: 'Channel 06 (intership)' },
    ],
    answer: 'ch70',
    explanation:
      'DSC alerts are sent on Channel 70. Voice follow-up is then made on Channel 16.',
    handbookRef: 'pp. 61-68, 82-83',
  },
  {
    id: 'cp-routine-clear-16',
    topic: 'channels',
    eyebrow: 'Appendix 1 D3',
    title: 'Clearing the calling channel',
    prompt:
      'You have established routine contact on 16 with a marina. What should happen next?',
    options: [
      { id: 'move-working', label: 'Move promptly to an agreed working/port-operations channel' },
      { id: 'stay-16', label: 'Stay on 16 for the full routine exchange to keep traffic simple' },
      { id: 'move-70', label: 'Switch to 70 for routine voice exchange' },
      { id: 'move-distress', label: 'Move to any distress-designated channel to avoid marina congestion' },
    ],
    answer: 'move-working',
    explanation:
      'Routine traffic should move off 16 as soon as contact is made, onto the correct working channel.',
    handbookRef: 'pp. 30-31, 82-83',
  },
  {
    id: 'cp-marina-port-ops',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.3',
    title: 'Marina and harbour coordination',
    prompt:
      'You need berth and docking coordination with a marina inside harbour limits. Which channel class is correct?',
    options: [
      { id: 'port-ops', label: 'Published port-operations/harbour working channel' },
      { id: 'intership', label: 'Intership simplex channel by default' },
      { id: 'dsc-only', label: 'Channel 70 voice call to marina' },
      { id: 'distress', label: 'Channel 16 for full berthing conversation' },
    ],
    answer: 'port-ops',
    explanation:
      'Port operations traffic should use the published harbour/marina channels, not prolonged traffic on 16.',
    handbookRef: 'pp. 28-31, 82-83',
  },
  {
    id: 'cp-ship-movement-service',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.1 / D3',
    title: 'Traffic organisation near fairway crossing',
    prompt:
      'You are crossing a commercial fairway and require movement instructions from traffic control. Which service context applies?',
    options: [
      { id: 'ship-movement', label: 'Ship movement service channel published for the area' },
      { id: 'public-correspondence', label: 'Public correspondence duplex channel' },
      { id: 'on-board', label: 'On-board communications channel' },
      { id: 'dsc-watch', label: 'Channel 70 voice coordination' },
    ],
    answer: 'ship-movement',
    explanation:
      'This is ship-movement traffic, not public correspondence or on-board coordination.',
    handbookRef: 'pp. 72, 77, 82-83',
  },
  {
    id: 'cp-intership-working',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.1',
    title: 'Yacht-to-yacht tactical call',
    prompt:
      'Two nearby yachts in open water need short routine coordination and no harbour authority is involved. Best channel class?',
    options: [
      { id: 'intership', label: 'Intership working channel (per local chart/allocation)' },
      { id: 'public-correspondence', label: 'Public correspondence channel' },
      { id: 'dsc-alert', label: 'Channel 70 for voice routine exchange' },
      { id: 'distress-long', label: 'Remain on Channel 16 for all dialogue' },
    ],
    answer: 'intership',
    explanation:
      'Routine vessel-to-vessel traffic belongs on intership channels after initial calling discipline is satisfied.',
    handbookRef: 'pp. 72, 82-83',
  },
  {
    id: 'cp-public-correspondence-service',
    topic: 'channels',
    eyebrow: 'Appendix 1 D3',
    title: 'Link call through coast station',
    prompt:
      'You need a link call through a coast station for public correspondence. Which channel/service family is relevant?',
    options: [
      { id: 'public-correspondence', label: 'Public correspondence coast-station channels/procedures' },
      { id: 'intership', label: 'Intership simplex channels only' },
      { id: 'distress-only', label: 'Distress/safety channels only' },
      { id: 'on-board', label: 'On-board channels only' },
    ],
    answer: 'public-correspondence',
    explanation:
      'Public correspondence is a distinct service in the syllabus and channel chart, typically coast-station mediated.',
    handbookRef: 'pp. 72, 77, 82-83',
  },
  {
    id: 'cp-small-craft-safety-67',
    topic: 'channels',
    eyebrow: 'Channel Selection Chart',
    title: 'UK small-craft safety context',
    prompt:
      'In UK context, which channel is flagged in the handbook chart for small-craft safety / HM Coastguard SAR work?',
    options: [
      { id: '67', label: 'Channel 67' },
      { id: '77', label: 'Channel 77' },
      { id: '80', label: 'Channel 80' },
      { id: '13', label: 'Channel 13' },
    ],
    answer: '67',
    explanation:
      'The Channel Selection Chart marks Channel 67 for UK small-craft safety / HMCG SAR context.',
    handbookRef: 'pp. 82-83',
  },
  {
    id: 'cp-pilot-port-station',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.2',
    title: 'Calling pilot/port service',
    prompt:
      'You require pilot boarding instructions. Which station/service type should drive your channel choice?',
    options: [
      { id: 'pilot-port', label: 'Pilot/port station service channel as published locally' },
      { id: 'yacht-chat', label: 'Any intership leisure channel' },
      { id: 'dsc-voice', label: 'Voice call on Channel 70' },
      { id: 'open-distress', label: 'Use distress channel permanently for pilot exchange' },
    ],
    answer: 'pilot-port',
    explanation:
      'Pilot and port stations are explicit station types in Appendix 1 and use designated operational channels.',
    handbookRef: 'pp. 72, 82-83',
  },
  {
    id: 'cp-on-board-comms',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.1',
    title: 'Crew coordination on the same vessel',
    prompt:
      'You are coordinating helm and bow crew on your own vessel while entering harbour. Which communication category is this?',
    options: [
      { id: 'on-board', label: 'On-board communications' },
      { id: 'public-correspondence', label: 'Public correspondence' },
      { id: 'distress-control', label: 'Distress traffic control' },
      { id: 'shore-bridge', label: 'Shore-to-ship distress relay' },
    ],
    answer: 'on-board',
    explanation:
      'On-board communications are listed separately in the syllabus communication types.',
    handbookRef: 'p. 72',
  },
  {
    id: 'cp-duplex-context',
    topic: 'channels',
    eyebrow: 'Appendix 1 A1.3',
    title: 'Two-frequency service context',
    prompt:
      'Which context in the channel chart is most likely to use paired ship/coast frequencies (duplex or semi-duplex)?',
    options: [
      { id: 'coast-service', label: 'Coast-station mediated services such as public correspondence' },
      { id: 'onboard-only', label: 'On-board crew chat' },
      { id: 'dsc-voice', label: 'Voice traffic on Channel 70' },
      { id: 'all-simplex', label: 'Every maritime service is always simplex only' },
    ],
    answer: 'coast-service',
    explanation:
      'Appendix coverage includes simplex/semi-duplex/duplex channel concepts and coast-service channel planning.',
    handbookRef: 'pp. 72-73, 82-83',
  },
  {
    id: 'cp-no-voice-on-70',
    topic: 'channels',
    eyebrow: 'Appendix 1 C3',
    title: 'Voice prohibition on DSC channel',
    prompt:
      'A crew member suggests shifting routine voice exchange to Channel 70 because "it sounds clearer". Correct response?',
    options: [
      { id: 'reject', label: 'Reject: Channel 70 is DSC alerting/calling only, no voice transmissions' },
      { id: 'accept', label: 'Accept: Channel 70 can be used for routine voice if brief' },
      { id: 'distress-only', label: 'Use 70 voice only for distress and urgency' },
      { id: 'night-rule', label: 'Use 70 voice only at night' },
    ],
    answer: 'reject',
    explanation:
      'Appendix C3 includes Channel 70 status/protection: it is a DSC channel, not a voice working channel.',
    handbookRef: 'pp. 61-66, 75, 82-83',
  },
  {
    id: 'cp-garbled-unknown-caller',
    topic: 'channels',
    eyebrow: 'Appendix 1 D3',
    title: 'Unknown station on calling channel',
    prompt:
      'You hear a weak call to your vessel on 16 but cannot identify the station. Best practice sequence?',
    options: [
      { id: 'identify-then-move', label: 'Use "Station calling", identify station, then move to suitable working channel' },
      { id: 'long-16', label: 'Conduct full troubleshooting dialogue on 16' },
      { id: 'switch-70', label: 'Move unknown caller to Channel 70 voice immediately' },
      { id: 'ignore', label: 'Ignore and continue routine on current channel' },
    ],
    answer: 'identify-then-move',
    explanation:
      'Calling-channel discipline plus unanswered/garbled-call procedure requires quick identification then transfer to working channel.',
    handbookRef: 'pp. 30-31, 77, 82-83',
  },
];

export const DSC_CONSOLE_DRILL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'dsc-console-watch-70',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.6',
    title: 'DSC watchkeeping baseline',
    prompt:
      'Which watchkeeping state is required for the DSC controller in normal operation?',
    options: [
      { id: 'watch-70', label: 'Continuous DSC watch on Channel 70' },
      { id: 'watch-16-only', label: 'Voice watch on 16 only; DSC watch can stay off' },
      { id: 'manual-scan', label: 'Manual scan of all channels replaces DSC watchkeeping' },
      { id: 'harbour-off', label: 'DSC watch should be turned off in harbour to avoid false alerts' },
    ],
    answer: 'watch-70',
    explanation:
      'Channel 70 status and DSC watchkeeping functions are explicit operational knowledge requirements.',
    handbookRef: 'pp. 74-75',
  },
  {
    id: 'dsc-console-alert-selector',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.6',
    title: 'Instant alert selector use',
    prompt:
      'In grave and imminent danger, which console action triggers the DSC distress alert?',
    options: [
      { id: 'distress-selector', label: 'Use the Channel 70 instant distress alert selector/button' },
      { id: 'routine-call-menu', label: 'Start a routine individual call menu first' },
      { id: 'voice-ptt', label: 'Hold PTT on Channel 70 and speak distress details' },
      { id: 'standby-only', label: 'Place set in standby and wait for coast station poll' },
    ],
    answer: 'distress-selector',
    explanation:
      'The syllabus explicitly lists Channel 70 instant alert selector and DSC distress alert transmission.',
    handbookRef: 'pp. 74, 61-68',
  },
  {
    id: 'dsc-console-gps-feed',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.6',
    title: 'Preferred position source for DSC',
    prompt:
      'What is the preferred way for the DSC controller to populate position/time data?',
    options: [
      { id: 'gps-auto', label: 'Automatic GPS input to the DSC set' },
      { id: 'memory-static', label: 'Keep one stored home-berth position as default' },
      { id: 'coast-fill', label: 'Leave fields blank so coast station fills them after alert' },
      { id: 'voice-only', label: 'Skip position entry because voice follow-up always covers it' },
    ],
    answer: 'gps-auto',
    explanation:
      'DSC operation expects position/time updating, ideally from interfaced GPS.',
    handbookRef: 'pp. 64-66, 74',
  },
  {
    id: 'dsc-console-manual-position',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.6 / C2',
    title: 'No GPS feed fallback',
    prompt:
      'Your GPS feed has failed but you must send DSC distress. Best console preparation?',
    options: [
      { id: 'manual-entry', label: 'Manually enter latest valid position/time before sending if possible' },
      { id: 'blank-alert', label: 'Always send with blank position regardless of available fixes' },
      { id: 'delay-alert', label: 'Do not send alert until GPS feed is restored' },
      { id: 'voice-first', label: 'Skip DSC and use voice only in all cases' },
    ],
    answer: 'manual-entry',
    explanation:
      'Where automatic feed is not available, manual entry of valid position/time supports effective DSC handling.',
    handbookRef: 'pp. 64-68, 74',
  },
  {
    id: 'dsc-console-individual-call',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.4',
    title: 'Preparing an individual DSC call',
    prompt:
      'Which item must be entered correctly when placing an individual DSC call?',
    options: [
      { id: 'target-mmsi', label: 'The target station MMSI' },
      { id: 'epirb-id', label: 'EPIRB hexadecimal identifier' },
      { id: 'aaic-code', label: 'AAIC charging code as call destination' },
      { id: 'vessel-draft', label: 'Current vessel draught in metres' },
    ],
    answer: 'target-mmsi',
    explanation:
      'Individual DSC calling depends on correct MMSI destination addressing.',
    handbookRef: 'pp. 73-74',
  },
  {
    id: 'dsc-console-all-ships',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.2',
    title: 'All ships call category',
    prompt:
      'When is DSC all-ships call type appropriate?',
    options: [
      { id: 'broadcast-category', label: 'When the category is intended as a broadcast to all stations in range' },
      { id: 'single-target', label: 'When calling one known vessel by MMSI' },
      { id: 'billing-link', label: 'When placing public correspondence billing calls only' },
      { id: 'harbour-chat', label: 'For routine marina berth chat by default' },
    ],
    answer: 'broadcast-category',
    explanation:
      'All-ships is a distinct DSC call type, separate from individual/geographic/group addressing.',
    handbookRef: 'pp. 73-74',
  },
  {
    id: 'dsc-console-geographic',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.2',
    title: 'Geographic area call setup',
    prompt:
      'What defines a DSC geographic area call on the console?',
    options: [
      { id: 'geo-area', label: 'A defined sea area/geographic selection rather than one MMSI' },
      { id: 'same-as-group', label: 'It is identical to group call list behaviour' },
      { id: 'voice-selector', label: 'It is a voice-only selector on Channel 16' },
      { id: 'distress-only', label: 'It can only be used for distress, never urgency/safety/routine' },
    ],
    answer: 'geo-area',
    explanation:
      'Geographic area call is a separate DSC addressing mode from individual and group calls.',
    handbookRef: 'pp. 73-74',
  },
  {
    id: 'dsc-console-group',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.2',
    title: 'Group call addressing',
    prompt:
      'What is the defining feature of a DSC group call?',
    options: [
      { id: 'predefined-group', label: 'It targets a predefined group identity rather than all ships or one station' },
      { id: 'all-vessels', label: 'It always means all ships in range' },
      { id: 'coast-only', label: 'It can only be sent to coast stations' },
      { id: 'pilot-default', label: 'It is only for pilot boarding messages' },
    ],
    answer: 'predefined-group',
    explanation:
      'The DSC call-type list includes Group call as a distinct class alongside Distress, All Ships, Individual and Geographic Area calls.',
    handbookRef: 'pp. 73-74',
  },
  {
    id: 'dsc-console-review-inbox',
    topic: 'dsc',
    eyebrow: 'Appendix 1 B2.6',
    title: 'Handling received DSC messages',
    prompt:
      'A DSC alert is received while multitasking. Which console behaviour best matches syllabus expectations?',
    options: [
      { id: 'review-log', label: 'Review received-message log/display and follow acknowledgement procedure correctly' },
      { id: 'ignore-log', label: 'Ignore the received message list and wait for voice only' },
      { id: 'clear-all', label: 'Delete all pending DSC messages immediately to reduce clutter' },
      { id: 'reboot-set', label: 'Restart the controller before reading incoming details' },
    ],
    answer: 'review-log',
    explanation:
      'Reviewing received messages and correct acknowledgement handling are explicit DSC operational skills.',
    handbookRef: 'pp. 74-75',
  },
  {
    id: 'dsc-console-test-protocol',
    topic: 'dsc',
    eyebrow: 'Appendix 1 C3',
    title: 'Testing without causing false distress',
    prompt:
      'How should DSC testing be performed to protect distress channels?',
    options: [
      { id: 'approved-test', label: 'Use approved DSC/radiotelephone test procedures and protocols' },
      { id: 'distress-test', label: 'Use live distress alert button briefly as the fastest test' },
      { id: 'voice-70-test', label: 'Use voice on Channel 70 to confirm DSC availability' },
      { id: 'random-time', label: 'Run ad-hoc tests on any channel with no protocol' },
    ],
    answer: 'approved-test',
    explanation:
      'C3 specifically includes test protocols, false-alert avoidance, and distress-frequency protection.',
    handbookRef: 'p. 75',
  },
  {
    id: 'dsc-console-false-alert-actions',
    topic: 'dsc',
    eyebrow: 'Appendix 1 C3',
    title: 'Accidental distress activation',
    prompt:
      'A DSC distress alert was sent accidentally. What is the correct immediate principle?',
    options: [
      { id: 'cancel-inform', label: 'Follow formal cancellation procedure and inform coast station/all stations as required' },
      { id: 'stay-silent', label: 'Stay silent and hope no one acts on the alert' },
      { id: 'power-cycle', label: 'Turn the set off and on; no further action needed' },
      { id: 'log-later', label: 'Do nothing now, document it later if asked' },
    ],
    answer: 'cancel-inform',
    explanation:
      'False distress alerts require immediate corrective procedure, not silence.',
    handbookRef: 'pp. 69-71, 75',
  },
  {
    id: 'dsc-console-distress-followup',
    topic: 'dsc',
    eyebrow: 'Appendix 1 C2 / D1',
    title: 'After DSC distress alert is sent',
    prompt:
      'What is the required communications step immediately after sending DSC distress alert?',
    options: [
      { id: 'voice-mayday', label: 'Transmit MAYDAY voice call/message on Channel 16 without delay' },
      { id: 'wait-ack', label: 'Wait silently for digital acknowledgement before any voice traffic' },
      { id: 'switch-working', label: 'Switch directly to marina working channel and explain situation' },
      { id: 'send-routine', label: 'Send routine DSC individual call first to nearest vessel' },
    ],
    answer: 'voice-mayday',
    explanation:
      'The DSC distress alert must be followed immediately by a MAYDAY voice transmission on 16.',
    handbookRef: 'pp. 67-68, 74, 76',
  },
  {
    id: 'dsc-console-unauthorised-prevention',
    topic: 'dsc',
    eyebrow: 'Appendix 1 C3',
    title: 'Preventing unauthorised transmissions',
    prompt:
      'Which operating discipline supports C3 prevention of unauthorised transmissions?',
    options: [
      { id: 'controlled-access', label: 'Keep radio operation under competent control and avoid casual console use by unqualified crew' },
      { id: 'open-access', label: 'Allow any crew to trigger DSC menus for practice underway' },
      { id: 'disable-watch', label: 'Disable watchkeeping to prevent accidental incoming traffic' },
      { id: 'mute-alarms', label: 'Mute DSC alarms permanently so no one is distracted' },
    ],
    answer: 'controlled-access',
    explanation:
      'C3 includes prevention of unauthorised transmissions and disciplined operation.',
    handbookRef: 'pp. 75, 77',
  },
  {
    id: 'dsc-console-relay-not-casualty',
    topic: 'dsc',
    eyebrow: 'Appendix 1 C2',
    title: 'Distress relay condition',
    prompt:
      'When is transmission of a distress alert/relay by a station not itself in distress justified?',
    options: [
      { id: 'assist-relay', label: 'When relaying distress for another casualty where assistance/communication support is required' },
      { id: 'routine-shortcut', label: 'Whenever routine contact on 16 is busy' },
      { id: 'weather-update', label: 'For normal weather updates to all nearby vessels' },
      { id: 'test-purpose', label: 'As a convenient method for equipment testing' },
    ],
    answer: 'assist-relay',
    explanation:
      'C2 includes distress-relay transmission for stations not themselves in distress only in justified emergency context.',
    handbookRef: 'pp. 68-71, 74',
  },
];

export const ALL_EXAM_QUESTIONS: ExamQuestion[] = Object.values(EXAM_QUESTIONS).flat();

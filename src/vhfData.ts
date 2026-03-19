export type VhfType = 'Routine' | 'Safety' | 'Urgency' | 'Distress';

export interface VhfScenario {
  id: string;
  type: VhfType;
  title: string;
  description: string;
  procedureTemplateId?: string;
  myVessel: {
    name: string;
    callsign: string;
    mmsi: string;
  };
  position?: string;
  problem?: string;
  assistance?: string;
  people?: number;
  otherVessel?: string; // For routine calls or relay
  correctSequence: string[];
}

export const VHF_SCENARIOS: VhfScenario[] = [
  {
    id: 'routine-marina',
    type: 'Routine',
    title: 'Calling a Marina',
    description: 'You are approaching Ocean Village Marina and want to ask for a visitor berth.',
    procedureTemplateId: 'routine-call',
    myVessel: { name: 'Seagull', callsign: 'MABC2', mmsi: '235000123' },
    otherVessel: 'Ocean Village Marina',
    correctSequence: [
      'Ocean Village Marina, Ocean Village Marina, Ocean Village Marina',
      'This is',
      'Seagull, Seagull, Seagull',
      'Call sign: Mike Alfa Bravo Charlie Two',
      'Do you have a visitor berth available for tonight?',
      'Over'
    ]
  },
  {
    id: 'routine-radio-check',
    type: 'Routine',
    title: 'Requesting A Radio Check',
    description: 'You want a nearby coast station or harbour station to comment on your signal strength and readability.',
    procedureTemplateId: 'routine-call',
    myVessel: { name: 'Seagull', callsign: 'MABC2', mmsi: '235000123' },
    otherVessel: 'Solent Coastguard',
    correctSequence: [
      'Solent Coastguard, Solent Coastguard, Solent Coastguard',
      'This is',
      'Seagull, Seagull, Seagull',
      'Call sign: Mike Alfa Bravo Charlie Two',
      'Radio check',
      'Over'
    ]
  },
  {
    id: 'routine-garbled-response',
    type: 'Routine',
    title: 'Responding To A Garbled Call',
    description: 'A station calls you but the message is unclear. You need to ask for repetition using standard vocabulary.',
    procedureTemplateId: 'routine-call',
    myVessel: { name: 'Seagull', callsign: 'MABC2', mmsi: '235000123' },
    correctSequence: [
      'Station calling Seagull, Station calling Seagull, Station calling Seagull',
      'This is',
      'Seagull, Seagull, Seagull',
      'Say again',
      'Over'
    ]
  },
  {
    id: 'urgency-engine',
    type: 'Urgency',
    title: 'Engine Failure',
    description: 'Your engine failed, and you cannot sail due to no wind. You are drifting towards a shipping lane but are not in immediate grave danger.',
    procedureTemplateId: 'urgency-template',
    myVessel: { name: 'Blue Pearl', callsign: '2BXC', mmsi: '235987654' },
    position: '50° 40.5\' N, 01° 12.3\' W',
    problem: 'Engine failure, no wind, drifting towards traffic',
    assistance: 'Require a tow',
    people: 4,
    correctSequence: [
      'Pan Pan, Pan Pan, Pan Pan',
      'All Stations, All Stations, All Stations',
      'This is',
      'Blue Pearl, Blue Pearl, Blue Pearl',
      'Call sign: Two Bravo X-ray Charlie',
      'MMSI: 235987654',
      'Position: 50 degrees 40.5 minutes North, 01 degrees 12.3 minutes West',
      'Engine failure, no wind, drifting towards traffic',
      'Require a tow',
      '4 persons on board',
      'Over'
    ]
  },
  {
    id: 'distress-sinking',
    type: 'Distress',
    title: 'Taking on Water',
    description: 'You hit a submerged rock. The hull is breached, pumps cannot keep up, and you are preparing to abandon ship.',
    procedureTemplateId: 'distress-template',
    myVessel: { name: 'Stormrider', callsign: 'MBDA9', mmsi: '235111222' },
    position: '48° 10.2\' N, 04° 05.8\' W',
    problem: 'Struck submerged rock, taking on water, preparing to abandon ship',
    assistance: 'Require immediate assistance',
    people: 6,
    correctSequence: [
      'Mayday, Mayday, Mayday',
      'This is',
      'Stormrider, Stormrider, Stormrider',
      'Call sign: Mike Bravo Delta Alfa Nine',
      'MMSI: 235111222',
      'Mayday',
      'Stormrider',
      'Position: 48 degrees 10.2 minutes North, 04 degrees 05.8 minutes West',
      'Struck submerged rock, taking on water, preparing to abandon ship',
      'Require immediate assistance',
      '6 persons on board',
      'Deploying life raft',
      'Over'
    ]
  },
  {
    id: 'distress-acknowledgement',
    type: 'Distress',
    title: 'Acknowledging A Mayday',
    description: 'You are Brixham Coastguard acknowledging a distress call from Princess Ida and taking control of the incident.',
    procedureTemplateId: 'distress-acknowledgement',
    myVessel: { name: 'Brixham Coastguard', callsign: 'Brixham Coastguard', mmsi: '002320011' },
    otherVessel: 'Princess Ida',
    correctSequence: [
      'Mayday',
      'Princess Ida',
      'This is',
      'Brixham Coastguard, Brixham Coastguard, Brixham Coastguard',
      'Received Mayday',
      'Stand by',
      'Over'
    ]
  },
  {
    id: 'distress-mayday-relay',
    type: 'Distress',
    title: 'Mayday Relay',
    description: 'You hear a weak distress situation from another yacht and need to relay it because effective assistance is required.',
    procedureTemplateId: 'mayday-relay-template',
    myVessel: { name: 'Seagull', callsign: 'MABC2', mmsi: '235000123' },
    otherVessel: 'Ocean Dawn',
    position: '49° 22.0\' N, 002° 15.0\' W',
    problem: 'Engine room fire, crew preparing life raft',
    assistance: 'Require immediate assistance',
    people: 5,
    correctSequence: [
      'Mayday Relay, Mayday Relay, Mayday Relay',
      'All Stations, All Stations, All Stations',
      'This is',
      'Seagull, Seagull, Seagull',
      'Call sign: Mike Alfa Bravo Charlie Two',
      'Mayday',
      'Ocean Dawn',
      'Position: 49 degrees 22.0 minutes North, 002 degrees 15.0 minutes West',
      'Engine room fire, crew preparing life raft',
      'Require immediate assistance',
      '5 persons on board',
      'Over'
    ]
  },
  {
    id: 'safety-debris',
    type: 'Safety',
    title: 'Floating Container',
    description: 'You spotted a half-submerged shipping container creating a hazard to navigation.',
    procedureTemplateId: 'safety-template',
    myVessel: { name: 'Wanderer', callsign: 'MWND1', mmsi: '235444555' },
    position: '10 miles south of Needles point',
    problem: 'Large floating shipping container, hazard to navigation',
    correctSequence: [
      'Securite, Securite, Securite',
      'All Stations, All Stations, All Stations',
      'This is',
      'Wanderer, Wanderer, Wanderer',
      'Call sign: Mike Whiskey November Delta One',
      'MMSI: 235444555',
      'Hazard to navigation',
      'Position: 10 miles south of Needles point',
      'Large floating shipping container, dangerous to surface vessels',
      'Out'
    ]
  },
  {
    id: 'routine-public-correspondence',
    type: 'Routine',
    title: 'Calling Coast Station For Public Correspondence',
    description: 'You need a public correspondence link call through a coast station and must start with correct routine radiotelephony format.',
    procedureTemplateId: 'routine-call',
    myVessel: { name: 'Harbour Light', callsign: 'MEGH5', mmsi: '235222334' },
    otherVessel: 'Portland Coast Radio',
    correctSequence: [
      'Portland Coast Radio, Portland Coast Radio, Portland Coast Radio',
      'This is',
      'Harbour Light, Harbour Light, Harbour Light',
      'Call sign: Mike Echo Golf Hotel Five',
      'Request public correspondence link call',
      'Over'
    ]
  },
  {
    id: 'urgency-medical-advice',
    type: 'Urgency',
    title: 'Urgent Medical Advice',
    description: 'A crew member has severe symptoms. Vessel is not in immediate distress but urgent medical advice is needed from the Coastguard.',
    procedureTemplateId: 'urgency-template',
    myVessel: { name: 'Northwind', callsign: 'MNDW7', mmsi: '235771009' },
    otherVessel: 'Solent Coastguard',
    position: '50° 36.4\' N, 001° 18.1\' W',
    problem: 'Crew member with severe abdominal pain and vomiting',
    assistance: 'Require urgent medical advice',
    people: 3,
    correctSequence: [
      'Pan Pan, Pan Pan, Pan Pan',
      'Solent Coastguard, Solent Coastguard, Solent Coastguard',
      'This is',
      'Northwind, Northwind, Northwind',
      'Call sign: Mike November Delta Whiskey Seven',
      'MMSI: 235771009',
      'Position: 50 degrees 36.4 minutes North, 001 degrees 18.1 minutes West',
      'Crew member with severe abdominal pain and vomiting',
      'Require urgent medical advice',
      '3 persons on board',
      'Over'
    ]
  },
  {
    id: 'safety-weather-warning',
    type: 'Safety',
    title: 'Local Weather Hazard Broadcast',
    description: 'You observe dangerous squall activity and poor visibility in a busy small-craft area and need to issue a safety warning.',
    procedureTemplateId: 'safety-template',
    myVessel: { name: 'Tide Runner', callsign: 'MTRN4', mmsi: '235410602' },
    position: 'West Solent between Hurst Point and Yarmouth',
    problem: 'Severe squalls and visibility less than one cable',
    correctSequence: [
      'Securite, Securite, Securite',
      'All Stations, All Stations, All Stations',
      'This is',
      'Tide Runner, Tide Runner, Tide Runner',
      'Call sign: Mike Tango Romeo November Four',
      'MMSI: 235410602',
      'Strong squalls and very poor visibility in West Solent',
      'Area: between Hurst Point and Yarmouth',
      'Further safety information on channel 67',
      'Out'
    ]
  },
  {
    id: 'distress-seelonce-control',
    type: 'Distress',
    title: 'Controlling Distress Traffic',
    description: 'As Coastguard, you need to impose silence while handling an active Mayday incident.',
    myVessel: { name: 'Solent Coastguard', callsign: 'Solent Coastguard', mmsi: '002320012' },
    otherVessel: 'All Stations',
    correctSequence: [
      'Mayday',
      'All Stations, All Stations, All Stations',
      'This is',
      'Solent Coastguard, Solent Coastguard, Solent Coastguard',
      'Seelonce Mayday, Seelonce Mayday, Seelonce Mayday',
      'Distress traffic in progress for yacht Aurora on Channel 16',
      'Out'
    ]
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

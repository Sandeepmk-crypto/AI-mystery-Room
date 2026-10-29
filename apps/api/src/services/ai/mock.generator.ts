import { CaseManifest, CaseSettings } from "@ai-mystery-room/shared";

export function generateMockCaseManifest(scenario: string, settings: CaseSettings): CaseManifest {
  // Generate a rich, internally consistent, solvable mystery
  const incidentDate = "2026-10-18";
  const incidentTime = "21:45";
  const incidentLocation = "The Blackwood Estate — Private Gallery & Study";

  return {
    case: {
      title: "The Midnight Sovereign Heist & Poisoning",
      incident: {
        summary: `During an elite private gala at ${incidentLocation}, Lord Alistair Vance collapsed from digitalis toxicity while the priceless 'Midnight Sovereign' blue diamond vanished from its locked display pedestal. A 20-minute power surge blinded main security cameras.`,
        date: incidentDate,
        time: incidentTime,
        location: incidentLocation,
      },
    },
    suspects: [
      {
        id: "suspect_01",
        name: "Arthur Pendelton",
        age: 48,
        occupation: "Head of Estate Security & Ex-Locksmith",
        relationshipToIncident: "Responsible for surveillance systems and the gallery safe lockbox",
        background: "Decorated ex-safecracker turned private security specialist. Deeply in debt due to offshore trading losses.",
        alibi: "Claims he was rebooting the circuit breakers in the basement sub-level during the entire 20-minute outage (21:35 - 21:55).",
        possibleMotive: "Urgent debt settlement; possessed the master override keys to the display case.",
      },
      {
        id: "suspect_02",
        name: "Dr. Evelyn Sterling",
        age: 39,
        occupation: "Personal Physician & Biochemist",
        relationshipToIncident: "Attending physician and longtime confidante of Lord Vance",
        background: "World-class toxicologist. Recently discovered Lord Vance was cutting funding for her independent research institute.",
        alibi: "Claims she was on the garden terrace taking a private phone call with her hospital board from 21:30 until 22:00.",
        possibleMotive: "Professional ruined career if funding was pulled; had direct access to digitalis medication.",
      },
      {
        id: "suspect_03",
        name: "Julian Mercer",
        age: 31,
        occupation: "Estranged Nephew & Art Appraiser",
        relationshipToIncident: "Sole heir under the original will before Vance announced an amendment favoring charity",
        background: "Known for extravagant lifestyle and high-stakes poker debts across Macau and London.",
        alibi: "Claims he was drinking scotch in the library with guest witness Clara Dupont until the lights flickered.",
        possibleMotive: "Impending disinheritance; wanted both the inheritance and the diamond to auction abroad.",
      },
      {
        id: "suspect_04",
        name: "Clara Dupont",
        age: 34,
        occupation: "Auction House Curator",
        relationshipToIncident: "Cataloged the Midnight Sovereign for the upcoming auction",
        background: "Renowned gemologist with spotless credentials, though known to have had an intense dispute with Julian Mercer.",
        alibi: "Confirms being in the library reading catalogs, but stepped out to the powder room around 21:40.",
        possibleMotive: "Fascination with rare jewels and desire to recover a family heirloom Vance had purchased.",
      },
    ],
    evidence: [
      {
        id: "evidence_01",
        type: "chat",
        title: "WhatsApp Chat: Security Channel",
        description: "Encrypted instant messaging exchange between Head of Security Arthur Pendelton and the gate guards.",
        source: "Subpoenaed Mobile Phone Logs (Arthur Pendelton)",
        timestamp: "2026-10-18T21:32:00",
        relatedSuspectIds: ["suspect_01"],
        clues: [
          {
            id: "clue_01",
            description: "Arthur texted 'Breaker tripped on purpose for routine test, ignore alarm panel' at 21:36, proving premeditated shutdown.",
            importance: "critical",
          },
        ],
        content: {
          participants: [
            { suspectId: "suspect_01", displayName: "Arthur Pendelton (Security Chief)" },
            { displayName: "Officer Briggs (Front Gate)" },
          ],
          messages: [
            {
              id: "msg_01",
              senderId: "suspect_01",
              senderName: "Arthur Pendelton",
              text: "Briggs, I'm going to initiate the breaker reset at 21:35 for circuit maintenance. Do not log the panel warning.",
              timestamp: "21:32",
            },
            {
              id: "msg_02",
              senderId: "guard_01",
              senderName: "Officer Briggs",
              text: "Copy that Chief. Shouldn't we inform Lord Vance during the gala?",
              timestamp: "21:33",
            },
            {
              id: "msg_03",
              senderId: "suspect_01",
              senderName: "Arthur Pendelton",
              text: "Negative. Keep it quiet. I will personally oversee the gallery sector.",
              timestamp: "21:34",
              isKeyClue: true,
            },
          ],
        },
      },
      {
        id: "evidence_02",
        type: "cctv",
        title: "Auxiliary CCTV Log — North Gallery Corridor",
        description: "Backup battery-powered camera feed overlooking the private corridor leading into the display vault.",
        source: "Auxiliary Security DVR Server",
        timestamp: "2026-10-18T21:42:00",
        relatedSuspectIds: ["suspect_01", "suspect_02"],
        clues: [
          {
            id: "clue_02",
            description: "At 21:43, a figure matching Arthur Pendelton's height and tactical security boots entered the vault with a keycard.",
            importance: "critical",
          },
          {
            id: "clue_03",
            description: "Dr. Evelyn Sterling was seen walking towards the terrace garden in the background, corroborating her terrace alibi.",
            importance: "minor",
          },
        ],
        content: {
          cameraName: "CAM-04 (Gallery North Hallway)",
          location: "North Wing 2nd Floor",
          timeRange: "21:35 - 21:55",
          sceneDescription: "Dim emergency halogen illumination. Motion detector logged a single entry into the vault.",
          blindSpotsOrGaps: "Vault interior has no backup power; only corridor entry was captured.",
          quality: "720p Monochromatic Night-Vision",
          events: [
            {
              time: "21:35:10",
              description: "Main chandelier lights cut out. Emergency amber LEDs illuminate hallway.",
            },
            {
              time: "21:39:45",
              description: "Dr. Evelyn Sterling enters garden terrace glass doors holding a phone to her ear.",
              suspiciousFactor: "None (corroborates alibi)",
            },
            {
              time: "21:43:18",
              description: "Heavy figure in tactical combat boots and estate security master badge swipes into the diamond vault.",
              suspiciousFactor: "Direct vault infiltration during blackout",
            },
            {
              time: "21:47:05",
              description: "Figure exits vault carrying a small padded velvet pouch, heading toward the staff service staircase.",
              suspiciousFactor: "Possession of display case pouch",
            },
          ],
          stillFrameUrl: "/assets/cctv_sample.svg",
        },
      },
      {
        id: "evidence_03",
        type: "forensic_report",
        title: "Toxicology & Forensics Report — Digitalis & Residue",
        description: "Official chemical analysis of the victim's brandy snifter and vault fingerprints.",
        source: "County Forensic Science Laboratory",
        timestamp: "2026-10-19T08:30:00",
        relatedSuspectIds: ["suspect_01", "suspect_02"],
        clues: [
          {
            id: "clue_04",
            description: "The digitalis was introduced through a coated rim of Lord Vance's glass. Microscopic traces of industrial graphite lock lubricant were found on the goblet stem.",
            importance: "critical",
          },
        ],
        content: {
          labName: "Forensic Toxicology Unit 4",
          examiner: "Senior Pathologist Dr. Raymond Cross",
          sampleAnalyzed: "Crystal brandy snifter, glass pedestal shards, vault door keypad swab",
          findings: [
            "Lethal dose of Foxglove (Digitalis purpurea) extract identified on the rim of the crystal glass.",
            "Vault lock mechanism was bypassed using an authentic physical key rather than forced entry.",
            "Trace analysis detected High-Velocity Locksmith Graphite Lubricant on both the goblet and the lock barrel.",
            "No prints from Julian Mercer or Dr. Evelyn Sterling on the glass or safe.",
          ],
          conclusion: "The poisoner handled both the lock picking/maintenance kit and the victim's glass shortly before serving.",
        },
      },
      {
        id: "evidence_04",
        type: "document",
        title: "Estate Staff Duty Register & Tool Locker Audit",
        description: "Internal log of equipment checked out by estate staff on the night of the gala.",
        source: "Estate Operations Ledger",
        timestamp: "2026-10-18T20:00:00",
        relatedSuspectIds: ["suspect_01"],
        clues: [
          {
            id: "clue_05",
            description: "Arthur Pendelton checked out Master Key #01 and Locksmith Maintenance Kit 'Alpha' at 20:15.",
            importance: "important",
          },
        ],
        content: {
          documentType: "Staff Equipment Log",
          officialHeader: "BLACKWOOD ESTATE FACILITY MANAGEMENT — DAILY AUDIT",
          bodyText: "All personnel must log access to high-security zones and specialized mechanical tools. At 20:15, Arthur Pendelton signed out Locksmith Kit Alpha (containing graphite lubricants, tension picks, and vault override key). At 20:30, Arthur volunteered to serve Lord Vance his private vintage Armagnac.",
          signaturesOrMarks: ["Signed: A. Pendelton", "Countersigned: Ops Supervisor M. Gable"],
          metadata: {
            "Item Checked Out": "Kit Alpha & Vault Override Key",
            "Checkout Time": "20:15",
            "Return Status": "Unreturned at time of police seizure",
          },
        },
      },
      {
        id: "evidence_05",
        type: "witness_statement",
        title: "Interview Statement: Clara Dupont (Auction Curator)",
        description: "Recorded statement taken by investigating detectives in the library parlor.",
        source: "Detective Interview Recording 104",
        timestamp: "2026-10-18T23:15:00",
        relatedSuspectIds: ["suspect_03", "suspect_04"],
        clues: [
          {
            id: "clue_06",
            description: "Clara confirms Julian Mercer never left her sight in the library until 21:50, establishing Julian's alibi during the theft.",
            importance: "important",
          },
        ],
        content: {
          witnessName: "Clara Dupont",
          interviewer: "Lead Detective Marcus Kane",
          statementDate: "2026-10-18",
          transcript: "Julian Mercer was certainly arrogant and obnoxious, but he was seated across from me in the library from 21:15 straight through until nearly 21:50 debating the auction reserve price. When the lights went out, Julian lit a match and spilled his scotch on the rug. He never went near the gallery vault. However, I did see Mr. Pendelton carrying a silver tray with Lord Vance's drink earlier around 21:00.",
          demeanor: "Calm, cooperative, precise in timekeeping.",
        },
      },
      {
        id: "evidence_06",
        type: "image",
        title: "Crime Scene Photo: Vault Pedestal & Locker",
        description: "Detailed photograph of the opened display pedestal and discarded service glove.",
        source: "Forensic Imaging Unit",
        timestamp: "2026-10-18T22:20:00",
        relatedSuspectIds: ["suspect_01"],
        clues: [
          {
            id: "clue_07",
            description: "A black tactical Kevlar glove with the monogram 'A.P.' was dropped beside the safe pedestal.",
            importance: "critical",
          },
        ],
        content: {
          imageTitle: "Display Pedestal Safe & Discarded Glove",
          caption: "High resolution forensic shot of the opened glass vitrine and dropped glove under UV spectrum illumination.",
          annotations: [
            { area: "Lower Left Floor", note: "Kevlar tactical glove bearing initials 'A.P.' and traces of graphite dust." },
            { area: "Display Cylinder", note: "Padded velvet mount empty; no glass breakage, opened cleanly via master key." },
          ],
          imageUrl: "/assets/crime_scene_pedestal.svg",
          photographerOrSource: "Crime Scene Specialist T. Henderson",
        },
      },
      {
        id: "evidence_07",
        type: "timeline",
        title: "Reconstructed Incident Timeline",
        description: "Synthesized chronological timeline compiled by the investigating task force.",
        source: "Task Force Operational Board",
        timestamp: "2026-10-19T02:00:00",
        relatedSuspectIds: ["suspect_01", "suspect_02", "suspect_03", "suspect_04"],
        clues: [
          {
            id: "clue_08",
            description: "Arthur Pendelton's claim of being in the electrical basement during 21:35-21:55 is completely refuted by CAM-04 timestamp 21:43.",
            importance: "critical",
          },
        ],
        content: {
          events: [
            { time: "20:15", event: "Arthur Pendelton checks out Locksmith Kit Alpha and vault override key.", source: "Logbook", confirmed: true },
            { time: "21:00", event: "Arthur delivers poisoned Armagnac to Lord Vance's study desk.", source: "Witness Dupont", confirmed: true },
            { time: "21:35", event: "Circuit breaker manually tripped by Arthur's scheduled command.", source: "WhatsApp Chat", confirmed: true },
            { time: "21:43", event: "Figure matching Arthur penetrates gallery vault on CAM-04.", source: "Aux CCTV", confirmed: true },
            { time: "21:45", event: "Lord Vance suffers fatal cardiac seizure from digitalis.", source: "Coroner Report", confirmed: true },
            { time: "21:47", event: "Thief flees with Midnight Sovereign diamond in velvet pouch.", source: "Aux CCTV", confirmed: true },
            { time: "21:55", event: "Emergency power restored; safe discovered empty and Vance collapsed.", source: "Police Dispatch", confirmed: true },
          ],
        },
      },
    ],
    solution: {
      culpritId: "suspect_01", // Arthur Pendelton
      motive: "Crushing black-market gambling debts and facing imminent termination by Lord Vance.",
      method: "Coated the rim of Lord Vance's private drink with concentrated digitalis obtained from estate botanical gardens, then deliberately triggered the power blackout at 21:35 to raid the vault using his master lockbox key and escape during the chaos.",
      timeline: [
        { time: "20:15", event: "Arthur retrieved the master key and maintenance kit containing graphite lubricant." },
        { time: "21:00", event: "Arthur served the laced Armagnac to Lord Vance, transferring graphite particles onto the glass." },
        { time: "21:35", event: "Arthur initiated the deliberate blackout, pretending it was a breaker glitch." },
        { time: "21:43", event: "Arthur entered the vault, unlocked the pedestal, took the diamond, and dropped his monogrammed glove in haste." },
        { time: "21:47", event: "Arthur slipped out through the service stairwell before power resumed." },
      ],
      explanation: "Head of Security Arthur Pendelton executed the crime. His alibi of being trapped in the electrical substation is dismantled by CCTV CAM-04 showing him entering the vault at 21:43, the encrypted WhatsApp texts ordering gate guards to ignore the blackout alarm, the forensic match of locksmith graphite on both the safe lock and poisoned goblet, and his monogrammed tactical glove left at the pedestal.",
      decisiveEvidenceIds: ["evidence_01", "evidence_02", "evidence_03", "evidence_06"],
      redHerringExplanations: [
        "Dr. Evelyn Sterling had access to digitalis, but auxiliary CCTV definitively proved she remained outside on the garden terrace on a phone call throughout the critical window.",
        "Julian Mercer had financial motive and a ruined inheritance, but witness Clara Dupont confirmed he stayed seated in the library playing cards and drinking scotch with her throughout the blackout.",
      ],
    },
  };
}

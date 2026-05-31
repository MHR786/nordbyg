import {
  Cpu,
  Leaf,
  Truck,
  Wrench,
  Box,
  Building2,
  ShieldCheck,
  PenTool,
} from "lucide-react";

export const expoStats = [
  { labelKey: "home.statExhibitors", value: 350, suffix: "+" },
  { labelKey: "home.statVisitors", value: 12000, suffix: "+" },
  { labelKey: "home.statSpeakers", value: 80, suffix: "+" },
  { labelKey: "home.statDays", value: 3, suffix: "" },
  { labelKey: "home.statHallSpace", value: 25000, suffix: "" },
];

export const focusAreas = [
  { icon: Cpu, titleKey: "data.focus1Title", descKey: "data.focus1Desc" },
  { icon: Leaf, titleKey: "data.focus2Title", descKey: "data.focus2Desc" },
  { icon: Truck, titleKey: "data.focus3Title", descKey: "data.focus3Desc" },
  { icon: Wrench, titleKey: "data.focus4Title", descKey: "data.focus4Desc" },
  { icon: Box, titleKey: "data.focus5Title", descKey: "data.focus5Desc" },
  { icon: Building2, titleKey: "data.focus6Title", descKey: "data.focus6Desc" },
  { icon: ShieldCheck, titleKey: "data.focus7Title", descKey: "data.focus7Desc" },
  { icon: PenTool, titleKey: "data.focus8Title", descKey: "data.focus8Desc" },
];

// Exhibitor names, halls, countries are proper nouns / labels, left untranslated.
// Blurbs are kept in English (industry-standard descriptions); could be translated later if desired.
export const exhibitors = [
  { name: "Rockwool", category: "Insulation", country: "Denmark", hall: "Hall A · A12", blurb: "Stone wool insulation pioneer headquartered in Hedehusene, supplying Danish builders since 1937 with non-combustible thermal and acoustic solutions." },
  { name: "Velux", category: "Windows & Daylight", country: "Denmark", hall: "Hall A · A24", blurb: "Roof windows, modular skylights and active daylight design from the Hørsholm-based group, on display with the new triple-glazed FUTURA range." },
  { name: "FLSmidth", category: "Heavy Machinery", country: "Denmark", hall: "Hall D · D08", blurb: "Cement and minerals technology with a focus on the MissionZero programme — sustainable cement production for the Nordic construction sector." },
  { name: "NCC", category: "Contractor", country: "Sweden", hall: "Hall C · C03", blurb: "One of Scandinavia's largest construction and property development companies, presenting its NCC Folkboligen affordable housing platform." },
  { name: "MT Højgaard", category: "Contractor", country: "Denmark", hall: "Hall C · C11", blurb: "Danish construction giant exhibiting its digital construction stack and the latest in industrialised concrete element production." },
  { name: "Lindab", category: "Ventilation & Steel", country: "Sweden", hall: "Hall B · B07", blurb: "Steel profiles, ventilation systems and indoor climate solutions for commercial and residential construction across the Nordics." },
  { name: "Saint-Gobain Weber", category: "Mortar & Facade", country: "France/DK", hall: "Hall A · A18", blurb: "Mortars, facade systems and tile adhesives — Weber's Danish division previewing low-carbon mortar formulations for BR23 compliance." },
  { name: "Icopal", category: "Roofing", country: "Denmark", hall: "Hall A · A30", blurb: "Bitumen roofing membranes, green roofs and waterproofing systems — a 175-year-old Danish brand with new solar-integrated membranes." },
  { name: "H+H Danmark", category: "Aerated Concrete", country: "Denmark", hall: "Hall B · B22", blurb: "Aircrete blocks and prefab wall elements — H+H showcases its Multiplate system for fast residential construction." },
  { name: "Junckers", category: "Hardwood Flooring", country: "Denmark", hall: "Hall A · A06", blurb: "Solid hardwood floors crafted in Køge since 1930 — Junckers presents the Nordic Nature Collection with FSC-certified Danish beech." },
  { name: "Cembrit", category: "Fiber Cement", country: "Denmark", hall: "Hall B · B14", blurb: "Fiber cement facade panels and roofing slates — engineered for Nordic weather and on display in 18 new texture finishes." },
  { name: "Danfoss", category: "Heating & Controls", country: "Denmark", hall: "Hall D · D02", blurb: "District heating components, intelligent radiator thermostats and decarbonised heating solutions from Sønderborg." },
];

export const speakers = [
  {
    name: "Mads Holmberg",
    title: "Chief BIM Strategist, COWI",
    bioKey: "data.spkr1Bio",
    talkKey: "data.spkr1Talk",
    dayKey: "data.spkr1Day",
    trackKey: "data.spkr1Track",
  },
  {
    name: "Sofie Lindqvist",
    title: "Head of Sustainability, MT Højgaard",
    bioKey: "data.spkr2Bio",
    talkKey: "data.spkr2Talk",
    dayKey: "data.spkr2Day",
    trackKey: "data.spkr2Track",
  },
  {
    name: "Henrik Bach Mortensen",
    title: "Director, Dansk Byggeri (DI Byg)",
    bioKey: "data.spkr3Bio",
    talkKey: "data.spkr3Talk",
    dayKey: "data.spkr3Day",
    trackKey: "data.spkr3Track",
  },
  {
    name: "Anna Krogh-Jensen",
    title: "Founding Partner, BIG Engineering",
    bioKey: "data.spkr4Bio",
    talkKey: "data.spkr4Talk",
    dayKey: "data.spkr4Day",
    trackKey: "data.spkr4Track",
  },
];

// Programme keyed by day translation keys
export const programmeDays = [
  "programme.day1Full",
  "programme.day2Full",
  "programme.day3Full",
] as const;

export type ProgrammeDayKey = (typeof programmeDays)[number];

// Session content remains in English (speaker names, talk titles are industry-standard).
// Time/room/track/etc. are mostly proper nouns.
export const fullProgramme: Record<ProgrammeDayKey, Array<{
  time: string;
  title: string;
  speaker: string;
  room: string;
  track: string;
}>> = {
  "programme.day1Full": [
    { time: "09:00–09:45", title: "Opening Keynote: The Digital Twin Revolution in Danish Infrastructure", speaker: "Mads Holmberg, COWI", room: "Main Stage", track: "Digital" },
    { time: "10:00–10:45", title: "openBIM in Practice — Lessons from the Femern Tunnel Project", speaker: "Lars Jensen, Femern A/S", room: "Hall C Theatre", track: "Digital" },
    { time: "11:00–11:45", title: "AI for Construction Schedule Optimisation", speaker: "Dr. Pernille Madsen, DTU", room: "Innovation Lab", track: "Digital" },
    { time: "12:30–13:15", title: "BR23 Energy Frame: Practical Compliance Workshop", speaker: "Marianne Søndergaard, Bolig- og Planstyrelsen", room: "Hall B Theatre", track: "Policy" },
    { time: "13:30–14:15", title: "Cross-Laminated Timber at Scale — The Faaborg Case Study", speaker: "Erik Lindgren, Stora Enso", room: "Main Stage", track: "Sustainability" },
    { time: "14:30–15:15", title: "From LCA to Build: Closing the Embodied Carbon Loop", speaker: "Sofie Lindqvist, MT Højgaard", room: "Hall C Theatre", track: "Sustainability" },
    { time: "15:30–16:15", title: "Live Demo: Electric Compact Excavators on Urban Sites", speaker: "Volvo CE Demo Team", room: "Outdoor Demo Yard", track: "Machinery" },
    { time: "16:30–17:15", title: "Closing Panel — Day 1: What Will Define Danish Building in 2030?", speaker: "Industry Panel", room: "Main Stage", track: "Industry" },
  ],
  "programme.day2Full": [
    { time: "09:30–10:15", title: "Policy & Productivity: The Next Decade of Danish Building", speaker: "Henrik Bach Mortensen, DI Byg", room: "Main Stage", track: "Policy" },
    { time: "10:30–11:15", title: "Modular Housing — Solving the København Shortage", speaker: "Birgitte Holm, NCC Folkboligen", room: "Hall B Theatre", track: "Modular" },
    { time: "11:30–12:15", title: "Adaptive Facades for the Nordic Climate", speaker: "Jakob Eriksen, Henning Larsen", room: "Hall C Theatre", track: "Architecture" },
    { time: "13:00–13:45", title: "Hands-On: Calibrating Laser-Guided Site Layout Tools", speaker: "Hilti Workshop Team", room: "Hall B Workshop Zone", track: "Tools" },
    { time: "14:00–14:45", title: "Prefab Bathrooms — From Pod to Project", speaker: "Lars Petersen, Probad", room: "Innovation Lab", track: "Modular" },
    { time: "15:00–15:45", title: "Site Safety & Mental Health on Danish Building Sites", speaker: "Anne Mette Larsen, BAR Bygge & Anlæg", room: "Hall A Theatre", track: "Safety" },
    { time: "16:00–16:45", title: "Architecture as Infrastructure", speaker: "Anna Krogh-Jensen, BIG Engineering", room: "Main Stage", track: "Architecture" },
    { time: "17:00–18:00", title: "NordByg Networking Reception (open bar, sponsored by Velux)", speaker: "All visitors welcome", room: "Hall A Lounge", track: "Networking" },
  ],
  "programme.day3Full": [
    { time: "09:00–09:45", title: "Decarbonising Cement: The MissionZero Programme", speaker: "Bjarne Moltke Hansen, FLSmidth", room: "Main Stage", track: "Sustainability" },
    { time: "10:00–10:45", title: "District Heating 5.0 — Low Temperature Networks", speaker: "Karen Nyborg, Danfoss", room: "Hall D Theatre", track: "Energy" },
    { time: "11:00–11:45", title: "Hands-On: Cordless Power Tools Comparison", speaker: "Bosch & DeWalt Demo Teams", room: "Hall B Workshop Zone", track: "Tools" },
    { time: "12:30–13:15", title: "Insurance, Liability & the Danish Construction Defects Database", speaker: "Tryg Erhverv Panel", room: "Hall A Theatre", track: "Policy" },
    { time: "13:30–14:15", title: "Daylight by Design — VELUX Active Daylight Programme", speaker: "Lone Feifer, Velux", room: "Hall C Theatre", track: "Architecture" },
    { time: "14:30–15:15", title: "Robotics on the Construction Site — Reality Check", speaker: "Niels Brock, Aarhus University", room: "Innovation Lab", track: "Digital" },
    { time: "15:30–16:30", title: "Closing Keynote & NordByg Awards 2026 Ceremony", speaker: "Hosted by NordByg Expo Board", room: "Main Stage", track: "Industry" },
  ],
};

export const testimonials = [
  {
    quoteKey: "data.testi1Quote",
    name: "Kasper Riis",
    roleKey: "data.testi1Role",
  },
  {
    quoteKey: "data.testi2Quote",
    name: "Maria Fonseca",
    roleKey: "data.testi2Role",
  },
  {
    quoteKey: "data.testi3Quote",
    name: "Anders Pløger",
    roleKey: "data.testi3Role",
  },
];

export const faqs = [
  { qKey: "data.faq1Q", aKey: "data.faq1A" },
  { qKey: "data.faq2Q", aKey: "data.faq2A" },
  { qKey: "data.faq3Q", aKey: "data.faq3A" },
  { qKey: "data.faq4Q", aKey: "data.faq4A" },
  { qKey: "data.faq5Q", aKey: "data.faq5A" },
  { qKey: "data.faq6Q", aKey: "data.faq6A" },
];

export const sponsors = {
  platinum: ["Velux", "Rockwool", "MT Højgaard"],
  gold: ["NCC", "Saint-Gobain Weber", "Lindab", "Danfoss"],
  silver: ["Cembrit", "Junckers", "Icopal", "H+H Danmark", "FLSmidth", "Hilti"],
};

export const hotels = [
  {
    name: "AC Hotel Bella Sky Copenhagen",
    rating: "4★",
    distanceKey: "data.hotel1Distance",
    priceKey: "data.hotel1Price",
    descKey: "data.hotel1Desc",
  },
  {
    name: "Tivoli Hotel",
    rating: "4★",
    distanceKey: "data.hotel2Distance",
    priceKey: "data.hotel2Price",
    descKey: "data.hotel2Desc",
  },
  {
    name: "Crowne Plaza Copenhagen Towers",
    rating: "4★",
    distanceKey: "data.hotel3Distance",
    priceKey: "data.hotel3Price",
    descKey: "data.hotel3Desc",
  },
];

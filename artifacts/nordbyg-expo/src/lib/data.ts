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
  { label: "Exhibitors", value: 350, suffix: "+" },
  { label: "Trade Visitors", value: 12000, suffix: "+" },
  { label: "Speakers", value: 80, suffix: "+" },
  { label: "Days", value: 3, suffix: "" },
  { label: "m² Hall Space", value: 25000, suffix: "" },
];

export const focusAreas = [
  {
    icon: Cpu,
    title: "BIM & Digital Construction",
    desc: "Building Information Modelling, digital twins, AI-driven project management and IoT-enabled construction sites — see how Nordic firms are leading the global digital construction shift.",
  },
  {
    icon: Leaf,
    title: "Sustainable Building Materials",
    desc: "Cross-laminated timber, low-carbon concrete, recycled steel, biobased insulation — meet the suppliers cutting embodied carbon to meet Denmark's 2030 climate targets.",
  },
  {
    icon: Truck,
    title: "Heavy Machinery & Equipment",
    desc: "Compact electric excavators, autonomous wheel loaders, telehandlers and tower cranes from leading Scandinavian and European OEMs — live demonstrations all three days.",
  },
  {
    icon: Wrench,
    title: "Tools & Craftsmen Equipment",
    desc: "From cordless impact drivers to laser-guided measuring systems, NordByg gathers every tool a Danish håndværker needs — with hands-on testing zones in Hall B.",
  },
  {
    icon: Box,
    title: "Prefab & Modular Construction",
    desc: "Volumetric modular housing, panelised facades, off-site manufacturing — explore how prefab is solving Denmark's housing shortage with quality and speed.",
  },
  {
    icon: Building2,
    title: "Smart Buildings & Facade Tech",
    desc: "Adaptive facades, intelligent HVAC, building management platforms and energy-positive envelopes designed for the Nordic climate.",
  },
  {
    icon: ShieldCheck,
    title: "Safety, Compliance & Standards",
    desc: "Site safety equipment, regulatory updates from Arbejdstilsynet, EU CPR compliance and the new Danish Building Regulations BR23 in practice.",
  },
  {
    icon: PenTool,
    title: "Architecture & Urban Design",
    desc: "Studio showcases, parametric design tools, daylighting analysis and the work of the next generation of Danish architects shaping Copenhagen and beyond.",
  },
];

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
    bio: "Pioneered the digital twin programme for the Storstrøm Bridge and now leads COWI's openBIM standardisation work across Northern Europe.",
    talk: "The Digital Twin Revolution in Danish Infrastructure",
    day: "Day 1 · 09:00",
    track: "Digital Construction",
  },
  {
    name: "Sofie Lindqvist",
    title: "Head of Sustainability, MT Højgaard",
    bio: "Leads carbon accounting and circular construction strategy for one of Denmark's largest contractors, with 15 years in low-carbon concrete research.",
    talk: "From LCA to Build: Closing the Embodied Carbon Loop",
    day: "Day 1 · 14:30",
    track: "Sustainability",
  },
  {
    name: "Henrik Bach Mortensen",
    title: "Director, Dansk Byggeri (DI Byg)",
    bio: "Industry advocate representing 6,000 Danish construction companies. Former state secretary at the Ministry of Climate and Energy.",
    talk: "Policy & Productivity: The Next Decade of Danish Building",
    day: "Day 2 · 09:30",
    track: "Industry & Policy",
  },
  {
    name: "Anna Krogh-Jensen",
    title: "Founding Partner, BIG Engineering",
    bio: "Architect-engineer hybrid working at the intersection of parametric design and structural innovation. Lead designer on the CopenHill recycling plant.",
    talk: "Architecture as Infrastructure",
    day: "Day 2 · 16:00",
    track: "Architecture",
  },
];

export const fullProgramme = {
  "Day 1 — Tuesday 15 June": [
    { time: "09:00–09:45", title: "Opening Keynote: The Digital Twin Revolution in Danish Infrastructure", speaker: "Mads Holmberg, COWI", room: "Main Stage", track: "Digital" },
    { time: "10:00–10:45", title: "openBIM in Practice — Lessons from the Femern Tunnel Project", speaker: "Lars Jensen, Femern A/S", room: "Hall C Theatre", track: "Digital" },
    { time: "11:00–11:45", title: "AI for Construction Schedule Optimisation", speaker: "Dr. Pernille Madsen, DTU", room: "Innovation Lab", track: "Digital" },
    { time: "12:30–13:15", title: "BR23 Energy Frame: Practical Compliance Workshop", speaker: "Marianne Søndergaard, Bolig- og Planstyrelsen", room: "Hall B Theatre", track: "Policy" },
    { time: "13:30–14:15", title: "Cross-Laminated Timber at Scale — The Faaborg Case Study", speaker: "Erik Lindgren, Stora Enso", room: "Main Stage", track: "Sustainability" },
    { time: "14:30–15:15", title: "From LCA to Build: Closing the Embodied Carbon Loop", speaker: "Sofie Lindqvist, MT Højgaard", room: "Hall C Theatre", track: "Sustainability" },
    { time: "15:30–16:15", title: "Live Demo: Electric Compact Excavators on Urban Sites", speaker: "Volvo CE Demo Team", room: "Outdoor Demo Yard", track: "Machinery" },
    { time: "16:30–17:15", title: "Closing Panel — Day 1: What Will Define Danish Building in 2030?", speaker: "Industry Panel", room: "Main Stage", track: "Industry" },
  ],
  "Day 2 — Wednesday 16 June": [
    { time: "09:30–10:15", title: "Policy & Productivity: The Next Decade of Danish Building", speaker: "Henrik Bach Mortensen, DI Byg", room: "Main Stage", track: "Policy" },
    { time: "10:30–11:15", title: "Modular Housing — Solving the København Shortage", speaker: "Birgitte Holm, NCC Folkboligen", room: "Hall B Theatre", track: "Modular" },
    { time: "11:30–12:15", title: "Adaptive Facades for the Nordic Climate", speaker: "Jakob Eriksen, Henning Larsen", room: "Hall C Theatre", track: "Architecture" },
    { time: "13:00–13:45", title: "Hands-On: Calibrating Laser-Guided Site Layout Tools", speaker: "Hilti Workshop Team", room: "Hall B Workshop Zone", track: "Tools" },
    { time: "14:00–14:45", title: "Prefab Bathrooms — From Pod to Project", speaker: "Lars Petersen, Probad", room: "Innovation Lab", track: "Modular" },
    { time: "15:00–15:45", title: "Site Safety & Mental Health on Danish Building Sites", speaker: "Anne Mette Larsen, BAR Bygge & Anlæg", room: "Hall A Theatre", track: "Safety" },
    { time: "16:00–16:45", title: "Architecture as Infrastructure", speaker: "Anna Krogh-Jensen, BIG Engineering", room: "Main Stage", track: "Architecture" },
    { time: "17:00–18:00", title: "NordByg Networking Reception (open bar, sponsored by Velux)", speaker: "All visitors welcome", room: "Hall A Lounge", track: "Networking" },
  ],
  "Day 3 — Thursday 17 June": [
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
    quote: "NordByg is the one trade fair we genuinely block out the calendar for. The quality of conversations on the floor — with material suppliers, with peer contractors, with regulators — is unmatched in Northern Europe.",
    name: "Kasper Riis",
    role: "Construction Director, MT Højgaard",
  },
  {
    quote: "We closed three significant supply contracts within 48 hours of exhibiting. The ROI on a NordByg stand simply isn't comparable to any other Nordic event.",
    name: "Maria Fonseca",
    role: "Sales Director DACH/Nordics, Saint-Gobain",
  },
  {
    quote: "It's the only place where you'll find a kommune building inspector, a CLT factory owner and a parametric architect having coffee at the same table. That's why I bring my whole studio.",
    name: "Anders Pløger",
    role: "Founding Partner, Pløger Arkitekter",
  },
];

export const faqs = [
  {
    q: "Who can attend NordByg Expo 2026?",
    a: "NordByg is a B2B trade event open to construction professionals: contractors, architects, engineers, building craftsmen (håndværkere), property developers, facility managers, kommune representatives, students of construction-related programmes, and accredited press. A valid trade ticket or industry credential is required at entry.",
  },
  {
    q: "Where is NordByg Expo held?",
    a: "All three days take place at Bella Center Copenhagen, Center Boulevard 5, 2300 København S — Scandinavia's largest exhibition venue, located 7 km from Copenhagen Airport (CPH) and directly served by the Bella Center Metro station on the M1 line.",
  },
  {
    q: "How do I become an exhibitor?",
    a: "Submit the registration form on the Register page. Our exhibitor team reviews every application within 3 business days to confirm relevance to the construction sector before issuing a stand contract and invoice. Stands range from 9 m² shell-scheme to 72+ m² space-only configurations.",
  },
  {
    q: "Are visitor tickets free?",
    a: "A 1-day trade pass is 245 DKK, a 3-day pass is 545 DKK, and student tickets are 95 DKK with valid ID. Members of Dansk Byggeri (DI Byg), Konstruktørforeningen and Akademisk Arkitektforening (AOB) attend free with their membership number.",
  },
  {
    q: "Will the conference programme be in English or Danish?",
    a: "Roughly 60% of sessions are delivered in Danish and 40% in English. All keynote talks on the Main Stage are simultaneously interpreted DA↔EN and headsets are available free at the Information Desk.",
  },
  {
    q: "Is there parking at Bella Center?",
    a: "Yes — Bella Center offers 1,200 parking spaces in the underground garage at 35 DKK/hour or 175 DKK/day. Pre-booking is strongly recommended. There are also 24 EV charging points (CCS/Type 2) and dedicated bike parking.",
  },
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
    distance: "Adjacent to Bella Center · 0 min walk",
    price: "from 1,495 DKK / night",
    desc: "Scandinavia's largest design hotel, connected directly to Bella Center via a sky bridge. NordByg attendee rate available.",
  },
  {
    name: "Tivoli Hotel",
    rating: "4★",
    distance: "Vesterbro · 12 min by Metro",
    price: "from 1,295 DKK / night",
    desc: "Modern 4-star hotel near Tivoli Gardens and Copenhagen Central Station, with direct Metro line M3/M1 access to Bella Center.",
  },
  {
    name: "Crowne Plaza Copenhagen Towers",
    rating: "4★",
    distance: "Ørestad · 8 min by Metro",
    price: "from 1,395 DKK / night",
    desc: "Sustainable LEED Platinum-certified hotel, two Metro stops from Bella Center, with rooftop solar panels and groundwater cooling.",
  },
];

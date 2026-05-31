import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Download,
  Quote,
  ChevronRight,
  Star,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroScene, FloorPlanScene } from "@/components/three-scene";
import { WebGLBoundary } from "@/components/webgl-boundary";
import { Counter } from "@/components/counter";
import {
  expoStats,
  focusAreas,
  exhibitors,
  speakers,
  testimonials,
  faqs,
  sponsors,
} from "@/lib/data";
import heroExpo from "@/assets/images/hero-expo.png";
import bellaCenter from "@/assets/images/bella-center.png";
import bimScreens from "@/assets/images/bim-screens.png";
import conferenceStage from "@/assets/images/conference-stage.png";
import copenhagenCranes from "@/assets/images/copenhagen-cranes.png";
import archModel from "@/assets/images/arch-model.png";
import boothNetworking from "@/assets/images/booth-networking.png";
import craftsman from "@/assets/images/craftsman.png";
import prefab from "@/assets/images/prefab.png";
import timber from "@/assets/images/timber-construction.png";

function downloadBrochure(lang: string) {
  const isDanish = lang.startsWith("da");
  const text = isDanish
    ? `NORDBYG EXPO 2026 — DANMARKS BYGGE- OG ANLÆGSMESSE
================================================================

Datoer:    6. — 8. juli 2026
Sted:      Bella Center København, Center Boulevard 5, 2300 København S
Tider:     Mandag — Onsdag  09:00 — 18:00

OM NORDBYG
-------------
NordByg Expo samler hele det danske og nordiske byggeøkosystem
under ét tag: 350+ udstillere, 12.000+ fagbesøgende, 80+ talere
og 25.000 m² dedikeret udstillingsareal.

FOKUSOMRÅDER
-----------
• BIM og digitalt byggeri
• Bæredygtige byggematerialer
• Tunge maskiner og udstyr
• Værktøj og håndværkerudstyr
• Præfab og modulbyggeri
• Smarte bygninger og facadeteknologi
• Sikkerhed, compliance og standarder
• Arkitektur og urbant design

UDSTILLERPRISER (vejledende)
------------------------------
9 m²  shell-scheme    fra   12.400 DKK
18 m² shell-scheme    fra   23.800 DKK
36 m² space-only      fra   42.500 DKK
72 m² space-only      fra   78.000 DKK

BESØGSBILLETTER
---------------
1-dages fagpas        245 DKK
3-dages fagpas        545 DKK
Studerende (med ID)    95 DKK
DI Byg / AOB-medlemmer  gratis

KONTAKT
-------
NordByg Expo Sekretariat
E-mail:  info@nordexpo.dk

Tilmeld i dag på nordexpo.dk/register
`
    : `NORDBYG EXPO 2026 — DENMARK'S CONSTRUCTION & BUILDING TRADE SHOW
================================================================

Dates:    6 — 8 July 2026
Venue:    Bella Center Copenhagen, Center Boulevard 5, 2300 København S
Hours:    Monday — Wednesday  09:00 — 18:00

ABOUT NORDBYG
-------------
NordByg Expo brings together the entire Danish and Nordic construction
ecosystem under one roof: 350+ exhibitors, 12,000+ trade visitors,
80+ speakers and 25,000 m² of dedicated exhibition space.

FOCUS AREAS
-----------
• BIM & Digital Construction
• Sustainable Building Materials
• Heavy Machinery & Equipment
• Tools & Craftsmen Equipment
• Prefab & Modular Construction
• Smart Buildings & Facade Technology
• Safety, Compliance & Standards
• Architecture & Urban Design

EXHIBITOR PRICING (indicative)
------------------------------
9 m²  shell-scheme    from   12,400 DKK
18 m² shell-scheme    from   23,800 DKK
36 m² space-only      from   42,500 DKK
72 m² space-only      from   78,000 DKK

VISITOR TICKETS
---------------
1-day trade pass      245 DKK
3-day trade pass      545 DKK
Student (with ID)      95 DKK
DI Byg / AOB members  free

CONTACT
-------
NordByg Expo Sekretariat
Email:  info@nordexpo.dk

Register today at nordexpo.dk/register
`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = isDanish
    ? "nordbyg-expo-2026-brochure-da.txt"
    : "nordbyg-expo-2026-brochure.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}

function FadeIn({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <Layout>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-24"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={heroExpo}
            alt="Futuristic Danish construction expo hall at dusk"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.18),transparent_55%)]" />
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <WebGLBoundary fallback={null}>
            <HeroScene />
          </WebGLBoundary>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-6 relative z-10"
        >
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                {t("home.statusOpen")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
            >
              {t("home.heroTitle1")}<br />
              <span className="text-primary">{t("home.heroTitle2")}</span><br />
              <span className="text-muted-foreground/80">{t("home.heroTitle3")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl"
            >
              {t("home.heroSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t("home.registration")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2 text-foreground/80">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">{t("home.dates")}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {t("home.venue")}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </section>

      {/* STATS STRIP */}
      <Section className="border-y border-border bg-card/50 py-14!">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {expoStats.map((s, i) => (
            <FadeIn key={s.labelKey} delay={i * 0.06}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mt-2">
                  {t(s.labelKey)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ABOUT */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-border">
              <img
                src={copenhagenCranes}
                alt="Construction cranes against the Copenhagen skyline"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                {t("home.aboutEyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("home.aboutTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-5 leading-relaxed">
                {t("home.aboutPara1")}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("home.aboutPara2")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    {t("home.readStory")} <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => downloadBrochure(i18n.language)}
                  className="text-foreground hover:text-primary"
                >
                  <Download className="mr-2 w-4 h-4" /> {t("home.downloadBrochure")}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* FOCUS AREAS */}
      <Section className="bg-card/30 border-y border-border">
        <FadeIn>
          <div className="max-w-3xl mb-16">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              {t("home.focusEyebrow")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t("home.focusTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.focusDesc")}
            </p>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {focusAreas.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.titleKey} delay={(i % 4) * 0.05}>
                <Card className="h-full p-6 bg-background hover:border-primary/40 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 leading-tight">
                    {t(f.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(f.descKey)}
                  </p>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* EXHIBITORS */}
      <Section>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                {t("home.exhibitorsEyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {t("home.exhibitorsTitle")}
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link href="/exhibitors">
              <Button variant="outline" size="lg">
                {t("home.seeDirectory")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {exhibitors.map((e, i) => (
            <FadeIn key={e.name} delay={(i % 6) * 0.04} y={20}>
              <div className="aspect-3/2 border border-border bg-card flex items-center justify-center px-3 hover-elevate rounded-lg transition-all group">
                <span className="font-bold text-base md:text-lg tracking-tight text-foreground/80 group-hover:text-primary text-center">
                  {e.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <FadeIn delay={0.05}>
            <div className="rounded-xl overflow-hidden border border-border aspect-4/3">
              <img src={boothNetworking} alt="Visitors networking at exhibition booth" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-xl overflow-hidden border border-border aspect-4/3">
              <img src={bimScreens} alt="BIM models on exhibition screens" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-xl overflow-hidden border border-border aspect-4/3">
              <img src={craftsman} alt="Danish craftsman at work" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* PROGRAMME / SPEAKERS */}
      <Section className="bg-card/30 border-y border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeIn className="lg:col-span-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                {t("home.programmeEyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("home.programmeTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("home.programmeDesc")}
              </p>
              <Link href="/programme">
                <Button size="lg">
                  {t("home.seeProgramme")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <div className="mt-10 rounded-xl overflow-hidden border border-border aspect-video">
                <img src={conferenceStage} alt="Conference stage at NordByg" className="w-full h-full object-cover" />
              </div>
            </div>
          </FadeIn>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
            {speakers.map((sp, i) => (
              <FadeIn key={sp.name} delay={i * 0.08}>
                <Card className="p-6 h-full bg-background flex flex-col">
                  <div className="text-xs uppercase tracking-widest text-primary font-medium mb-3">
                    {t(sp.dayKey)} · {t(sp.trackKey)}
                  </div>
                  <h3 className="text-xl font-semibold leading-tight mb-2">
                    {t(sp.talkKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                    {t(sp.bioKey)}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <div className="font-semibold">{sp.name}</div>
                    <div className="text-sm text-muted-foreground">{sp.title}</div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* VENUE / 3D FLOOR PLAN */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                {t("home.venueEyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("home.venueTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-5 leading-relaxed">
                {t("home.venueDesc")}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { h: t("home.hallA"), l: t("home.hallALabel") },
                  { h: t("home.hallB"), l: t("home.hallBLabel") },
                  { h: t("home.hallC"), l: t("home.hallCLabel") },
                  { h: t("home.hallD"), l: t("home.hallDLabel") },
                ].map((x) => (
                  <div key={x.h} className="p-4 rounded-lg border border-border bg-card">
                    <div className="font-semibold text-primary">{x.h}</div>
                    <div className="text-sm text-muted-foreground">{x.l}</div>
                  </div>
                ))}
              </div>
              <Link href="/visit">
                <Button size="lg" variant="outline">
                  {t("home.planVisit")} <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-5">
              <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-card relative">
                <WebGLBoundary
                  fallback={
                    <img
                      src={bellaCenter}
                      alt="Bella Center floor plan reference"
                      className="w-full h-full object-cover"
                    />
                  }
                >
                  <FloorPlanScene />
                </WebGLBoundary>
                <div className="absolute bottom-3 left-4 text-xs uppercase tracking-widest text-muted-foreground bg-background/60 backdrop-blur px-3 py-1 rounded-full">
                  {t("home.floorPlanCaption")}
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-border aspect-video">
                <img src={bellaCenter} alt="Bella Center exterior" className="w-full h-full object-cover" />
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-card/30 border-y border-border">
        <FadeIn>
          <div className="max-w-3xl mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              {t("home.testimonialsEyebrow")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t("home.testimonialsTitle")}
            </h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((tt, i) => (
            <FadeIn key={tt.name} delay={i * 0.1}>
              <Card className="p-8 h-full bg-background flex flex-col">
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-lg leading-relaxed mb-6 flex-1">
                  {t(tt.quoteKey)}
                </p>
                <div className="pt-5 border-t border-border">
                  <div className="font-semibold">{tt.name}</div>
                  <div className="text-sm text-muted-foreground">{t(tt.roleKey)}</div>
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* SUSTAINABILITY / IMAGES */}
      <Section>
        <div className="grid md:grid-cols-3 gap-5">
          <FadeIn className="md:col-span-2">
            <div className="aspect-16/10 rounded-2xl overflow-hidden border border-border relative group">
              <img src={timber} alt="Cross-laminated timber construction" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <div className="text-xs uppercase tracking-widest text-primary mb-2">{t("home.sustainabilityHall")}</div>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight max-w-md">{t("home.sustainabilityTitle")}</h3>
              </div>
            </div>
          </FadeIn>
          <div className="grid grid-rows-2 gap-5">
            <FadeIn delay={0.1}>
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-border relative group">
                <img src={prefab} alt="Prefab modular construction" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <div className="text-xs uppercase tracking-widest text-primary mb-1">{t("home.modular")}</div>
                  <h4 className="text-lg font-semibold leading-tight">{t("home.modularTitle")}</h4>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-border relative group">
                <img src={archModel} alt="Architectural model" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <div className="text-xs uppercase tracking-widest text-primary mb-1">{t("home.architecture")}</div>
                  <h4 className="text-lg font-semibold leading-tight">{t("home.architectureTitle")}</h4>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* SPONSORS */}
      <Section className="bg-card/30 border-y border-border py-16!">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
            {t("home.sponsorsTitle")}
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div className="text-center mb-3 text-xs text-primary font-medium uppercase tracking-widest">
            {t("home.sponsorsPlatinum")}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 mb-8">
            {sponsors.platinum.map((n) => (
              <span key={n} className="text-2xl md:text-3xl font-bold text-foreground/80 hover:text-primary transition-colors">
                {n}
              </span>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="text-center mb-3 text-xs text-primary/70 font-medium uppercase tracking-widest">
            {t("home.sponsorsGold")}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 mb-6">
            {sponsors.gold.map((n) => (
              <span key={n} className="text-lg md:text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                {n}
              </span>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {sponsors.silver.map((n) => (
              <span key={n} className="text-sm md:text-base font-medium text-muted-foreground/70 hover:text-primary transition-colors">
                {n}
              </span>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeIn className="lg:col-span-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                {t("home.faqEyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("home.faqTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t("home.faqCantFind")}{" "}
                <a href="mailto:info@nordexpo.dk" className="text-primary hover:underline">
                  info@nordexpo.dk
                </a>
                .
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-8">
            <div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-border">
                    <AccordionTrigger className="text-left text-lg font-medium hover:text-primary py-5">
                      {t(f.qKey)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                      {t(f.aKey)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="py-32! relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0">
          <img src={heroExpo} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              {t("home.ctaTitle1")} <span className="text-primary">{t("home.ctaTitle2")}</span>.
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t("home.ctaDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-base">
                  {t("home.registerExhibitor")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="mailto:info@nordexpo.dk?subject=Stand%20enquiry%20—%20NordByg%202026">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base">
                  {t("home.talkToTeam")}
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </Section>
    </Layout>
  );
}

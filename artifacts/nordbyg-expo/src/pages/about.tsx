import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Users, Newspaper, Send } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const board = [
  { name: "Mette Lindholm", role: "Chair · Former CEO, MT Højgaard" },
  { name: "Jens Aage Toft", role: "Director, MCH Group" },
  { name: "Karin Dyhr", role: "Secretary General, DI Byg" },
  { name: "Per Skovgaard", role: "Architect MAA, Henning Larsen" },
];

const milestones = [
  { y: "2014", t: "First edition of NordByg held with 92 exhibitors at Bella Center." },
  { y: "2017", t: "Conference programme launched; first BIM-dedicated track introduced." },
  { y: "2020", t: "Hybrid digital edition during the pandemic — 8,000 online participants." },
  { y: "2023", t: "Crossed 250 exhibitors and 10,000 visitors for the first time." },
  { y: "2026", t: "11th edition: 350+ exhibitors, 12,000+ visitors, 25,000 m² of show floor." },
];

export default function About() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast({
        title: "Message sent",
        description: "Thank you. Our team will reply within 1 business day.",
      });
    }, 600);
  };

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-16"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              About NordByg Expo
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Twelve years of building the Danish construction conversation.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              NordByg Expo was founded in 2014 by a coalition of MCH Group and
              Dansk Byggeri (DI Byg) with one mission: create a single annual
              meeting place where every part of the Danish construction value
              chain — from material producers to site craftsmen, architects to
              kommune inspectors — can do business face to face.
            </p>
          </motion.div>

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-5 mb-20">
            {[
              {
                t: "Industry-led",
                d: "Owned and steered by the Danish construction industry, not by media or PR conglomerates. Every exhibitor decision is reviewed by a working group of contractors, architects and suppliers.",
              },
              {
                t: "Locally rooted",
                d: "Held annually at Bella Center Copenhagen — Scandinavia's largest exhibition campus. We are a Danish event built for Danish buildings, opened to Nordic and European partners.",
              },
              {
                t: "Climate-aligned",
                d: "Aligned with the Danish 2030 climate targets. We measure NordByg's own footprint, source local catering, run a carpet-free show floor and offset residual emissions through verified Nordic woodland projects.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-7 h-full bg-card">
                  <h3 className="text-xl font-semibold mb-3 text-primary">{c.t}</h3>
                  <p className="text-muted-foreground leading-relaxed">{c.d}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">Our story</h2>
            <div className="relative pl-8 border-l-2 border-primary/30 space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.y}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-[2.35rem] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="font-mono text-primary text-lg font-semibold">{m.y}</div>
                  <p className="text-muted-foreground mt-1 max-w-xl">{m.t}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Board */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Advisory board</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {board.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="p-6 bg-card text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-primary font-semibold text-lg">
                        {b.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{b.role}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <Card className="p-8 md:p-12 bg-card mb-20 border-primary/30">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <Leaf className="w-12 h-12 text-primary" />
              </div>
              <div className="md:col-span-9">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Sustainability commitments</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>· 100% renewable electricity supplied to the show floor by Ørsted.</li>
                  <li>· Carpet-free show floor since 2022 — saving an estimated 40 tonnes of single-use textile annually.</li>
                  <li>· All exhibitor catering sourced within 100 km of Copenhagen, with 60%+ plant-based menu by default.</li>
                  <li>· Verified offsetting of residual emissions through Nordic woodland restoration projects in Sjælland and Småland.</li>
                  <li>· Free cycle parking and discounted public-transport passes for all visitors and staff.</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Press */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">As featured in</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 opacity-70">
              {["Berlingske Business", "Børsen", "Building Supply DK", "Licitationen", "Politiken", "Arkitekten Magasinet", "Ingeniøren"].map(n => (
                <span key={n} className="text-lg md:text-xl font-semibold">{n}</span>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get in touch</h2>
              <p className="text-muted-foreground mb-6">
                Press enquiries, partnership proposals, speaker submissions —
                send us a message and our team will respond within one
                business day.
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-widest">Press</div>
                  <a href="mailto:press@nordbygexpo.dk" className="text-primary hover:underline">press@nordbygexpo.dk</a>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-widest">Exhibitors</div>
                  <a href="mailto:exhibitors@nordbygexpo.dk" className="text-primary hover:underline">exhibitors@nordbygexpo.dk</a>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-widest">General</div>
                  <a href="mailto:info@nordbygexpo.dk" className="text-primary hover:underline">info@nordbygexpo.dk</a>
                </div>
              </div>
            </div>
            <Card className="p-6 md:p-8 bg-card">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="cn" className="mb-2 block">Your name</Label>
                  <Input id="cn" required />
                </div>
                <div>
                  <Label htmlFor="ce" className="mb-2 block">Email</Label>
                  <Input id="ce" type="email" required />
                </div>
                <div>
                  <Label htmlFor="cm" className="mb-2 block">Message</Label>
                  <Textarea id="cm" rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={sending}>
                  <Send className="mr-2 w-4 h-4" />
                  {sending ? "Sending..." : "Send message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

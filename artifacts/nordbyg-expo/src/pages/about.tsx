import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Users, Newspaper, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function About() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const board = [
    { name: "Mette Lindholm", role: t("about.boardChair") },
    { name: "Jens Aage Toft", role: t("about.boardDirector") },
    { name: "Karin Dyhr", role: t("about.boardSec") },
    { name: "Per Skovgaard", role: t("about.boardArch") },
  ];

  const milestones = [
    { y: "2014", t: t("about.m2014") },
    { y: "2017", t: t("about.m2017") },
    { y: "2020", t: t("about.m2020") },
    { y: "2023", t: t("about.m2023") },
    { y: "2026", t: t("about.m2026") },
  ];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast({
        title: t("about.sent"),
        description: t("about.sentDesc"),
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
              {t("about.eyebrow")}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t("about.title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.intro")}
            </p>
          </motion.div>

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-5 mb-20">
            {[
              { t: t("about.m1Title"), d: t("about.m1Desc") },
              { t: t("about.m2Title"), d: t("about.m2Desc") },
              { t: t("about.m3Title"), d: t("about.m3Desc") },
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{t("about.ourStory")}</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("about.boardTitle")}</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <Leaf className="w-12 h-12 text-primary" />
              </div>
              <div className="md:col-span-9">
                <h2 className="text-3xl font-bold tracking-tight mb-4">{t("about.sustainTitle")}</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>{t("about.sustain1")}</li>
                  <li>{t("about.sustain2")}</li>
                  <li>{t("about.sustain3")}</li>
                  <li>{t("about.sustain4")}</li>
                  <li>{t("about.sustain5")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Press */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("about.pressTitle")}</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("about.contactTitle")}</h2>
              <p className="text-muted-foreground mb-6">
                {t("about.contactDesc")}
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-widest">{t("about.email")}</div>
                  <a href="mailto:info@nordexpo.dk" className="text-primary hover:underline">info@nordexpo.dk</a>
                </div>
              </div>
            </div>
            <Card className="p-6 md:p-8 bg-card">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="cn" className="mb-2 block">{t("about.yourName")}</Label>
                  <Input id="cn" required />
                </div>
                <div>
                  <Label htmlFor="ce" className="mb-2 block">{t("about.emailLabel")}</Label>
                  <Input id="ce" type="email" required />
                </div>
                <div>
                  <Label htmlFor="cm" className="mb-2 block">{t("about.message")}</Label>
                  <Textarea id="cm" rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={sending}>
                  <Send className="mr-2 w-4 h-4" />
                  {sending ? t("about.sending") : t("about.sendMessage")}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Clock,
  MapPin,
  Train,
  Plane,
  Car,
  Bike,
  Hotel,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hotels } from "@/lib/data";

export default function Visit() {
  const { t } = useTranslation();

  const tickets = [
    { name: t("visit.ticketADay"), price: "245 DKK", desc: t("visit.ticketADayDesc") },
    { name: t("visit.ticket3Day"), price: "545 DKK", desc: t("visit.ticket3DayDesc") },
    { name: t("visit.ticketStudent"), price: "95 DKK", desc: t("visit.ticketStudentDesc") },
    { name: t("visit.ticketMember"), price: t("visit.ticketFree"), desc: t("visit.ticketMemberDesc") },
  ];

  const transport = [
    { icon: Train, title: t("visit.metroTitle"), desc: t("visit.metroDesc") },
    { icon: Plane, title: t("visit.planeTitle"), desc: t("visit.planeDesc") },
    { icon: Car, title: t("visit.carTitle"), desc: t("visit.carDesc") },
    { icon: Bike, title: t("visit.bikeTitle"), desc: t("visit.bikeDesc") },
  ];

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-14"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              {t("visit.eyebrow")}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              {t("visit.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("visit.intro")}
            </p>
          </motion.div>

          {/* When & Where */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <Card className="p-8 bg-card">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{t("visit.openingHours")}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex justify-between">
                  <span>{t("visit.day1")}</span>
                  <span className="font-medium text-foreground">09:00 — 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("visit.day2")}</span>
                  <span className="font-medium text-foreground">09:00 — 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("visit.day3")}</span>
                  <span className="font-medium text-foreground">09:00 — 17:00</span>
                </li>
              </ul>
            </Card>
            <Card className="p-8 bg-card">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{t("visit.venueAddress")}</h2>
              <p className="text-muted-foreground mb-4">
                Bella Center Copenhagen<br />
                Center Boulevard 5<br />
                2300 København S<br />
                Denmark
              </p>
              <a
                href="https://www.google.com/maps?q=Bella+Center+Copenhagen"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm">
                  {t("visit.openMaps")} <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </a>
            </Card>
          </div>

          {/* Map */}
          <div className="mb-16 rounded-2xl overflow-hidden border border-border aspect-[16/7]">
            <iframe
              title="Bella Center Copenhagen map"
              src="https://maps.google.com/maps?q=Bella%20Center%20Copenhagen&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Transport */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{t("visit.gettingHere")}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {transport.map((tr, i) => {
                const Icon = tr.icon;
                return (
                  <motion.div
                    key={tr.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="p-6 bg-card h-full">
                      <Icon className="w-7 h-7 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">{tr.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tr.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tickets */}
          <div className="mb-16">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("visit.ticketsTitle")}</h2>
                <p className="text-muted-foreground mt-2">{t("visit.ticketsSub")}</p>
              </div>
              <Link href="/register">
                <Button variant="outline">
                  {t("visit.registration")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tickets.map((tk, i) => (
                <motion.div
                  key={tk.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="p-6 h-full flex flex-col bg-card hover:border-primary/40 transition-colors">
                    <Ticket className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{tk.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-3">{tk.price}</div>
                    <p className="text-sm text-muted-foreground mb-5 flex-1">{tk.desc}</p>
                    <a href="mailto:info@nordexpo.dk?subject=Ticket%20enquiry">
                      <Button variant="outline" size="sm" className="w-full">
                        {t("visit.reserve")}
                      </Button>
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("visit.hotelsTitle")}</h2>
              <p className="text-muted-foreground mt-2">{t("visit.hotelsSub")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {hotels.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="p-6 bg-card h-full">
                    <Hotel className="w-6 h-6 text-primary mb-3" />
                    <div className="text-xs text-primary mb-1">{h.rating}</div>
                    <h3 className="text-lg font-semibold mb-1">{h.name}</h3>
                    <div className="text-sm text-muted-foreground mb-4">{t(h.distanceKey)}</div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{t(h.descKey)}</p>
                    <div className="font-semibold text-primary">{t(h.priceKey)}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

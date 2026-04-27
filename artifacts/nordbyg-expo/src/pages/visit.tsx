import { motion } from "framer-motion";
import { Link } from "wouter";
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

const tickets = [
  { name: "1-day Trade Pass", price: "245 DKK", desc: "Full access to all halls and conference sessions for one day." },
  { name: "3-day Trade Pass", price: "545 DKK", desc: "Full access to all halls and conference sessions for all three days. Best value." },
  { name: "Student Pass", price: "95 DKK", desc: "Full 3-day access for students with valid ID. Open to construction-related programmes." },
  { name: "DI Byg / AOB Members", price: "Free", desc: "Free 3-day access for members of Dansk Byggeri or Akademisk Arkitektforening." },
];

const transport = [
  {
    icon: Train,
    title: "Metro M1",
    desc: "Bella Center station is on the M1 line, direct from Copenhagen Central Station (15 min) and from Kastrup Airport (15 min).",
  },
  {
    icon: Plane,
    title: "Copenhagen Airport (CPH)",
    desc: "Just 7 km from Bella Center. Take the M1 metro 4 stops to Bella Center — running every 4 minutes.",
  },
  {
    icon: Car,
    title: "By car",
    desc: "Easy access from the E20/E47 motorway, Exit 19 (Center Boulevard). 1,200 underground parking spaces, 35 DKK/h.",
  },
  {
    icon: Bike,
    title: "Cycling",
    desc: "Like any good Copenhagen visit — Bella Center has 600+ covered bike racks. The Cykelslangen route connects you in 25 min from Vesterbro.",
  },
];

export default function Visit() {
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
              Plan Your Visit
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Everything you need to know before you arrive.
            </h1>
            <p className="text-lg text-muted-foreground">
              Bella Center Copenhagen — three days of construction, building
              and the people who design and build the Nordics.
            </p>
          </motion.div>

          {/* When & Where */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <Card className="p-8 bg-card">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Opening hours</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex justify-between">
                  <span>Tuesday 15 September</span>
                  <span className="font-medium text-foreground">09:00 — 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Wednesday 16 September</span>
                  <span className="font-medium text-foreground">09:00 — 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Thursday 17 September</span>
                  <span className="font-medium text-foreground">09:00 — 17:00</span>
                </li>
              </ul>
            </Card>
            <Card className="p-8 bg-card">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">Venue address</h2>
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
                  Open in Google Maps <ArrowRight className="ml-1 w-3 h-3" />
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Getting here</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {transport.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="p-6 bg-card h-full">
                      <Icon className="w-7 h-7 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">{t.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
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
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Visitor tickets</h2>
                <p className="text-muted-foreground mt-2">All tickets include access to the conference programme.</p>
              </div>
              <Link href="/register">
                <Button variant="outline">
                  Registration <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tickets.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="p-6 h-full flex flex-col bg-card hover:border-primary/40 transition-colors">
                    <Ticket className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{t.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-3">{t.price}</div>
                    <p className="text-sm text-muted-foreground mb-5 flex-1">{t.desc}</p>
                    <a href="mailto:info@nordexpo.dk?subject=Ticket%20enquiry">
                      <Button variant="outline" size="sm" className="w-full">
                        Reserve
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Where to stay</h2>
              <p className="text-muted-foreground mt-2">Hand-picked hotels with NordByg attendee rates.</p>
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
                    <div className="text-sm text-muted-foreground mb-4">{h.distance}</div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{h.desc}</p>
                    <div className="font-semibold text-primary">{h.price}</div>
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

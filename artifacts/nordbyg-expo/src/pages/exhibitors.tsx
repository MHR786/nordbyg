import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { exhibitors } from "@/lib/data";

export default function Exhibitors() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [active, setActive] = useState<typeof exhibitors[number] | null>(null);

  const cats = useMemo(
    () => Array.from(new Set(exhibitors.map((e) => e.category))).sort(),
    []
  );

  const filtered = exhibitors.filter((e) => {
    const okQ = !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.blurb.toLowerCase().includes(q.toLowerCase());
    const okC = !cat || e.category === cat;
    return okQ && okC;
  });

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-12"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              Exhibitor Directory
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              350+ companies. The Nordic construction industry, in one hall.
            </h1>
            <p className="text-lg text-muted-foreground">
              Below are the featured anchor exhibitors for NordByg 2026. The
              full alphabetical directory of all 350+ companies is published
              on 1 August 2026.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search exhibitors..."
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            <Button
              size="sm"
              variant={cat === null ? "default" : "outline"}
              onClick={() => setCat(null)}
            >
              All categories
            </Button>
            {cats.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={cat === c ? "default" : "outline"}
                onClick={() => setCat(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e, i) => (
              <motion.div
                key={e.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 9) * 0.04 }}
              >
                <Card
                  className="p-6 h-full bg-card hover:border-primary/40 cursor-pointer transition-colors group"
                  onClick={() => setActive(e)}
                >
                  <div className="text-2xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                    {e.name}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-primary mb-3">
                    {e.category}
                  </div>
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
                    {e.blurb}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      {e.hall}
                    </span>
                    <span>{e.country}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No exhibitors match your search.
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <div className="text-xs uppercase tracking-widest text-primary mb-2">
                  {active.category}
                </div>
                <DialogTitle className="text-3xl">{active.name}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground pt-2">
                  {active.blurb}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-muted/40">
                  <div className="text-xs uppercase text-muted-foreground mb-1">Country</div>
                  <div className="font-semibold">{active.country}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/40">
                  <div className="text-xs uppercase text-muted-foreground mb-1">Stand</div>
                  <div className="font-semibold">{active.hall}</div>
                </div>
              </div>
              <div className="pt-4 text-sm text-muted-foreground">
                Visit this exhibitor at NordByg 2026 — 15&nbsp;—&nbsp;17
                June at Bella Center Copenhagen.
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

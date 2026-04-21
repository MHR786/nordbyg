import { motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fullProgramme } from "@/lib/data";

const days = Object.keys(fullProgramme);

export default function Programme() {
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
              Conference Programme
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Three days. Six stages. 80 speakers.
            </h1>
            <p className="text-lg text-muted-foreground">
              A curated programme covering BIM, sustainability, machinery,
              architecture, policy and the future of Danish construction.
              All Main Stage talks include simultaneous DA↔EN interpretation.
            </p>
          </motion.div>

          <Tabs defaultValue={days[0]}>
            <TabsList className="mb-8 h-auto bg-card p-1">
              {days.map((d) => (
                <TabsTrigger key={d} value={d} className="text-sm py-2.5 px-4">
                  {d.split("—")[0].trim()}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((d) => (
              <TabsContent key={d} value={d}>
                <div className="mb-6 text-sm text-muted-foreground uppercase tracking-widest">
                  {d}
                </div>
                <div className="space-y-3">
                  {fullProgramme[d as keyof typeof fullProgramme].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="p-5 md:p-6 bg-card hover:border-primary/40 transition-colors">
                        <div className="grid md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-2 text-primary font-mono font-semibold">
                              <Clock className="w-4 h-4" />
                              {s.time}
                            </div>
                          </div>
                          <div className="md:col-span-7">
                            <h3 className="text-lg font-semibold leading-tight mb-2">
                              {s.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-primary/70" />
                                {s.speaker}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                {s.room}
                              </span>
                            </div>
                          </div>
                          <div className="md:col-span-3 flex md:justify-end">
                            <Badge variant="outline" className="border-primary/40 text-primary">
                              {s.track}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

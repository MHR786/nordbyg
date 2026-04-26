import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  Building2,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  website: z.string().url("Valid URL required").or(z.literal("")),
  category: z.string().min(1, "Please choose a category"),
  standSize: z.string().min(1, "Please choose a stand size"),
  description: z.string().min(20, "Please provide at least 20 characters"),
  consent: z.literal(true, { message: "You must accept the terms" }),
});

type FormData = z.infer<typeof schema>;

const categories = [
  "BIM & Digital Construction",
  "Sustainable Building Materials",
  "Heavy Machinery & Equipment",
  "Tools & Craftsmen Equipment",
  "Prefab & Modular Construction",
  "Smart Buildings & Facade Tech",
  "Safety, Compliance & Standards",
  "Architecture & Urban Design",
  "Insulation",
  "Roofing & Waterproofing",
  "Heating, Ventilation & Energy",
  "Other",
];

const stands = [
  { id: "9", label: "9 m² Shell-scheme", price: "12,400 DKK" },
  { id: "18", label: "18 m² Shell-scheme", price: "23,800 DKK" },
  { id: "36", label: "36 m² Space-only", price: "42,500 DKK" },
  { id: "72", label: "72 m² Space-only", price: "78,000 DKK" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      country: "Denmark",
      website: "",
      category: "",
      standSize: "",
      description: "",
      consent: false as unknown as true,
    },
  });

  const next = async () => {
    const fields: (keyof FormData)[][] = [
      [],
      ["companyName", "contactPerson", "email", "phone", "country", "website"],
      ["category", "standSize", "description"],
    ];
    const ok = await form.trigger(fields[step]);
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    const standLabel = stands.find((s) => s.id === data.standSize)?.label ?? data.standSize;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `New Exhibitor Registration — ${data.companyName} · NordByg 2026`,
          from_name: data.companyName,
          "Company Name": data.companyName,
          "Contact Person": data.contactPerson,
          "Email": data.email,
          "Phone": data.phone,
          "Country": data.country,
          "Website": data.website || "—",
          "Category": data.category,
          "Stand Size": standLabel,
          "Description": data.description,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Submission failed");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    }
  };

  const reset = () => {
    form.reset();
    setStep(1);
    setSubmitted(false);
    setSubmitError("");
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[80vh] pt-32 pb-20 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-28 h-28 mx-auto mb-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center relative"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
              >
                <Check className="w-14 h-14 text-primary" strokeWidth={3} />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            >
              Registration submitted
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="text-lg text-muted-foreground mb-3"
            >
              Thank you. Your application to exhibit at NordByg Expo 2026 has
              been received.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="text-base text-muted-foreground mb-10 max-w-lg mx-auto"
            >
              Our exhibitor team will review your application and contact you
              within <strong className="text-foreground">3 business days</strong>{" "}
              for company approval. Please check your inbox for a confirmation
              email shortly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/">
                <Button size="lg" className="h-12 px-8">
                  Return to home
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8"
                onClick={reset}
              >
                Submit another registration
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
                  Exhibitor Registration
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                  Reserve your stand at NordByg 2026.
                </h1>
                <p className="text-muted-foreground mb-8">
                  Submit the form to apply for an exhibition stand. Our team
                  reviews every application within 3 business days to confirm
                  fit with the construction sector before issuing a stand
                  contract.
                </p>

                <Card className="p-5 bg-card mb-5 border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      15 — 17 September 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      Bella Center Copenhagen
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <a
                      href="mailto:exhibitors@nordbygexpo.dk"
                      className="text-sm hover:text-primary"
                    >
                      exhibitors@nordbygexpo.dk
                    </a>
                  </div>
                </Card>

                <div className="space-y-3">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        step === s
                          ? "border-primary bg-primary/5"
                          : step > s
                          ? "border-border bg-card"
                          : "border-border"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                          step === s
                            ? "bg-primary text-primary-foreground"
                            : step > s
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step > s ? <Check className="w-4 h-4" /> : s}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step === s ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s === 1 && "Company information"}
                        {s === 2 && "Stand selection"}
                        {s === 3 && "Review & submit"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="p-6 md:p-10 bg-card border-border">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">
                          Company information
                        </h2>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Company name *" error={form.formState.errors.companyName?.message}>
                          <Input {...form.register("companyName")} placeholder="e.g. Nordic BuildTech ApS" />
                        </Field>
                        <Field label="Contact person *" error={form.formState.errors.contactPerson?.message}>
                          <Input {...form.register("contactPerson")} placeholder="Full name" />
                        </Field>
                        <Field label="Email *" error={form.formState.errors.email?.message}>
                          <Input type="email" {...form.register("email")} placeholder="name@company.dk" />
                        </Field>
                        <Field label="Phone *" error={form.formState.errors.phone?.message}>
                          <Input {...form.register("phone")} placeholder="+45 ..." />
                        </Field>
                        <Field label="Country *" error={form.formState.errors.country?.message}>
                          <Input {...form.register("country")} />
                        </Field>
                        <Field label="Website" error={form.formState.errors.website?.message}>
                          <Input {...form.register("website")} placeholder="https://www.company.dk" />
                        </Field>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        Stand selection
                      </h2>

                      <Field label="Company category *" error={form.formState.errors.category?.message}>
                        <Select
                          value={form.watch("category")}
                          onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <div>
                        <Label className="mb-3 block">Stand size *</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {stands.map((s) => {
                            const active = form.watch("standSize") === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => form.setValue("standSize", s.id, { shouldValidate: true })}
                                className={`text-left p-4 rounded-lg border-2 transition-all ${
                                  active
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/40"
                                }`}
                              >
                                <div className="font-semibold mb-1">{s.label}</div>
                                <div className="text-sm text-muted-foreground">from {s.price}</div>
                              </button>
                            );
                          })}
                        </div>
                        {form.formState.errors.standSize && (
                          <p className="text-sm text-destructive mt-2">{form.formState.errors.standSize.message}</p>
                        )}
                      </div>

                      <Field label="Brief description of products / services *" error={form.formState.errors.description?.message}>
                        <Textarea
                          {...form.register("description")}
                          rows={5}
                          placeholder="Tell us what your company does and what you plan to showcase at NordByg 2026."
                        />
                      </Field>

                      <div className="flex justify-between pt-4">
                        <Button type="button" size="lg" variant="outline" onClick={prev}>
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        Review &amp; submit
                      </h2>

                      <div className="space-y-3 rounded-lg border border-border p-5 bg-background">
                        <Row label="Company" v={form.watch("companyName")} />
                        <Row label="Contact" v={form.watch("contactPerson")} />
                        <Row label="Email" v={form.watch("email")} />
                        <Row label="Phone" v={form.watch("phone")} />
                        <Row label="Country" v={form.watch("country")} />
                        <Row label="Website" v={form.watch("website") || "—"} />
                        <Row label="Category" v={form.watch("category")} />
                        <Row label="Stand size" v={`${form.watch("standSize")} m²`} />
                        <div>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                            Description
                          </div>
                          <p className="text-sm">{form.watch("description")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={form.watch("consent") as unknown as boolean}
                          onCheckedChange={(v) =>
                            form.setValue("consent", (v === true) as true, { shouldValidate: true })
                          }
                        />
                        <Label htmlFor="consent" className="text-sm leading-relaxed font-normal text-muted-foreground">
                          I confirm the information above is accurate and I
                          accept the NordByg Expo 2026 exhibitor terms,
                          including review by the organising committee before
                          stand confirmation. *
                        </Label>
                      </div>
                      {form.formState.errors.consent && (
                        <p className="text-sm text-destructive">{form.formState.errors.consent.message}</p>
                      )}

                      {submitError && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                          {submitError}
                        </p>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button type="button" size="lg" variant="outline" onClick={prev}>
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Sending…" : "Submit registration"}
                          <Check className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

function Row({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}

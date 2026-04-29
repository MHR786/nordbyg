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
  Users,
  UserCheck,
  BadgeCheck,
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

// ─── Registrant lookup database ──────────────────────────────────────────────

const registrantDB = [
  {
    regNumber: "NB-2026-847",
    name: "Khurram Shahzad",
    designation: "Chief Executive Officer",
    company: "Khurram Builders",
    country: "Pakistan",
    dob: "February 9, 1984",
    passport: "LE5167091",
    passportExpiry: "July 2, 2028",
    passType: "3-Day Trade Pass",
    regType: "Visitor — Company Representative",
    regDate: "April 29, 2026",
    ref: "NB2026-VIS-00847",
  },
];

type Registrant = (typeof registrantDB)[0];

// ─── Barcode SVG ─────────────────────────────────────────────────────────────

function Barcode({ code }: { code: string }) {
  const bars: { x: number; w: number; h: number }[] = [];
  let x = 0;
  for (let i = 0; i < 40; i++) {
    const ch = code.charCodeAt(i % code.length);
    const w = ((ch + i * 7) % 3) + 1;
    const h = 38 + ((ch * 3 + i * 5) % 24);
    bars.push({ x, w, h });
    x += w + 1.5;
  }
  return (
    <svg
      width="190"
      height="62"
      viewBox={`0 0 ${x} 62`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={62 - b.h}
          width={b.w}
          height={b.h}
          fill="#1e293b"
        />
      ))}
    </svg>
  );
}

// ─── QR code SVG ─────────────────────────────────────────────────────────────

function QRGrid({ code }: { code: string }) {
  const size = 21;
  const cs = 5;
  const cells: boolean[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let black = false;
      if (r < 7 && c < 7) {
        black =
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else if (r < 7 && c >= 14) {
        const lc = c - 14;
        black =
          r === 0 ||
          r === 6 ||
          lc === 0 ||
          lc === 6 ||
          (r >= 2 && r <= 4 && lc >= 2 && lc <= 4);
      } else if (r >= 14 && c < 7) {
        const lr = r - 14;
        black =
          lr === 0 ||
          lr === 6 ||
          c === 0 ||
          c === 6 ||
          (lr >= 2 && lr <= 4 && c >= 2 && c <= 4);
      } else {
        const idx = r * size + c;
        const ch = code.charCodeAt(idx % code.length);
        black = (ch + r * 3 + c * 7 + idx) % 3 !== 0;
      }
      cells.push(black);
    }
  }
  const total = size * cs + 8;
  return (
    <svg width={total} height={total} xmlns="http://www.w3.org/2000/svg">
      <rect width={total} height={total} fill="white" />
      {cells.map((black, i) =>
        black ? (
          <rect
            key={i}
            x={(i % size) * cs + 4}
            y={Math.floor(i / size) * cs + 4}
            width={cs}
            height={cs}
            fill="#0f172a"
          />
        ) : null,
      )}
    </svg>
  );
}

// ─── Shared data ──────────────────────────────────────────────────────────────

const interestAreas = [
  "BIM & Digital Construction",
  "Sustainable Building Materials",
  "Heavy Machinery & Equipment",
  "Tools & Craftsmen Equipment",
  "Prefab & Modular Construction",
  "Smart Buildings & Facade Tech",
  "Safety, Compliance & Standards",
  "Architecture & Urban Design",
];

const howYouHeardOptions = [
  "Social Media",
  "Search Engine (Google, etc.)",
  "Colleague / Word of mouth",
  "Industry publication / Magazine",
  "Previous NordByg Expo",
  "Email newsletter",
  "Other",
];

// ─── Visitor schema ───────────────────────────────────────────────────────────

const visitorSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email required"),
    attendeeType: z.string().min(1, "Please select a type"),
    companyName: z.string(),
    designation: z.string(),
    gender: z.string().min(1, "Please select your gender"),
    dob: z.string().min(1, "Date of birth is required"),
    docType: z.string().min(1, "Please select a document type"),
    docNumber: z.string().min(3, "Document number is required"),
    country: z.string().min(2, "Country is required"),
    companyUrl: z.string().url("Valid URL required").or(z.literal("")),
    address: z.string().min(5, "Address is required"),
    contactNumber: z.string().min(6, "Contact number is required"),
    aboutYourself: z.string().min(20, "Please write at least 20 characters"),
    interestedIn: z.array(z.string()).min(1, "Select at least one area"),
    howYouHeard: z.string().min(1, "Please select an option"),
    passSelection: z.string().min(1, "Please select a pass"),
    consent: z.literal(true, { message: "You must accept the terms" }),
  })
  .superRefine((data, ctx) => {
    if (data.attendeeType === "Company" && data.companyName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required",
        path: ["companyName"],
      });
    }
    if (data.attendeeType !== "Student" && data.designation.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation is required",
        path: ["designation"],
      });
    }
  });

type VisitorData = z.infer<typeof visitorSchema>;

const visitorPasses = [
  { id: "A", label: "Pass A — 1-Day Trade Pass", price: "245 DKK" },
  { id: "B", label: "Pass B — 3-Day Trade Pass", price: "545 DKK" },
  {
    id: "C",
    label: "Pass C — Student Pass",
    price: "95 DKK (valid student ID required)",
  },
  {
    id: "D",
    label: "Pass D — Member Pass",
    price: "Free (DI Byg / AOB members)",
  },
];

// ─── Exhibitor schema ─────────────────────────────────────────────────────────

const exhibitorSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  companyName: z.string().min(2, "Company name is required"),
  designation: z.string().min(2, "Designation is required"),
  docType: z.string().min(1, "Please select a document type"),
  docNumber: z.string().min(3, "Document number is required"),
  role: z.string().min(1, "Please select a role"),
  buyerType: z.string().min(1, "Please select a type"),
  companyUrl: z.string().url("Valid URL required").or(z.literal("")),
  country: z.string().min(2, "Country is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(6, "Phone number is required"),
  standOption: z.string().min(1, "Please select a stand option"),
  interestedIn: z.array(z.string()).min(1, "Select at least one area"),
  howYouHeard: z.string().min(1, "Please select an option"),
  consent: z.literal(true, { message: "You must accept the terms" }),
});

type ExhibitorData = z.infer<typeof exhibitorSchema>;

const exhibitorRoles = [
  "Final Decision Maker",
  "Accountant / Finance",
  "Project Manager",
  "Sales / Business Development",
  "Technical / Engineering",
  "HR / Administration",
  "Trainer / Consultant",
  "Other",
];

const buyerTypes = ["Buyer", "Purchaser", "Specifier", "Contractor", "Other"];

const standOptions = [
  { id: "A", label: "Stand A — 9 m² Shell-scheme", price: "from 12,400 DKK" },
  { id: "B", label: "Stand B — 18 m² Shell-scheme", price: "from 23,800 DKK" },
  { id: "C", label: "Stand C — 36 m² Space-only", price: "from 42,500 DKK" },
  { id: "D", label: "Stand D — 72 m² Space-only", price: "from 78,000 DKK" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

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
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}

function InterestCheckboxes({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (area: string) => {
    onChange(
      value.includes(area) ? value.filter((a) => a !== area) : [...value, area],
    );
  };
  return (
    <div>
      <Label className="mb-3 block">Interested in *</Label>
      <div className="grid sm:grid-cols-2 gap-2">
        {interestAreas.map((area) => (
          <label
            key={area}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={value.includes(area)}
              onCheckedChange={() => toggle(area)}
            />
            <span className="text-sm">{area}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}

function Sidebar({
  type,
  step,
  steps,
}: {
  type: "visitor" | "exhibitor";
  step: number;
  steps: string[];
}) {
  return (
    <aside className="lg:col-span-4">
      <div className="lg:sticky lg:top-28">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
          {type === "visitor"
            ? "Visitor Registration"
            : "Exhibitor Registration"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
          {type === "visitor"
            ? "Register as a visitor to NordByg 2026."
            : "Reserve your stand at NordByg 2026."}
        </h1>
        <p className="text-muted-foreground mb-8">
          {type === "visitor"
            ? "Complete the form to register your visitor pass. You'll receive your ticket confirmation by email."
            : "Submit the form to apply for an exhibition stand. Our team reviews every application within 3 business days."}
        </p>

        <Card className="p-5 bg-card mb-5 border-border">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">15 — 17 June 2026</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">Bella Center Copenhagen</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary" />
            <a
              href="mailto:info@nordexpo.dk"
              className="text-sm hover:text-primary"
            >
              info@nordexpo.dk
            </a>
          </div>
        </Card>

        <div className="space-y-3">
          {steps.map((label, i) => {
            const s = i + 1;
            return (
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
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
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
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-28 h-28 mx-auto mb-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center relative"
          >
            <Check className="w-14 h-14 text-primary" strokeWidth={3} />
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
            Thank you. Your registration for NordByg Expo 2026 has been
            received.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="text-base text-muted-foreground mb-10 max-w-lg mx-auto"
          >
            Our team will review your application and contact you within{" "}
            <strong className="text-foreground">3 business days</strong>. Please
            check your inbox for a confirmation email shortly.
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
              onClick={onReset}
            >
              Submit another registration
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

// ─── Visitor form ─────────────────────────────────────────────────────────────

function VisitorForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<VisitorData>({
    resolver: zodResolver(visitorSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      attendeeType: "",
      companyName: "",
      designation: "",
      gender: "",
      dob: "",
      docType: "",
      docNumber: "",
      country: "Denmark",
      companyUrl: "",
      address: "",
      contactNumber: "",
      aboutYourself: "",
      interestedIn: [],
      howYouHeard: "",
      passSelection: "",
      consent: false as unknown as true,
    },
  });

  const attendeeType = form.watch("attendeeType");
  const isStudent = attendeeType === "Student";
  const isCompany = attendeeType === "Company";

  const stepFields: (keyof VisitorData)[][] = [
    [],
    [
      "name",
      "email",
      "attendeeType",
      "gender",
      "dob",
      "docType",
      "docNumber",
      "contactNumber",
    ],
    [
      "companyName",
      "designation",
      "country",
      "companyUrl",
      "address",
      "aboutYourself",
    ],
    ["interestedIn", "howYouHeard", "passSelection", "consent"],
  ];

  const next = async () => {
    const fields = stepFields[step].filter((f) => {
      if (f === "companyName" && !isCompany) return false;
      if ((f === "designation" || f === "companyUrl") && isStudent)
        return false;
      return true;
    });
    const ok = await form.trigger(fields);
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => {
    if (step === 1) {
      onBack();
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async (data: VisitorData) => {
    setSubmitError("");
    const pass = visitorPasses.find((p) => p.id === data.passSelection);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "a7719177-3f12-4efb-b160-21c7e77b46dd",
          subject: `New Visitor Registration — ${data.name} · NordByg 2026`,
          from_name: data.name,
          "Registration Type": "Visitor",
          Name: data.name,
          Email: data.email,
          "Attendee Type": data.attendeeType,
          ...(data.attendeeType === "Company" && {
            "Company Name": data.companyName,
          }),
          ...(data.attendeeType !== "Student" && {
            Designation: data.designation,
          }),
          Gender: data.gender,
          "Date of Birth": data.dob,
          "Document Type": data.docType,
          "Document Number": data.docNumber,
          Country: data.country,
          ...(data.attendeeType !== "Student" &&
            data.companyUrl && { "Company URL": data.companyUrl }),
          Address: data.address,
          "Contact Number": data.contactNumber,
          About: data.aboutYourself,
          "Interested In": data.interestedIn.join(", "),
          "How They Heard": data.howYouHeard,
          "Pass Selected": pass
            ? `${pass.label} · ${pass.price}`
            : data.passSelection,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setSubmitError(json.message ?? "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection and try again.",
      );
    }
  };

  if (submitted) return <SuccessScreen onReset={onBack} />;

  const steps = ["Personal details", "Additional info", "Review & submit"];

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <Sidebar type="visitor" step={step} steps={steps} />

            <div className="lg:col-span-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="p-6 md:p-10 bg-card border-border">
                  {/* Step 1 — Personal details */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">
                          Personal details
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label="Full name *"
                          error={form.formState.errors.name?.message}
                        >
                          <Input
                            {...form.register("name")}
                            placeholder="Your full name"
                          />
                        </Field>
                        <Field
                          label="Email *"
                          error={form.formState.errors.email?.message}
                        >
                          <Input
                            type="email"
                            {...form.register("email")}
                            placeholder="name@company.dk"
                          />
                        </Field>
                        <Field
                          label="Attendee type *"
                          error={form.formState.errors.attendeeType?.message}
                        >
                          <Select
                            value={form.watch("attendeeType")}
                            onValueChange={(v) =>
                              form.setValue("attendeeType", v, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Company">Company</SelectItem>
                              <SelectItem value="Student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Gender *"
                          error={form.formState.errors.gender?.message}
                        >
                          <Select
                            value={form.watch("gender")}
                            onValueChange={(v) =>
                              form.setValue("gender", v, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Prefer not to say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Date of birth *"
                          error={form.formState.errors.dob?.message}
                        >
                          <Input
                            type="date"
                            {...form.register("dob")}
                            className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80"
                          />
                        </Field>
                        <Field
                          label="Contact number *"
                          error={form.formState.errors.contactNumber?.message}
                        >
                          <Input
                            {...form.register("contactNumber")}
                            placeholder="+45 ..."
                          />
                        </Field>
                        <Field
                          label="Document type *"
                          error={form.formState.errors.docType?.message}
                        >
                          <Select
                            value={form.watch("docType")}
                            onValueChange={(v) =>
                              form.setValue("docType", v, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="ID Card">ID Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Document number *"
                          error={form.formState.errors.docNumber?.message}
                        >
                          <Input
                            {...form.register("docNumber")}
                            placeholder="e.g. AB1234567"
                          />
                        </Field>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 — Additional info */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        Additional info
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {isCompany && (
                          <Field
                            label="Company name *"
                            error={form.formState.errors.companyName?.message}
                          >
                            <Input
                              {...form.register("companyName")}
                              placeholder="e.g. Skanska Danmark A/S"
                            />
                          </Field>
                        )}
                        {!isStudent && (
                          <Field
                            label="Designation *"
                            error={form.formState.errors.designation?.message}
                          >
                            <Input
                              {...form.register("designation")}
                              placeholder="e.g. Senior Architect"
                            />
                          </Field>
                        )}
                        <Field
                          label="Country *"
                          error={form.formState.errors.country?.message}
                        >
                          <Input {...form.register("country")} />
                        </Field>
                        {!isStudent && (
                          <Field
                            label="Company URL (optional)"
                            error={form.formState.errors.companyUrl?.message}
                          >
                            <Input
                              {...form.register("companyUrl")}
                              placeholder="https://www.company.dk"
                            />
                          </Field>
                        )}
                        <Field
                          label="Address *"
                          error={form.formState.errors.address?.message}
                        >
                          <Input
                            {...form.register("address")}
                            placeholder="Street, City, Postcode"
                          />
                        </Field>
                      </div>
                      <Field
                        label="About yourself *"
                        error={form.formState.errors.aboutYourself?.message}
                      >
                        <Textarea
                          {...form.register("aboutYourself")}
                          rows={5}
                          placeholder="Tell us about your role, company and why you are attending NordByg 2026."
                        />
                      </Field>
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 — Review & submit */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        Review &amp; submit
                      </h2>

                      {/* Review summary */}
                      <div className="space-y-3 rounded-lg border border-border p-5 bg-background">
                        <Row label="Name" v={form.watch("name")} />
                        <Row label="Email" v={form.watch("email")} />
                        <Row label="Type" v={form.watch("attendeeType")} />
                        {isCompany && (
                          <Row label="Company" v={form.watch("companyName")} />
                        )}
                        <Row label="Gender" v={form.watch("gender")} />
                        <Row label="Date of birth" v={form.watch("dob")} />
                        <Row label="Document type" v={form.watch("docType")} />
                        <Row
                          label="Document number"
                          v={form.watch("docNumber")}
                        />
                        {!isStudent && (
                          <Row
                            label="Designation"
                            v={form.watch("designation")}
                          />
                        )}
                        <Row label="Contact" v={form.watch("contactNumber")} />
                        <Row label="Country" v={form.watch("country")} />
                        <Row label="Address" v={form.watch("address")} />
                        {!isStudent && form.watch("companyUrl") && (
                          <Row label="Website" v={form.watch("companyUrl")} />
                        )}
                      </div>

                      {/* Interests */}
                      <InterestCheckboxes
                        value={form.watch("interestedIn")}
                        onChange={(v) =>
                          form.setValue("interestedIn", v, {
                            shouldValidate: true,
                          })
                        }
                        error={form.formState.errors.interestedIn?.message}
                      />

                      {/* How you heard */}
                      <Field
                        label="How did you hear about NordByg? *"
                        error={form.formState.errors.howYouHeard?.message}
                      >
                        <Select
                          value={form.watch("howYouHeard")}
                          onValueChange={(v) =>
                            form.setValue("howYouHeard", v, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {howYouHeardOptions.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Pass selection */}
                      <div>
                        <Label className="mb-3 block">Pass selection *</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {visitorPasses.map((p) => {
                            const active = form.watch("passSelection") === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() =>
                                  form.setValue("passSelection", p.id, {
                                    shouldValidate: true,
                                  })
                                }
                                className={`text-left p-4 rounded-lg border-2 transition-all ${
                                  active
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/40"
                                }`}
                              >
                                <div className="font-semibold mb-1">
                                  {p.label}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {p.price}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {form.formState.errors.passSelection && (
                          <p className="text-sm text-destructive mt-2">
                            {form.formState.errors.passSelection.message}
                          </p>
                        )}
                      </div>

                      {/* Consent */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={form.watch("consent") as unknown as boolean}
                          onCheckedChange={(v) =>
                            form.setValue("consent", (v === true) as true, {
                              shouldValidate: true,
                            })
                          }
                        />
                        <Label
                          htmlFor="consent"
                          className="text-sm leading-relaxed font-normal text-muted-foreground"
                        >
                          I confirm that the information provided is accurate
                          and I accept the NordByg Expo 2026 visitor terms and
                          privacy policy. *
                        </Label>
                      </div>
                      {form.formState.errors.consent && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.consent.message}
                        </p>
                      )}

                      {submitError && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                          {submitError}
                        </p>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? "Sending…"
                            : "Submit registration"}
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

// ─── Exhibitor form ───────────────────────────────────────────────────────────

function ExhibitorForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ExhibitorData>({
    resolver: zodResolver(exhibitorSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      designation: "",
      docType: "",
      docNumber: "",
      role: "",
      buyerType: "",
      companyUrl: "",
      country: "Denmark",
      address: "",
      phone: "",
      standOption: "",
      interestedIn: [],
      howYouHeard: "",
      consent: false as unknown as true,
    },
  });

  const stepFields: (keyof ExhibitorData)[][] = [
    [],
    ["name", "email", "companyName", "designation", "docType", "docNumber"],
    [
      "role",
      "buyerType",
      "companyUrl",
      "country",
      "address",
      "phone",
      "standOption",
    ],
    ["interestedIn", "howYouHeard", "consent"],
  ];

  const next = async () => {
    const ok = await form.trigger(stepFields[step]);
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => {
    if (step === 1) {
      onBack();
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async (data: ExhibitorData) => {
    setSubmitError("");
    const stand = standOptions.find((s) => s.id === data.standOption);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "a7719177-3f12-4efb-b160-21c7e77b46dd",
          subject: `New Exhibitor Registration — ${data.companyName} · NordByg 2026`,
          from_name: data.name,
          "Registration Type": "Exhibitor",
          Name: data.name,
          Email: data.email,
          "Company Name": data.companyName,
          Designation: data.designation,
          "Document Type": data.docType,
          "Document Number": data.docNumber,
          Role: data.role,
          "Buyer Type": data.buyerType,
          "Company URL": data.companyUrl || "—",
          Country: data.country,
          Address: data.address,
          Phone: data.phone,
          "Stand Option": stand
            ? `${stand.label} · ${stand.price}`
            : data.standOption,
          "Interested In": data.interestedIn.join(", "),
          "How They Heard": data.howYouHeard,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setSubmitError(json.message ?? "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection and try again.",
      );
    }
  };

  if (submitted) return <SuccessScreen onReset={onBack} />;

  const steps = ["Contact information", "Stand selection", "Review & submit"];

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <Sidebar type="exhibitor" step={step} steps={steps} />

            <div className="lg:col-span-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="p-6 md:p-10 bg-card border-border">
                  {/* Step 1 — Contact information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">
                          Contact information
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label="Full name *"
                          error={form.formState.errors.name?.message}
                        >
                          <Input
                            {...form.register("name")}
                            placeholder="Your full name"
                          />
                        </Field>
                        <Field
                          label="Email *"
                          error={form.formState.errors.email?.message}
                        >
                          <Input
                            type="email"
                            {...form.register("email")}
                            placeholder="name@company.dk"
                          />
                        </Field>
                        <Field
                          label="Company name *"
                          error={form.formState.errors.companyName?.message}
                        >
                          <Input
                            {...form.register("companyName")}
                            placeholder="e.g. Nordic BuildTech ApS"
                          />
                        </Field>
                        <Field
                          label="Designation *"
                          error={form.formState.errors.designation?.message}
                        >
                          <Input
                            {...form.register("designation")}
                            placeholder="e.g. Sales Director"
                          />
                        </Field>
                        <Field
                          label="Document type *"
                          error={form.formState.errors.docType?.message}
                        >
                          <Select
                            value={form.watch("docType")}
                            onValueChange={(v) =>
                              form.setValue("docType", v, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="ID Card">ID Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Document number *"
                          error={form.formState.errors.docNumber?.message}
                        >
                          <Input
                            {...form.register("docNumber")}
                            placeholder="e.g. AB1234567"
                          />
                        </Field>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 — Stand selection */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        Stand selection
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label="Your role *"
                          error={form.formState.errors.role?.message}
                        >
                          <Select
                            value={form.watch("role")}
                            onValueChange={(v) =>
                              form.setValue("role", v, { shouldValidate: true })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {exhibitorRoles.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Buyer type *"
                          error={form.formState.errors.buyerType?.message}
                        >
                          <Select
                            value={form.watch("buyerType")}
                            onValueChange={(v) =>
                              form.setValue("buyerType", v, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {buyerTypes.map((b) => (
                                <SelectItem key={b} value={b}>
                                  {b}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label="Company URL (optional)"
                          error={form.formState.errors.companyUrl?.message}
                        >
                          <Input
                            {...form.register("companyUrl")}
                            placeholder="https://www.company.dk"
                          />
                        </Field>
                        <Field
                          label="Country *"
                          error={form.formState.errors.country?.message}
                        >
                          <Input {...form.register("country")} />
                        </Field>
                        <Field
                          label="Phone *"
                          error={form.formState.errors.phone?.message}
                        >
                          <Input
                            {...form.register("phone")}
                            placeholder="+45 ..."
                          />
                        </Field>
                        <Field
                          label="Address *"
                          error={form.formState.errors.address?.message}
                        >
                          <Input
                            {...form.register("address")}
                            placeholder="Street, City, Postcode"
                          />
                        </Field>
                      </div>

                      <div>
                        <Label className="mb-3 block">Stand option *</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {standOptions.map((s) => {
                            const active = form.watch("standOption") === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() =>
                                  form.setValue("standOption", s.id, {
                                    shouldValidate: true,
                                  })
                                }
                                className={`text-left p-4 rounded-lg border-2 transition-all ${
                                  active
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/40"
                                }`}
                              >
                                <div className="font-semibold mb-1">
                                  {s.label}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {s.price}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {form.formState.errors.standOption && (
                          <p className="text-sm text-destructive mt-2">
                            {form.formState.errors.standOption.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 — Review & submit */}
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
                        <Row label="Name" v={form.watch("name")} />
                        <Row label="Email" v={form.watch("email")} />
                        <Row label="Company" v={form.watch("companyName")} />
                        <Row
                          label="Designation"
                          v={form.watch("designation")}
                        />
                        <Row label="Document type" v={form.watch("docType")} />
                        <Row
                          label="Document number"
                          v={form.watch("docNumber")}
                        />
                        <Row label="Role" v={form.watch("role")} />
                        <Row label="Buyer type" v={form.watch("buyerType")} />
                        <Row label="Phone" v={form.watch("phone")} />
                        <Row label="Country" v={form.watch("country")} />
                        <Row label="Address" v={form.watch("address")} />
                        {form.watch("companyUrl") && (
                          <Row label="Website" v={form.watch("companyUrl")} />
                        )}
                        <Row
                          label="Stand option"
                          v={`Stand ${form.watch("standOption")}`}
                        />
                      </div>

                      <InterestCheckboxes
                        value={form.watch("interestedIn")}
                        onChange={(v) =>
                          form.setValue("interestedIn", v, {
                            shouldValidate: true,
                          })
                        }
                        error={form.formState.errors.interestedIn?.message}
                      />

                      <Field
                        label="How did you hear about NordByg? *"
                        error={form.formState.errors.howYouHeard?.message}
                      >
                        <Select
                          value={form.watch("howYouHeard")}
                          onValueChange={(v) =>
                            form.setValue("howYouHeard", v, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {howYouHeardOptions.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={form.watch("consent") as unknown as boolean}
                          onCheckedChange={(v) =>
                            form.setValue("consent", (v === true) as true, {
                              shouldValidate: true,
                            })
                          }
                        />
                        <Label
                          htmlFor="consent"
                          className="text-sm leading-relaxed font-normal text-muted-foreground"
                        >
                          I confirm the information above is accurate and I
                          accept the NordByg Expo 2026 exhibitor terms,
                          including review by the organising committee before
                          stand confirmation. *
                        </Label>
                      </div>
                      {form.formState.errors.consent && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.consent.message}
                        </p>
                      )}

                      {submitError && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                          {submitError}
                        </p>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? "Sending…"
                            : "Submit registration"}
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

// ─── Registration confirmation card ──────────────────────────────────────────

function RegistrationCard({
  r,
  onBack,
}: {
  r: Registrant;
  onBack: () => void;
}) {
  return (
    <Layout>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Action bar */}
          <div className="no-print flex items-center justify-between mb-6 max-w-4xl mx-auto">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button onClick={() => window.print()}>Print / Save as PDF</Button>
          </div>

          {/* Printable card — white background for document feel */}
          <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            {/* Banner */}
            <div
              className="flex items-center justify-between px-8 py-5"
              style={{
                background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center"
                  style={{ background: "#d97706" }}
                >
                  <span className="text-white font-mono font-black text-lg tracking-tighter">
                    NB
                  </span>
                </div>
                <div>
                  <div className="text-white font-bold text-xl leading-tight">
                    NordByg <span style={{ color: "#d97706" }}>Expo</span>
                  </div>
                  <div
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "#94a3b8" }}
                  >
                    Denmark's Construction Trade Show
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="font-black text-lg leading-tight"
                  style={{ color: "#d97706" }}
                >
                  15–17 JUNE 2026
                </div>
                <div className="text-xs" style={{ color: "#94a3b8" }}>
                  Bella Center Copenhagen
                </div>
                <div className="text-xs" style={{ color: "#94a3b8" }}>
                  nordexpo.dk
                </div>
              </div>
            </div>

            {/* Title row */}
            <div className="flex items-start justify-between px-8 py-4 border-b border-slate-200">
              <h1 className="text-xl font-black text-slate-900 leading-tight">
                Confirmation of Registration to
                <br />
                <span style={{ color: "#d97706" }}>NordByg Expo 2026</span>
              </h1>
              <div
                className="border-2 rounded-lg px-4 py-2 text-right shrink-0 ml-4"
                style={{ background: "#fef3c7", borderColor: "#d97706" }}
              >
                <div
                  className="text-xs uppercase tracking-wider font-bold"
                  style={{ color: "#92400e" }}
                >
                  Registration No.
                </div>
                <div
                  className="text-lg font-black"
                  style={{ color: "#92400e" }}
                >
                  {r.regNumber}
                </div>
              </div>
            </div>

            {/* Notice */}
            <div
              className="border-l-4 px-8 py-2.5 text-xs text-slate-500"
              style={{ background: "#f8fafc", borderLeftColor: "#d97706" }}
            >
              This confirmation is personal and non-transferable. Present this
              document with a valid passport or ID card at the accreditation
              desk at Bella Center Copenhagen.
            </div>

            {/* Two-column: data | localizer */}
            <div className="grid grid-cols-2 border-b border-slate-200">
              {/* Registration data */}
              <div className="border-r border-slate-200">
                <div
                  className="px-8 py-2.5 border-b border-slate-200 flex items-center gap-2"
                  style={{ background: "#f1f5f9" }}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    ✦ Registration Data
                  </span>
                </div>
                <div className="px-8 py-4 space-y-3">
                  {(
                    [
                      ["Complete Name", r.name.toUpperCase()],
                      ["Designation", `${r.designation}, ${r.company}`],
                      ["Passport", r.passport],
                      ["Passport Expiry", r.passportExpiry],
                      ["Country of Residence", r.country],
                      ["Date of Birth", r.dob],
                      ["Pass Category", r.passType],
                      ["Registration Type", r.regType],
                    ] as [string, string][]
                  ).map(([label, value]) => (
                    <div key={label}>
                      <div className="text-xs font-black uppercase text-slate-800 tracking-wide">
                        {label}:
                      </div>
                      <div className="text-sm text-slate-700 leading-snug">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Localizer */}
              <div>
                <div
                  className="px-8 py-2.5 border-b border-slate-200"
                  style={{ background: "#f1f5f9" }}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    ▐▌ Localizer
                  </span>
                </div>
                <div className="px-8 py-6 flex flex-col items-center gap-4">
                  <div className="text-center">
                    <Barcode code={r.regNumber + r.name} />
                    <div className="font-mono text-xs font-bold text-slate-700 mt-1 tracking-widest">
                      {r.regNumber.replace(/-/g, "")}
                    </div>
                  </div>
                  <QRGrid code={r.regNumber + r.name + r.passport} />
                  <div
                    className="text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full"
                    style={{ background: "#0f172a", color: "#d97706" }}
                  >
                    {r.passType}
                  </div>
                </div>
              </div>
            </div>

            {/* Event info */}
            <div className="px-8 py-5">
              <div
                className="py-2 border-b border-slate-200 mb-4"
                style={{ background: "transparent" }}
              >
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  📋 Event Information
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                {(
                  [
                    ["Date", "June 15 to 17, 2026"],
                    ["Schedule", "09:00 — 18:00 (Thu until 17:00)"],
                    ["Venue", "Bella Center Copenhagen"],
                    [
                      "Address",
                      "Center Boulevard 5, 2300 København S, Denmark",
                    ],
                    ["Registration Type", r.regType],
                    ["Contact", "info@nordexpo.dk"],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs font-black uppercase text-slate-800 tracking-wide">
                      {label}:
                    </div>
                    <div className="text-sm text-slate-600 leading-snug">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-8 py-3"
              style={{ background: "#0f172a" }}
            >
              <div
                className="text-xs leading-relaxed"
                style={{ color: "#94a3b8" }}
              >
                NordByg Expo Sekretariat · Bella Center, Center Boulevard 5,
                2300 København S<br />
                This document is issued for official registration and travel
                assistance purposes.
              </div>
              <div className="text-right shrink-0 ml-4">
                <div
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: "#d97706" }}
                >
                  APPROVED ✓
                </div>
                <div className="text-xs" style={{ color: "#94a3b8" }}>
                  {r.regDate} · Ref: {r.ref}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Verify badge lookup form ─────────────────────────────────────────────────

function VerifyBadge({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState<Registrant | null>(null);

  if (found) {
    return (
      <RegistrationCard
        r={found}
        onBack={() => {
          setFound(null);
          setError("");
        }}
      />
    );
  }

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const match = registrantDB.find(
      (r) =>
        r.regNumber.toLowerCase() === regNumber.trim().toLowerCase() &&
        r.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (match) {
      setFound(match);
    } else {
      setError(
        "No registration found. Please check your name and registration number.",
      );
    }
  };

  return (
    <Layout>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <Button variant="outline" className="mb-8" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>

            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
                Already Registered
              </p>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Download Your Badge
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Enter the full name and registration number you received. Your
                confirmation badge will appear instantly.
              </p>
            </div>

            <Card className="p-8 bg-card">
              <form onSubmit={handleLookup} className="space-y-5">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Registration Number *
                  </Label>
                  <Input
                    value={regNumber}
                    onChange={(e) => {
                      setRegNumber(e.target.value);
                      setError("");
                    }}
                    placeholder="NB-xxx-xxx"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full">
                  Find My Registration <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have a registration number? Email{" "}
              <a
                href="mailto:info@nordexpo.dk"
                className="text-primary hover:underline"
              >
                info@nordexpo.dk
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Type selection screen ────────────────────────────────────────────────────

export default function Register() {
  const [type, setType] = useState<"visitor" | "exhibitor" | "verify" | null>(
    null,
  );

  if (type === "visitor") return <VisitorForm onBack={() => setType(null)} />;
  if (type === "exhibitor")
    return <ExhibitorForm onBack={() => setType(null)} />;
  if (type === "verify") return <VerifyBadge onBack={() => setType(null)} />;

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center mb-14"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              NordByg Expo 2026
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
              How are you joining us?
            </h1>
            <p className="text-lg text-muted-foreground">
              Select the registration type that applies to you. You can always
              come back and choose the other.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Visitor card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => setType("visitor")}
                className="w-full text-left group"
              >
                <Card className="p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Visitor</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Attend NordByg 2026 as a trade visitor. Browse exhibitors,
                    attend conference talks and explore the show floor.
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Access to all 4 exhibition halls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Full conference programme included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Passes from 245 DKK · Free for members</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Register as visitor{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </button>
            </motion.div>

            {/* Exhibitor card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setType("exhibitor")}
                className="w-full text-left group"
              >
                <Card className="p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <UserCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Exhibitor</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Showcase your company, products and services to 12,000+
                    trade visitors from across the Nordic construction sector.
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Shell-scheme or space-only stands</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>9 m² to 72 m² options available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Reviewed within 3 business days</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Register as exhibitor{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </button>
            </motion.div>

            {/* Already Registered card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setType("verify")}
                className="w-full text-left group"
              >
                <Card className="p-8 h-full border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <BadgeCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    Already Registered
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Already submitted your registration? Download and print your
                    official confirmation badge using your name and registration
                    number.
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Instant badge download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Barcode &amp; QR code included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>Valid for visa &amp; travel documents</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Download my badge{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10 text-sm text-muted-foreground"
          >
            Questions? Email us at{" "}
            <a
              href="mailto:info@nordexpo.dk"
              className="text-primary hover:underline"
            >
              info@nordexpo.dk
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

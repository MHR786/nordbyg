import { useState, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
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

type TFn = (key: string) => string;

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

// ─── Shared data ──────────────────────────────────────────────────────────────

const useInterestAreas = (t: TFn) =>
  useMemo(
    () => [
      t("register.interest1"),
      t("register.interest2"),
      t("register.interest3"),
      t("register.interest4"),
      t("register.interest5"),
      t("register.interest6"),
      t("register.interest7"),
      t("register.interest8"),
    ],
    [t],
  );

const useHowYouHeardOptions = (t: TFn) =>
  useMemo(
    () => [
      t("register.howSocial"),
      t("register.howSearch"),
      t("register.howColleague"),
      t("register.howIndustry"),
      t("register.howPrevious"),
      t("register.howNewsletter"),
      t("register.howOther"),
    ],
    [t],
  );

// ─── Visitor schema ───────────────────────────────────────────────────────────

const makeVisitorSchema = (t: TFn) =>
  z
    .object({
      name: z.string().min(2, t("register.nameRequired")),
      email: z.string().email(t("register.emailRequired")),
      attendeeType: z.string().min(1, t("register.typeRequired")),
      companyName: z.string(),
      designation: z.string(),
      gender: z.string().min(1, t("register.genderRequired")),
      dob: z.string().min(1, t("register.dobRequired")),
      docType: z.string().min(1, t("register.docTypeRequired")),
      docNumber: z.string().min(3, t("register.docNumberRequired")),
      country: z.string().min(2, t("register.countryRequired")),
      companyUrl: z.string().url(t("register.urlRequired")).or(z.literal("")),
      address: z.string().min(5, t("register.addressRequired")),
      contactNumber: z.string().min(6, t("register.contactRequired")),
      aboutYourself: z.string().min(20, t("register.aboutRequired")),
      interestedIn: z.array(z.string()).min(1, t("register.interestRequired")),
      howYouHeard: z.string().min(1, t("register.optionRequired")),
      passSelection: z.string().min(1, t("register.passRequired")),
      consent: z.literal(true, { message: t("register.consentRequired") }),
    })
    .superRefine((data, ctx) => {
      if (data.attendeeType === "Company" && data.companyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("register.companyRequired"),
          path: ["companyName"],
        });
      }
      if (data.attendeeType !== "Student" && data.designation.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("register.designationRequired"),
          path: ["designation"],
        });
      }
    });

type VisitorData = z.infer<ReturnType<typeof makeVisitorSchema>>;

const useVisitorPasses = (t: TFn) =>
  useMemo(
    () => [
      { id: "A", label: t("register.passA"), price: t("register.passAPrice") },
      { id: "B", label: t("register.passB"), price: t("register.passBPrice") },
      { id: "C", label: t("register.passC"), price: t("register.passCPrice") },
      { id: "D", label: t("register.passD"), price: t("register.passDPrice") },
    ],
    [t],
  );

// ─── Exhibitor schema ─────────────────────────────────────────────────────────

const makeExhibitorSchema = (t: TFn) =>
  z.object({
    name: z.string().min(2, t("register.nameRequired")),
    email: z.string().email(t("register.emailRequired")),
    companyName: z.string().min(2, t("register.companyRequired")),
    designation: z.string().min(2, t("register.designationRequired")),
    docType: z.string().min(1, t("register.docTypeRequired")),
    docNumber: z.string().min(3, t("register.docNumberRequired")),
    role: z.string().min(1, t("register.roleRequired")),
    buyerType: z.string().min(1, t("register.typeRequired")),
    companyUrl: z.string().url(t("register.urlRequired")).or(z.literal("")),
    country: z.string().min(2, t("register.countryRequired")),
    address: z.string().min(5, t("register.addressRequired")),
    phone: z.string().min(6, t("register.phoneRequired")),
    standOption: z.string().min(1, t("register.standRequired")),
    interestedIn: z.array(z.string()).min(1, t("register.interestRequired")),
    howYouHeard: z.string().min(1, t("register.optionRequired")),
    consent: z.literal(true, { message: t("register.consentRequired") }),
  });

type ExhibitorData = z.infer<ReturnType<typeof makeExhibitorSchema>>;

const useExhibitorRoles = (t: TFn) =>
  useMemo(
    () => [
      t("register.roleDecision"),
      t("register.roleAcct"),
      t("register.rolePM"),
      t("register.roleSales"),
      t("register.roleTech"),
      t("register.roleHR"),
      t("register.roleTrainer"),
      t("register.roleOther"),
    ],
    [t],
  );

const useBuyerTypes = (t: TFn) =>
  useMemo(
    () => [
      t("register.buyerBuyer"),
      t("register.buyerPurchaser"),
      t("register.buyerSpecifier"),
      t("register.buyerContractor"),
      t("register.buyerOther"),
    ],
    [t],
  );

const useStandOptions = (t: TFn) =>
  useMemo(
    () => [
      { id: "A", label: t("register.standA"), price: t("register.standAPrice") },
      { id: "B", label: t("register.standB"), price: t("register.standBPrice") },
      { id: "C", label: t("register.standC"), price: t("register.standCPrice") },
      { id: "D", label: t("register.standD"), price: t("register.standDPrice") },
    ],
    [t],
  );

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
  const { t } = useTranslation();
  const interestAreas = useInterestAreas(t);
  const toggle = (area: string) => {
    onChange(
      value.includes(area) ? value.filter((a) => a !== area) : [...value, area],
    );
  };
  return (
    <div>
      <Label className="mb-3 block">{t("register.interestedIn")}</Label>
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
  const { t } = useTranslation();
  return (
    <aside className="lg:col-span-4">
      <div className="lg:sticky lg:top-28">
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
          {type === "visitor"
            ? t("register.visitorSidebarEyebrow")
            : t("register.exhibitorSidebarEyebrow")}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
          {type === "visitor"
            ? t("register.visitorSidebarTitle")
            : t("register.exhibitorSidebarTitle")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {type === "visitor"
            ? t("register.visitorSidebarDesc")
            : t("register.exhibitorSidebarDesc")}
        </p>

        <Card className="p-5 bg-card mb-5 border-border">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t("home.dates")}</span>
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
  const { t } = useTranslation();
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
            {t("register.regSubmitted")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="text-lg text-muted-foreground mb-3"
          >
            {t("register.regSubmittedDesc")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="text-base text-muted-foreground mb-10 max-w-lg mx-auto"
          >
            {t("register.regSubmittedDesc2a")}
            <strong className="text-foreground">{t("register.regSubmittedBold")}</strong>
            {t("register.regSubmittedDesc2b")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/">
              <Button size="lg" className="h-12 px-8">
                {t("register.backToHome")}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8"
              onClick={onReset}
            >
              {t("register.submitAnother")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

// ─── Visitor form ─────────────────────────────────────────────────────────────

function VisitorForm({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const visitorSchema = useMemo(() => makeVisitorSchema(t), [t]);
  const visitorPasses = useVisitorPasses(t);
  const howYouHeardOptions = useHowYouHeardOptions(t);

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
        setSubmitError(json.message ?? t("register.submitFailed"));
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t("register.networkError"),
      );
    }
  };

  if (submitted) return <SuccessScreen onReset={onBack} />;

  const steps = [
    t("register.stepPersonal"),
    t("register.stepAdditional"),
    t("register.stepReview"),
  ];

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
                          {t("register.personalDetails")}
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label={t("register.fullName")}
                          error={form.formState.errors.name?.message}
                        >
                          <Input
                            {...form.register("name")}
                            placeholder={t("register.fullNamePlaceholder")}
                          />
                        </Field>
                        <Field
                          label={t("register.email")}
                          error={form.formState.errors.email?.message}
                        >
                          <Input
                            type="email"
                            {...form.register("email")}
                            placeholder="name@company.dk"
                          />
                        </Field>
                        <Field
                          label={t("register.attendeeType")}
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
                              <SelectValue placeholder={t("register.selectType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Company">{t("register.company")}</SelectItem>
                              <SelectItem value="Student">{t("register.student")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label={t("register.gender")}
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
                              <SelectValue placeholder={t("register.selectGender")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">{t("register.male")}</SelectItem>
                              <SelectItem value="Female">{t("register.female")}</SelectItem>
                              <SelectItem value="Prefer not to say">
                                {t("register.preferNot")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label={t("register.dob")}
                          error={form.formState.errors.dob?.message}
                        >
                          <Input
                            type="date"
                            {...form.register("dob")}
                            className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80"
                          />
                        </Field>
                        <Field
                          label={t("register.contactNumber")}
                          error={form.formState.errors.contactNumber?.message}
                        >
                          <Input
                            {...form.register("contactNumber")}
                            placeholder="+45 ..."
                          />
                        </Field>
                        <Field
                          label={t("register.docType")}
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
                              <SelectValue placeholder={t("register.selectDoc")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">{t("register.passport")}</SelectItem>
                              <SelectItem value="ID Card">{t("register.idCard")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label={t("register.docNumber")}
                          error={form.formState.errors.docNumber?.message}
                        >
                          <Input
                            {...form.register("docNumber")}
                            placeholder={t("register.docNumberPh")}
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
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          {t("register.continue")} <ArrowRight className="ml-2 w-4 h-4" />
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
                        {t("register.additionalInfo")}
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {isCompany && (
                          <Field
                            label={t("register.companyName")}
                            error={form.formState.errors.companyName?.message}
                          >
                            <Input
                              {...form.register("companyName")}
                              placeholder={t("register.companyNamePh")}
                            />
                          </Field>
                        )}
                        {!isStudent && (
                          <Field
                            label={t("register.designation")}
                            error={form.formState.errors.designation?.message}
                          >
                            <Input
                              {...form.register("designation")}
                              placeholder={t("register.designationPh")}
                            />
                          </Field>
                        )}
                        <Field
                          label={t("register.countryLabel")}
                          error={form.formState.errors.country?.message}
                        >
                          <Input {...form.register("country")} />
                        </Field>
                        {!isStudent && (
                          <Field
                            label={t("register.companyUrl")}
                            error={form.formState.errors.companyUrl?.message}
                          >
                            <Input
                              {...form.register("companyUrl")}
                              placeholder="https://www.company.dk"
                            />
                          </Field>
                        )}
                        <Field
                          label={t("register.addressLabel")}
                          error={form.formState.errors.address?.message}
                        >
                          <Input
                            {...form.register("address")}
                            placeholder={t("register.addressPh")}
                          />
                        </Field>
                      </div>
                      <Field
                        label={t("register.aboutYou")}
                        error={form.formState.errors.aboutYourself?.message}
                      >
                        <Textarea
                          {...form.register("aboutYourself")}
                          rows={5}
                          placeholder={t("register.aboutYouPh")}
                        />
                      </Field>
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          onClick={prev}
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          {t("register.continue")} <ArrowRight className="ml-2 w-4 h-4" />
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
                        {t("register.reviewSubmit")}
                      </h2>

                      {/* Review summary */}
                      <div className="space-y-3 rounded-lg border border-border p-5 bg-background">
                        <Row label={t("register.rowName")} v={form.watch("name")} />
                        <Row label={t("register.rowEmail")} v={form.watch("email")} />
                        <Row label={t("register.rowType")} v={form.watch("attendeeType")} />
                        {isCompany && (
                          <Row label={t("register.rowCompany")} v={form.watch("companyName")} />
                        )}
                        <Row label={t("register.rowGender")} v={form.watch("gender")} />
                        <Row label={t("register.rowDob")} v={form.watch("dob")} />
                        <Row label={t("register.rowDocType")} v={form.watch("docType")} />
                        <Row
                          label={t("register.rowDocNumber")}
                          v={form.watch("docNumber")}
                        />
                        {!isStudent && (
                          <Row
                            label={t("register.rowDesignation")}
                            v={form.watch("designation")}
                          />
                        )}
                        <Row label={t("register.rowContact")} v={form.watch("contactNumber")} />
                        <Row label={t("register.rowCountry")} v={form.watch("country")} />
                        <Row label={t("register.rowAddress")} v={form.watch("address")} />
                        {!isStudent && form.watch("companyUrl") && (
                          <Row label={t("register.rowWebsite")} v={form.watch("companyUrl")} />
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
                        label={t("register.howHeard")}
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
                            <SelectValue placeholder={t("register.selectOption")} />
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
                        <Label className="mb-3 block">{t("register.passSelection")}</Label>
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
                          {t("register.consentVisitor")}
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
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? t("register.sending")
                            : t("register.submitRegistration")}
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
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const exhibitorSchema = useMemo(() => makeExhibitorSchema(t), [t]);
  const exhibitorRoles = useExhibitorRoles(t);
  const buyerTypes = useBuyerTypes(t);
  const standOptions = useStandOptions(t);
  const howYouHeardOptions = useHowYouHeardOptions(t);

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
        setSubmitError(json.message ?? t("register.submitFailed"));
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t("register.networkError"),
      );
    }
  };

  if (submitted) return <SuccessScreen onReset={onBack} />;

  const steps = [
    t("register.stepContact"),
    t("register.stepStand"),
    t("register.stepReview"),
  ];

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
                          {t("register.contactInformation")}
                        </h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label={t("register.fullName")}
                          error={form.formState.errors.name?.message}
                        >
                          <Input
                            {...form.register("name")}
                            placeholder={t("register.fullNamePlaceholder")}
                          />
                        </Field>
                        <Field
                          label={t("register.email")}
                          error={form.formState.errors.email?.message}
                        >
                          <Input
                            type="email"
                            {...form.register("email")}
                            placeholder="name@company.dk"
                          />
                        </Field>
                        <Field
                          label={t("register.companyName")}
                          error={form.formState.errors.companyName?.message}
                        >
                          <Input
                            {...form.register("companyName")}
                            placeholder="e.g. Nordic BuildTech ApS"
                          />
                        </Field>
                        <Field
                          label={t("register.designation")}
                          error={form.formState.errors.designation?.message}
                        >
                          <Input
                            {...form.register("designation")}
                            placeholder="e.g. Sales Director"
                          />
                        </Field>
                        <Field
                          label={t("register.docType")}
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
                              <SelectValue placeholder={t("register.selectDoc")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">{t("register.passport")}</SelectItem>
                              <SelectItem value="ID Card">{t("register.idCard")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field
                          label={t("register.docNumber")}
                          error={form.formState.errors.docNumber?.message}
                        >
                          <Input
                            {...form.register("docNumber")}
                            placeholder={t("register.docNumberPh")}
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
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          {t("register.continue")} <ArrowRight className="ml-2 w-4 h-4" />
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
                        {t("register.standSelection")}
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field
                          label={t("register.yourRole")}
                          error={form.formState.errors.role?.message}
                        >
                          <Select
                            value={form.watch("role")}
                            onValueChange={(v) =>
                              form.setValue("role", v, { shouldValidate: true })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("register.selectRole")} />
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
                          label={t("register.buyerType")}
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
                              <SelectValue placeholder={t("register.selectType")} />
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
                          label={t("register.companyUrl")}
                          error={form.formState.errors.companyUrl?.message}
                        >
                          <Input
                            {...form.register("companyUrl")}
                            placeholder="https://www.company.dk"
                          />
                        </Field>
                        <Field
                          label={t("register.countryLabel")}
                          error={form.formState.errors.country?.message}
                        >
                          <Input {...form.register("country")} />
                        </Field>
                        <Field
                          label={t("register.phone")}
                          error={form.formState.errors.phone?.message}
                        >
                          <Input
                            {...form.register("phone")}
                            placeholder="+45 ..."
                          />
                        </Field>
                        <Field
                          label={t("register.addressLabel")}
                          error={form.formState.errors.address?.message}
                        >
                          <Input
                            {...form.register("address")}
                            placeholder={t("register.addressPh")}
                          />
                        </Field>
                      </div>

                      <div>
                        <Label className="mb-3 block">{t("register.standOption")}</Label>
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
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button type="button" size="lg" onClick={next}>
                          {t("register.continue")} <ArrowRight className="ml-2 w-4 h-4" />
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
                        {t("register.reviewSubmit")}
                      </h2>

                      <div className="space-y-3 rounded-lg border border-border p-5 bg-background">
                        <Row label={t("register.rowName")} v={form.watch("name")} />
                        <Row label={t("register.rowEmail")} v={form.watch("email")} />
                        <Row label={t("register.rowCompany")} v={form.watch("companyName")} />
                        <Row
                          label={t("register.rowDesignation")}
                          v={form.watch("designation")}
                        />
                        <Row label={t("register.rowDocType")} v={form.watch("docType")} />
                        <Row
                          label={t("register.rowDocNumber")}
                          v={form.watch("docNumber")}
                        />
                        <Row label={t("register.rowRole")} v={form.watch("role")} />
                        <Row label={t("register.rowBuyerType")} v={form.watch("buyerType")} />
                        <Row label={t("register.rowPhone")} v={form.watch("phone")} />
                        <Row label={t("register.rowCountry")} v={form.watch("country")} />
                        <Row label={t("register.rowAddress")} v={form.watch("address")} />
                        {form.watch("companyUrl") && (
                          <Row label={t("register.rowWebsite")} v={form.watch("companyUrl")} />
                        )}
                        <Row
                          label={t("register.rowStand")}
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
                        label={t("register.howHeard")}
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
                            <SelectValue placeholder={t("register.selectOption")} />
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
                          {t("register.consentExhibitor")}
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
                          <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.backBtn")}
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? t("register.sending")
                            : t("register.submitRegistration")}
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
  onBack,
}: {
  r: Registrant;
  onBack: () => void;
}) {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isDanish = (i18n.resolvedLanguage ?? i18n.language).startsWith("da");
  const pdfSrc = isDanish
    ? "/registration-confirmation-da.html"
    : "/registration-confirmation.html";

  const handlePrint = () => {
    const original = document.title;
    document.title = "NordByg Expo 2026 - REG Confirmation | Ref: NB2026-VIS-00847";
    iframeRef.current?.contentWindow?.print();
    setTimeout(() => { document.title = original; }, 1000);
  };

  return (
    <Layout>
      <div className="pt-24 pb-10 min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-5 max-w-5xl mx-auto">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.back")}
            </Button>
            <Button onClick={handlePrint}>
              {t("register.printPdf")}
            </Button>
          </div>

          {/* Iframe — prints only its own content via contentWindow.print() */}
          <div className="rounded-xl overflow-hidden max-w-5xl mx-auto">
            <iframe
              ref={iframeRef}
              src={pdfSrc}
              title="Registration Confirmation"
              className="w-full border-0"
              style={{ height: "auto", minHeight: "600px" }}
              onLoad={(e) => {
                const iframe = e.currentTarget;
                const doc = iframe.contentDocument;
                if (doc) {
                  iframe.style.height = doc.documentElement.scrollHeight + "px";
                }
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Verify badge lookup form ─────────────────────────────────────────────────

function VerifyBadge({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
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
      setError(t("register.notFound"));
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
              <ArrowLeft className="mr-2 w-4 h-4" /> {t("register.back")}
            </Button>

            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
                {t("register.verifyTopEyebrow")}
              </p>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                {t("register.downloadAlready")}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {t("register.verifyIntro")}
              </p>
            </div>

            <Card className="p-8 bg-card">
              <form onSubmit={handleLookup} className="space-y-5">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    {t("register.fullNameLabel")}
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder={t("register.fullNamePh")}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    {t("register.regNumberLabel")}
                  </Label>
                  <Input
                    value={regNumber}
                    onChange={(e) => {
                      setRegNumber(e.target.value);
                      setError("");
                    }}
                    placeholder={t("register.regNumberPh")}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full">
                  {t("register.findMe")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("register.noNumber")}{" "}
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
  const { t } = useTranslation();
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
              {t("register.eyebrow")}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
              {t("register.chooseTitle")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("register.chooseDesc")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Visitor card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <button
                onClick={() => setType("visitor")}
                className="w-full h-full text-left group"
              >
                <Card className="p-8 h-full flex flex-col border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{t("register.visitorTitle")}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t("register.visitorDesc")}
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground flex-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.visitorBullet1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.visitorBullet2")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.visitorBullet3")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    {t("register.visitorCta")}{" "}
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
              className="h-full"
            >
              <button
                onClick={() => setType("exhibitor")}
                className="w-full h-full text-left group"
              >
                <Card className="p-8 h-full flex flex-col border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <UserCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{t("register.exhibitorTitle")}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t("register.exhibitorDesc")}
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground flex-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.exhibitorBullet1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.exhibitorBullet2")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.exhibitorBullet3")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    {t("register.exhibitorCta")}{" "}
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
              className="h-full"
            >
              <button
                onClick={() => setType("verify")}
                className="w-full h-full text-left group"
              >
                <Card className="p-8 h-full flex flex-col border-border hover:border-primary/50 transition-all duration-300 group-hover:bg-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <BadgeCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    {t("register.verifyTitle")}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t("register.verifyDesc")}
                  </p>
                  <div className="space-y-2 mb-8 text-sm text-muted-foreground flex-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.verifyBullet1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.verifyBullet2")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t("register.verifyBullet3")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    {t("register.verifyCta")}{" "}
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
            {t("register.questions")}{" "}
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

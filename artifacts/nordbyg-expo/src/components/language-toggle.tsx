import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, type AppLanguage } from "@/lib/i18n";

interface LanguageToggleProps {
  className?: string;
}

const LABELS: Record<AppLanguage, string> = { da: "DA", en: "EN" };
const FULL: Record<AppLanguage, string> = { da: "Dansk", en: "English" };

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();
  const current = (
    SUPPORTED_LANGUAGES as readonly string[]
  ).includes(i18n.resolvedLanguage ?? "")
    ? (i18n.resolvedLanguage as AppLanguage)
    : "da";

  const change = (lng: AppLanguage) => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card/60 backdrop-blur-md p-1 ${className}`}
    >
      <Languages className="w-3.5 h-3.5 text-muted-foreground ml-2 mr-0.5" />
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => change(lng)}
            aria-pressed={active}
            title={`${t("common.switchTo")} ${FULL[lng]}`}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}

import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, MapPin, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/language-toggle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/exhibitors", label: t("nav.exhibitors") },
    { href: "/programme", label: t("nav.programme") },
    { href: "/visit", label: t("nav.visit") },
    { href: "/about", label: t("nav.about") },
  ];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("footer.subscribed"),
      description: t("footer.subscribedDesc"),
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-primary-foreground font-bold font-mono tracking-tighter">NB</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">NordByg <span className="text-primary">Expo</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                {t("nav.registration")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden z-50">
            <LanguageToggle />
            <button
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-6 text-2xl font-semibold mt-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <span className={`transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-8">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("nav.registration")}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
                  <span className="text-primary-foreground font-bold font-mono">NB</span>
                </div>
                <span className="text-xl font-bold tracking-tight">NordByg <span className="text-primary">Expo</span></span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs">
                {t("footer.tagline")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.quickLinks")}</h3>
              <ul className="space-y-3">
                <li><Link href="/exhibitors" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.exhibitorDirectory")}</Link></li>
                <li><Link href="/programme" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.conferenceProgramme")}</Link></li>
                <li><Link href="/visit" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.planVisit")}</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.aboutNordByg")}</Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.registration")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.contactInfo")}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Bella Center<br/>Center Boulevard 5<br/>2300 København S</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <span>{t("footer.eventDates")}</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:info@nordexpo.dk" className="hover:text-primary transition-colors">info@nordexpo.dk</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.newsletter")}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t("footer.newsletterDesc")}
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  required
                  className="bg-background border-border"
                />
                <Button type="submit" className="w-full">
                  {t("footer.subscribe")}
                </Button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>{t("footer.copyright")}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("footer.cookie")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

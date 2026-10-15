import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Users,
  MessageCircle,
  User,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  LogOut,
  X,
  EyeOff,
  Globe,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { useT, languages, type Lang } from "@/lib/i18n";
export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`avatar ${name === "Sofia" ? "coral" : name === "Daniel" ? "gold" : ""} ${className}`}
      aria-hidden="true"
    >
      {name === "Anonymous" ? <EyeOff size={15} /> : name.slice(0, 1)}
    </span>
  );
}
export function Header({ role }: { role?: "patient" | "professional" }) {
  const { state, update } = useDemo();
  const navigate = useNavigate();
  const t = useT();
  return (
    <header className={`site-header${role === "professional" ? " site-header-pro" : ""}`}>
      <div className="flex items-center">
        <Link to="/" className="wordmark">
          Bearny<span className="text-accent">.</span>
        </Link>
        <span className="role-label">
          {role === "professional"
            ? t("PROFESSIONAL DEMO")
            : role === "patient"
              ? t("PATIENT DEMO")
              : t("RESEARCH DEMO")}
        </span>
      </div>
      {role === "patient" && (
        <nav className="header-nav" aria-label={t("Main navigation")}>
          <Link to="/patient" activeOptions={{ exact: true }}>
            <Home size={16} />
            {t("Home")}
          </Link>
          <Link to="/patient/connect">
            <Users size={16} />
            {t("Connect")}
          </Link>
          <Link to="/patient/ask">
            <MessageCircle size={16} />
            {t("Ask Bearny")}
          </Link>
        </nav>
      )}
      <div className="header-end">
        {role ? (
          <div className="header-profile">
            <span className="text-sm muted header-name">
              {role === "patient" ? state.name : t("Research team")}
            </span>
            {role === "patient" ? (
              <Link to="/patient/profile" aria-label={t("Your profile")}>
                <Avatar name={state.name} />
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title={t("Log out")}
                aria-label={t("Log out")}
                onClick={() => {
                  update((s) => ({ ...s, role: null }));
                  navigate({ to: "/" });
                }}
              >
                <LogOut />
              </Button>
            )}
          </div>
        ) : (
          <span className="text-xs muted header-tagline">{t("A research demo, made for connection")}</span>
        )}
        <LanguageSwitch />
      </div>
    </header>
  );
}
export function LanguageSwitch() {
  const { state, update } = useDemo();
  const t = useT();
  return (
    <label className="lang-switch">
      <Globe size={16} aria-hidden="true" />
      <span className="sr-only">{t("Language")}</span>
      <select
        value={state.lang ?? "en"}
        onChange={(e) => {
          const lang = e.target.value as Lang;
          update((s) => ({ ...s, lang }));
        }}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Footer({ patient = false }: { patient?: boolean }) {
  const t = useT();
  return (
    <footer className={`research-footer ${patient ? "patient-footer" : ""}`}>
      <ShieldCheck size={13} />
      {t("Research demo · Fictional people and conversations · Not medical advice")}
    </footer>
  );
}
export function PatientLayout() {
  return (
    <RoleLayout role="patient">
      <Outlet />
    </RoleLayout>
  );
}
export function ProfessionalLayout() {
  const t = useT();
  return (
    <RoleLayout role="professional">
      <div className="professional-layout">
        <aside className="sidebar">
          <p className="sidebar-title">{t("Community workspace")}</p>
          <Link to="/professional" activeOptions={{ exact: true }}>
            <LayoutDashboard size={18} />
            {t("Workspace")}
          </Link>
          <Link to="/professional/moderation">
            <ShieldCheck size={18} />
            {t("Review community")}
          </Link>
          <Link to="/professional/answers">
            <BookOpen size={18} />
            {t("Bearny answers")}
          </Link>
          <Link to="/professional/feedback">
            <MessageSquare size={18} />
            {t("Patient feedback")}
          </Link>
        </aside>
        <div className="professional-main">
          <Outlet />
        </div>
      </div>
    </RoleLayout>
  );
}
function RoleLayout({ role, children }: { role: "patient" | "professional"; children: ReactNode }) {
  const { state, ready, update } = useDemo();
  const t = useT();
  if (!ready)
    return (
      <>
        <Header />
        <main className="page">
          <div className="skeleton w-48" />
          <div className="skeleton large" />
        </main>
      </>
    );
  if (state.role !== role)
    return (
      <>
        <Header />
        <main className="page narrow">
          <Back to="/" />
          <p className="eyebrow">{t("Your own space")}</p>
          <h1 className="page-title">
            {role === "patient" ? t("Enter the patient demo") : t("Professional workspace")}
          </h1>
          <p className="lead">
            {state.role
              ? t("Switching spaces ends your current role session. Your fictional demo content stays in this browser.")
              : t("Choose a demo role to continue. No personal health information is needed.")}
          </p>
          <Button className="mt-7" onClick={() => update((s) => ({ ...s, role }))}>
            {role === "patient" ? t("Enter patient demo") : t("Enter professional demo")}
            <ArrowRight />
          </Button>
        </main>
        <Footer />
      </>
    );
  return (
    <>
      <Header role={role} />
      {children}
      <Footer patient={role === "patient"} />
      {role === "patient" && (
        <nav className="bottom-nav" aria-label={t("Mobile navigation")}>
          <Link to="/patient" activeOptions={{ exact: true }}>
            <Home />
            {t("Home")}
          </Link>
          <Link to="/patient/connect">
            <Users />
            {t("Connect")}
          </Link>
          <Link to="/patient/ask">
            <MessageCircle />
            {t("Ask Bearny")}
          </Link>
          <Link to="/patient/profile">
            <User />
            {t("Profile")}
          </Link>
        </nav>
      )}
    </>
  );
}
export function Back({
  to,
  label = "Back",
}: {
  to:
    | "/"
    | "/patient"
    | "/patient/connect"
    | "/patient/community"
    | "/patient/groups"
    | "/professional";
  label?: string;
}) {
  const t = useT();
  return (
    <Button asChild variant="ghost" className="back">
      <Link to={to}>
        <ArrowLeft />
        {t(label)}
      </Link>
    </Button>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {description && <p className="lead">{description}</p>}
    </>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.querySelector<HTMLElement>("button,input,textarea")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && el) {
        const targets = Array.from(
          el.querySelectorAll<HTMLElement>("button,input,textarea,select,a[href]"),
        );
        const first = targets[0];
        const last = targets.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      before?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="modal">
        <div className="modal-title">
          <h2>{title}</h2>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label={t("Close dialog")}>
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p className="muted mb-5">{text}</p>
      {children}
    </div>
  );
}

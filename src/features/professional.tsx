import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Plus,
  Pencil,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemo, uid } from "@/lib/demo-store";
import { safety, respond, type Answer } from "@/lib/demo-data";
import { PageHeading, Empty, Modal } from "./shared";
import { useT } from "@/lib/i18n";

export function ProfessionalHome() {
  const rawT = useT();
  const t = (text: string, vars?: Record<string, string | number>) => rawT(text, vars) ?? text;
  const { state } = useDemo();
  const reports = state.threads.filter((th) => th.reported && !th.hidden);
  return (
    <main className="page professional-overview">
      <PageHeading eyebrow={t("Professional demo")} title={t("Professional workspace")} />
      <div className="workspace-summary">
        <ShieldCheck size={22} />
        <div>
          <strong>
            {reports.length
              ? t(reports.length === 1 ? "{n} discussion awaiting review" : "{n} discussions awaiting review", { n: reports.length })
              : t("No reports awaiting review")}
          </strong>
          <p className="muted text-sm">{t("Fictional research content · No patient records")}</p>
        </div>
      </div>
      <div className="session-activity" aria-label={t("Session activity")}>
        <span className="live-dot" aria-hidden="true" />
        <strong>{t("Current demonstration session")}</strong>
        <span>
          {t("{n} reported", { n: state.threads.filter((t) => t.reported).length })} ·{" "}
          {t("{n} hidden", { n: state.threads.filter((t) => t.hidden).length })} ·{" "}
          {t("{n} ratings", { n: state.feedback.length })} ·{" "}
          {t("{n} discussions", { n: state.threads.length })}
        </span>
        <span className="muted">{t("No real patient data")}</span>
      </div>
      <div className="workspace-tasks">
        <Link to="/professional/moderation" className="workspace-task">
          <span className="workspace-task-icon">
            <ShieldCheck />
          </span>
          <div>
            <h2>{t("Review community")}</h2>
            <p>{t("Reported and hidden discussions")}</p>
          </div>
          <span className="workspace-count">{t("{n} pending", { n: reports.length })}</span>
          <ArrowRight />
        </Link>
        <Link to="/professional/answers" className="workspace-task">
          <span className="workspace-task-icon">
            <Pencil />
          </span>
          <div>
            <h2>{t("Bearny answers")}</h2>
            <p>{t("Everyday responses · Safety answers protected")}</p>
          </div>
          <span className="workspace-count">{t("{n} answers", { n: state.answers.length })}</span>
          <ArrowRight />
        </Link>
        <Link to="/professional/feedback" className="workspace-task">
          <span className="workspace-task-icon">
            <ThumbsUp />
          </span>
          <div>
            <h2>{t("Patient feedback")}</h2>
            <p>{t("Responses rated helpful or not helpful")}</p>
          </div>
          <span className="workspace-count">{t("{n} ratings", { n: state.feedback.length })}</span>
          <ArrowRight />
        </Link>
      </div>
      <div className="safety-strip">
        <ShieldCheck size={18} />
        <p>
          <strong>{t("Everyday support, not clinical care.")}</strong>{" "}
          {t(
            "Medical concerns are referred to the care team; urgent concerns get emergency guidance (144). Safety answers cannot be edited.",
          )}
        </p>
      </div>
    </main>
  );
}

export function Moderation() {
  const rawT = useT();
  const t = (text: string, vars?: Record<string, string | number>) => rawT(text, vars) ?? text;
  const { state, update } = useDemo();
  const [view, setView] = useState("Reports");
  const list = state.threads.filter((t) =>
    view === "Reports" ? t.reported : view === "Hidden" ? t.hidden : true,
  );
  function change(id: string, action: "hide" | "restore" | "dismiss") {
    update((s) => ({
      ...s,
      threads: s.threads.map((t) =>
        t.id === id
          ? {
              ...t,
              ...(action === "dismiss" ? { reported: false } : { hidden: action === "hide" }),
            }
          : t,
      ),
    }));
    toast.success(
      action === "dismiss"
        ? t("Report dismissed.")
        : action === "hide"
          ? t("Discussion hidden from the patient community.")
          : t("Discussion restored to the patient community."),
    );
  }
  const viewLabels: Record<string, string> = {
    Reports: t("Reports"),
    Hidden: t("Hidden"),
    "All discussions": t("All discussions"),
  };
  return (
    <main className="page">
      <PageHeading
        eyebrow={t("Review community")}
        title={t("Community discussions")}
        description={t(
          "Review thoughtfully. Hidden discussions are immediately unavailable in the patient community.",
        )}
      />
      <div className="filter-tabs mt-7">
        {["Reports", "Hidden", "All discussions"].map((v) => (
          <Button
            key={v}
            variant="ghost"
            className={view === v ? "selected" : ""}
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            {viewLabels[v]}
          </Button>
        ))}
      </div>
      {list.length ? (
        list.map((th) => (
          <article className="professional-item" key={th.id}>
            <div className="flex justify-between gap-4 text-xs">
              <span className="category-tag">
                {t(th.category)} · {th.author}
              </span>
              <span className="muted">
                {th.hidden
                  ? t("Hidden")
                  : th.reported
                    ? t("Reported · Visible")
                    : t("Visible")}
              </span>
            </div>
            <h3>{t(th.title)}</h3>
            <p>{t(th.body)}</p>
            <div className="professional-item-actions">
              {th.hidden ? (
                <Button variant="outline" onClick={() => change(th.id, "restore")}>
                  <Eye />
                  {t("Restore discussion")}
                </Button>
              ) : (
                <Button variant="outline" onClick={() => change(th.id, "hide")}>
                  <EyeOff />
                  {t("Hide discussion")}
                </Button>
              )}
              {th.reported && (
                <Button variant="ghost" onClick={() => change(th.id, "dismiss")}>
                  <Check />
                  {t("Dismiss report")}
                </Button>
              )}
            </div>
          </article>
        ))
      ) : (
        <Empty title={t("Nothing waiting here.")} text={t("This part of the moderation queue is clear.")} />
      )}
    </main>
  );
}
export function AnswerLibrary() {
  const rawT = useT();
  const t = (text: string, vars?: Record<string, string | number>) => rawT(text, vars) ?? text;
  const { state, update } = useDemo();
  const [editing, setEditing] = useState<Answer | null>(null);
  const [preview, setPreview] = useState<Answer | null>(null);
  const [test, setTest] = useState("");
  return (
    <main className="page">
      <PageHeading
        eyebrow={t("Everyday encouragement")}
        title={t("Bearny answers")}
        description={t(
          "Shape clear, kind responses for the research demo. Safety responses remain protected.",
        )}
      />
      <div className="section-row">
        <span className="muted text-sm">
          {t("{n} editable responses · 2 protected safety responses", { n: state.answers.length })}
        </span>
        <Button
          onClick={() =>
            setEditing({ id: uid(), title: "", keywords: "", text: "", followups: [] })
          }
        >
          <Plus />
          {t("Add answer")}
        </Button>
      </div>
      <div className="answer-grid">
        {state.answers.map((a) => (
          <article className="answer-card" key={a.id}>
            <h3>{t(a.title)}</h3>
            <p>
              {t(a.text).slice(0, 160)}
              {a.text.length > 160 ? "…" : ""}
            </p>
            <div className="answer-tools">
              <span className="text-xs muted">
                {a.id === "unknown" ? t("Fallback response") : t("Prepared response")}
              </span>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  title={t("Preview {title}", { title: t(a.title) })}
                  aria-label={t("Preview {title}", { title: t(a.title) })}
                  onClick={() => {
                    setPreview(a);
                    setTest("");
                  }}
                >
                  <Eye />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t("Edit {title}", { title: t(a.title) })}
                  aria-label={t("Edit {title}", { title: t(a.title) })}
                  onClick={() => setEditing({ ...a })}
                >
                  <Pencil />
                </Button>
              </div>
            </div>
          </article>
        ))}
        {Object.entries(safety).map(([key, text]) => (
          <article className="answer-card" key={key}>
            <span className="category-tag flex items-center gap-2">
              <ShieldCheck size={15} />
              {t("Protected safety response")}
            </span>
            <h3 className="mt-4">
              {key === "medical"
                ? t("Personal medical questions")
                : t("Immediate danger & emergencies")}
            </h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
      {editing && (
        <Modal
          title={
            state.answers.some((a) => a.id === editing.id)
              ? t("Edit prepared answer")
              : t("Add prepared answer")
          }
          onClose={() => setEditing(null)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.title.trim() || !editing.text.trim()) return;
              update((s) => ({
                ...s,
                answers: s.answers.some((a) => a.id === editing.id)
                  ? s.answers.map((a) => (a.id === editing.id ? editing : a))
                  : [
                      ...s.answers.filter((a) => a.id !== "unknown"),
                      editing,
                      ...s.answers.filter((a) => a.id === "unknown"),
                    ],
              }));
              setEditing(null);
              toast.success(t("Prepared answer saved. New conversations use this response."));
            }}
          >
            <div>
              <label htmlFor="answer-title">{t("Title")}</label>
              <input
                id="answer-title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="keywords">{t("Match keywords (comma-separated)")}</label>
              <input
                id="keywords"
                value={editing.keywords}
                onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                required={editing.id !== "unknown"}
              />
            </div>
            <div>
              <label htmlFor="answer-text">{t("Prepared response")}</label>
              <textarea
                id="answer-text"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                required
                className="min-h-48"
              />
            </div>
            <div>
              <label htmlFor="followups">{t("Follow-up prompts (one per line)")}</label>
              <textarea
                id="followups"
                value={editing.followups.join("\n")}
                onChange={(e) => setEditing({ ...editing, followups: e.target.value.split("\n") })}
              />
            </div>
            <p className="muted text-xs">
              {t(
                "Everyday support only. This is not clinical approval. Safety always takes precedence over match keywords.",
              )}
            </p>
            <Button type="submit">
              <Check />
              {t("Save prepared answer")}
            </Button>
          </form>
        </Modal>
      )}
      {preview && (
        <Modal title={t("Prepared response preview")} onClose={() => setPreview(null)}>
          <h3 className="mb-4">{t(preview.title)}</h3>
          <div className="chat-preview">
            <p>{t(preview.text)}</p>
          </div>
          <form
            className="form-stack mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              const r = respond(test, state.answers);
              toast.info(
                r.intent === preview.id
                  ? t("This question matches this response.")
                  : t("This question matches: {title}.", {
                      title:
                        state.answers.find((a) => a.id === r.intent)?.title !== undefined
                          ? t(state.answers.find((a) => a.id === r.intent)!.title)
                          : r.intent === "medical"
                            ? t("Personal medical questions")
                            : t("Immediate danger & emergencies"),
                    }),
              );
            }}
          >
            <div>
              <label htmlFor="preview-test">{t("Check a sample question")}</label>
              <input
                id="preview-test"
                placeholder={t("Try a question…")}
                value={test}
                onChange={(e) => setTest(e.target.value)}
                required
              />
            </div>
            <Button variant="outline" type="submit">
              {t("Test matching")}
              <ArrowRight />
            </Button>
          </form>
        </Modal>
      )}
    </main>
  );
}
export function Feedback() {
  const rawT = useT();
  const t = (text: string, vars?: Record<string, string | number>) => rawT(text, vars) ?? text;
  const { state } = useDemo();
  const [filter, setFilter] = useState("All feedback");
  const list = state.feedback.filter(
    (f) => filter === "All feedback" || (filter === "Helpful" ? f.helpful : !f.helpful),
  );
  const filterLabels: Record<string, string> = {
    "All feedback": t("All feedback"),
    Helpful: t("Helpful"),
    "Not helpful": t("Not helpful"),
  };
  return (
    <main className="page">
      <PageHeading
        eyebrow={t("Listening & learning")}
        title={t("Patient feedback")}
        description={t(
          "Small signals that help make everyday support feel more useful. All feedback is from this demo session.",
        )}
      />
      <div className="filter-tabs mt-7">
        {["All feedback", "Helpful", "Not helpful"].map((f) => (
          <Button
            key={f}
            variant="ghost"
            className={filter === f ? "selected" : ""}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {filterLabels[f]}
          </Button>
        ))}
      </div>
      {list.length ? (
        list.map((f) => (
          <article className="professional-item" key={f.id}>
            <div className="flex items-center gap-2 text-sm text-primary">
              {f.helpful ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}{" "}
              {f.helpful ? t("Helpful") : t("Not helpful")}
              <span className="ml-auto muted text-xs">{f.time}</span>
            </div>
            <h3>{t(f.question)}</h3>
            <p>{t(f.text)}</p>
          </article>
        ))
      ) : (
        <Empty
          title={t("A little quiet, for now.")}
          text={t("Feedback shared in Ask Bearny will appear here. Try a conversation in the patient demo.")}
        />
      )}
    </main>
  );
}

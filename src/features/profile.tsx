import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { useT } from "@/lib/i18n";
import { Back, PageHeading, Avatar, Modal } from "./shared";

export function Profile() {
  const { state, update, reset } = useDemo();
  const navigate = useNavigate();
  const t = useT();
  const [name, setName] = useState(state.name);
  const [confirm, setConfirm] = useState(false);
  return (
    <main className="page narrow patient-page">
      <Back to="/patient" label={t("Home")} />
      <PageHeading
        eyebrow={t("Your profile")}
        title={t("Make yourself comfortable.")}
        description={t("Just a name and a few preferences. No diagnosis or medical details needed.")}
      />
      <div className="form-surface">
        <div className="author-line mb-7">
          <Avatar name={state.name} />
          <div>
            <strong>{state.name}</strong>
            <p className="text-xs muted">{t("Patient demo profile")}</p>
          </div>
        </div>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            update((s) => ({ ...s, name: name.trim() }));
            toast.success(t("Your name has been updated."));
          }}
        >
          <div>
            <label htmlFor="name">{t("Display name")}</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={40}
            />
          </div>
          <Button className="justify-self-start" type="submit">
            <Check />
            {t("Save name")}
          </Button>
        </form>
        <div className="settings-row">
          <div>
            <h3>{t("Larger text")}</h3>
            <p>{t("A little more room for reading.")}</p>
          </div>
          <label className="p-3">
            <span className="sr-only">{t("Larger text")}</span>
            <input
              type="checkbox"
              checked={state.largeText}
              onChange={(e) => update((s) => ({ ...s, largeText: e.target.checked }))}
            />
          </label>
        </div>
        <div className="settings-row">
          <div>
            <h3>{t("Reduced motion")}</h3>
            <p>{t("A calmer experience, without animations.")}</p>
          </div>
          <label className="p-3">
            <span className="sr-only">{t("Reduced motion")}</span>
            <input
              type="checkbox"
              checked={state.reducedMotion}
              onChange={(e) => update((s) => ({ ...s, reducedMotion: e.target.checked }))}
            />
          </label>
        </div>
        <div className="settings-row">
          <div>
            <h3>{t("Start the demo again")}</h3>
            <p>{t("Clear messages, discussions, saved items, edits, and feedback.")}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            title={t("Reset demo data")}
            aria-label={t("Reset demo data")}
            onClick={() => setConfirm(true)}
          >
            <RotateCcw />
          </Button>
        </div>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => {
            update((s) => ({ ...s, role: null }));
            navigate({ to: "/" });
          }}
        >
          <LogOut />
          {t("Log out")}
        </Button>
      </div>
      {confirm && (
        <Modal title={t("Reset all demo data?")} onClose={() => setConfirm(false)}>
          <p className="muted">
            {t(
              "This clears all community changes, group messages, conversation history, answer edits, and feedback. Your display name and accessibility preferences stay.",
            )}
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setConfirm(false)}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                reset();
                setConfirm(false);
                toast.success(t("Demo data reset. You’re ready to begin again."));
              }}
            >
              {t("Reset demo data")}
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}

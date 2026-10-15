import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Plus, Bookmark, Flag, Send, Check, ShieldCheck, Heart, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDemo, uid } from "@/lib/demo-store";
import { categories, type Thread } from "@/lib/demo-data";
import { useT } from "@/lib/i18n";
import { Back, PageHeading, Avatar, Modal, Empty } from "./shared";
export function Community() {
  const t = useT();
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All topics");
  const [saved, setSaved] = useState(false);
  const [sort, setSort] = useState<"latest" | "replies">("latest");
  const filtered = state.threads.filter(
    (th) =>
      !th.hidden &&
      (!saved || th.saved) &&
      (category === "All topics" || th.category === category) &&
      `${th.title} ${t(th.title)} ${th.body} ${t(th.body)} ${th.author}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) =>
    sort === "replies" ? b.replies.length - a.replies.length : 0,
  );
  const memberCount = 214;
  return (
    <main className="page patient-page community-page">
      <Back to="/patient/connect" label={t("Connect")} />
      <div className="community-banner">
        <div>
          <h1>{t("Bearny community")}</h1>
          <p>{t("Little wins, honest questions, and the comfort of a familiar story. Find a conversation that speaks to you.")}</p>
        </div>
        <Button asChild>
          <Link to="/patient/community/new">
            <Plus />
            {t("New discussion")}
          </Link>
        </Button>
      </div>
      <div className="community-layout">
        <div className="community-feed">
          <div className="feed-controls">
            <div className="search-field">
              <Search />
              <input
                aria-label={t("Search discussions")}
                placeholder={t("Search discussions…")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="feed-sort" role="group" aria-label={t("Sort discussions")}>
              {(["latest", "replies"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sort === key}
                  className={sort === key ? "on" : ""}
                  onClick={() => setSort(key)}
                >
                  {key === "latest" ? t("Latest") : t("Most replies")}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={saved}
                className={saved ? "on" : ""}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark size={14} />
                {t("Saved")}
              </button>
            </div>
          </div>
          <div className="topic-row" aria-label={t("Discussion topics")}>
            {["All topics", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? "on" : ""}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {t(c)}
              </button>
            ))}
          </div>
          {sorted.length ? (
            <div className="feed-list">
              {sorted.map((th) => (
                <ForumPost key={th.id} thread={th} />
              ))}
            </div>
          ) : (
            <Empty
              title={t("A little quiet here.")}
              text={
                saved
                  ? t("Save a discussion and you’ll find it here.")
                  : t("No discussions match your search. Try another word or topic.")
              }
            >
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("All topics");
                  setSaved(false);
                }}
              >
                {t("Show all discussions")}
              </Button>
            </Empty>
          )}
        </div>
        <aside className="community-aside">
          <section className="aside-card">
            <h2>{t("About this community")}</h2>
            <p>{t("A small, moderated space for everyday life after rehabilitation: routines, meals, motivation and company.")}</p>
            <dl className="aside-stats">
              <div>
                <dt>{t("Members")}</dt>
                <dd>{memberCount}</dd>
              </div>
              <div>
                <dt>{t("Discussions")}</dt>
                <dd>{state.threads.filter((th) => !th.hidden).length}</dd>
              </div>
            </dl>
          </section>
          <section className="aside-card">
            <h2>{t("House rules")}</h2>
            <ol className="rules">
              <li>{t("Be kind. Everyone is finding their own pace.")}</li>
              <li>{t("Share experiences, not medical or treatment advice.")}</li>
              <li>{t("Keep personal and health details private.")}</li>
              <li>{t("Report anything that doesn’t feel right.")}</li>
            </ol>
            <p className="aside-foot">
              <ShieldCheck size={14} /> {t("Moderated by the research team · Fictional members")}
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
export function ThreadDetail({ threadId }: { threadId: string }) {
  const t = useT();
  const { state, update } = useDemo();
  const [reply, setReply] = useState("");
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("Personal information");
  const thread = state.threads.find((t) => t.id === threadId);
  if (!thread || thread.hidden)
    return (
      <main className="page narrow patient-page">
        <Back to="/patient/community" />
        <Empty
          title={t("This conversation is unavailable.")}
          text={t("It may have been removed or hidden by the research moderator.")}
        >
          <Button asChild>
            <Link to="/patient/community">{t("Return to community")}</Link>
          </Button>
        </Empty>
      </main>
    );
  function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    update((s) => ({
      ...s,
      threads: s.threads.map((th) =>
        th.id === threadId
          ? {
              ...th,
              replies: [
                ...th.replies,
                {
                  id: uid(),
                  author: s.anonCommunity ? "Anonymous" : s.name,
                  text: reply.trim(),
                  time: "Just now",
                },
              ],
            }
          : th,
      ),
    }));
    setReply("");
    toast.success(t("Your reply is part of the conversation."));
  }
  return (
    <main className="page narrow patient-page">
      <Back to="/patient/community" label={t("Community")} />
      <article className="thread-detail">
        <span className="category-tag">{t(thread.category)}</span>
        <h1>{t(thread.title)}</h1>
        <div className="author-line">
          <Avatar name={thread.author} />
          <div>
            <strong>{thread.author === "Anonymous" ? t("Anonymous") : thread.author}</strong>
            <p className="text-xs muted">
              {t(thread.time)} · {thread.author === "Anonymous" ? t("Name hidden") : t("Fictional member")}
            </p>
          </div>
        </div>
        <p className="mt-6 leading-relaxed">{t(thread.body)}</p>
        <div className="thread-actions">
          <ResonateButton thread={thread} />
          <Button
            variant={thread.saved ? "secondary" : "outline"}
            aria-pressed={thread.saved}
            onClick={() => {
              update((s) => ({
                ...s,
                threads: s.threads.map((th) => (th.id === threadId ? { ...th, saved: !th.saved } : th)),
              }));
              toast.success(thread.saved ? t("Removed from saved discussions.") : t("Discussion saved."));
            }}
          >
            <Bookmark />
            {thread.saved ? t("Saved") : t("Save discussion")}
          </Button>
          <Button variant="ghost" onClick={() => setReport(true)}>
            <Flag />
            {thread.reported ? t("Report sent") : t("Report")}
          </Button>
        </div>
      </article>
      <div className="section-row">
        <h2>{t("{count} replies", { count: thread.replies.length })}</h2>
        <span className="muted text-xs">{t("A little kindness goes a long way")}</span>
      </div>
      <section aria-label={t("Replies")}>
        {thread.replies.map((r) => (
          <div className="reply" key={r.id}>
            <Avatar name={r.author} />
            <div>
              <span className="reply-name">{r.author === "Anonymous" ? t("Anonymous") : r.author}</span>
              {r.author === "Anonymous" && <span className="anon-tag">{t("Anonymized")}</span>}
              <span className="reply-time">{t(r.time)}</span>
              <p>{t(r.text)}</p>
            </div>
          </div>
        ))}
      </section>
      <form className="form-surface form-stack" onSubmit={submitReply}>
        <div>
          <label htmlFor="reply">{t("Add your voice")}</label>
          <textarea
            id="reply"
            placeholder={t("A friendly thought or a shared experience…")}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required
            maxLength={2000}
          />
        </div>
        <div className="anon-choice">
          <div>
            <strong>{t("Post anonymously")}</strong>
            <p className="text-xs muted">
              {(state.anonCommunity ?? false)
                ? t("Your reply appears as Anonymous.")
                : t("Your reply appears as {name}.", { name: state.name })}
            </p>
          </div>
          <Switch
            checked={state.anonCommunity ?? false}
            onCheckedChange={(v) => update((s) => ({ ...s, anonCommunity: v }))}
            aria-label={t("Post anonymously")}
          />
        </div>
        <div className="form-actions">
          <span className="text-xs muted">{t("Your reply stays in this demo session.")}</span>
          <Button type="submit">
            <Send />
            {t("Post reply")}
          </Button>
        </div>
      </form>
      {report && (
        <Modal
          title={thread.reported ? t("Report already received") : t("Report this discussion")}
          onClose={() => setReport(false)}
        >
          {thread.reported ? (
            <p className="muted">
              {t("The research moderation team can review this discussion. Thank you for helping keep this space welcoming.")}
            </p>
          ) : (
            <>
              <p className="muted mb-5">{t("What would you like the research moderator to review?")}</p>
              <label htmlFor="reason" className="text-sm">
                {t("Reason")}
              </label>
              <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="Personal information">{t("Personal information")}</option>
                <option value="Unkind or inappropriate content">{t("Unkind or inappropriate content")}</option>
                <option value="Medical or treatment advice">{t("Medical or treatment advice")}</option>
                <option value="Something else">{t("Something else")}</option>
              </select>
              <div className="modal-actions">
                <Button variant="outline" onClick={() => setReport(false)}>
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      threads: s.threads.map((th) =>
                        th.id === threadId ? { ...th, reported: true } : th,
                      ),
                    }));
                    setReport(false);
                    toast.success(t("Report received: {reason}.", { reason: t(reason) }));
                  }}
                >
                  <Check />
                  {t("Send report")}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </main>
  );
}
export function NewDiscussion() {
  const t = useT();
  const { state, update } = useDemo();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  return (
    <main className="page narrow patient-page">
      <Back to="/patient/community" />
      <PageHeading
        eyebrow={t("Start a conversation")}
        title={t("Your story belongs here.")}
        description={t("A question, a small win, or something you’ve noticed. There’s no perfect way to begin.")}
      />
      <form
        className="form-surface form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !body.trim()) return;
          const id = uid();
          update((s) => ({
            ...s,
            threads: [
              {
                id,
                title: title.trim(),
                body: body.trim(),
                category,
                author: (state.anonCommunity ?? false) ? "Anonymous" : state.name,
                time: "Just now",
                replies: [],
                saved: false,
                reported: false,
                hidden: false,
              },
              ...s.threads,
            ],
          }));
          toast.success(t("Your discussion is ready."));
          navigate({ to: "/patient/community/$threadId", params: { threadId: id } });
        }}
      >
        <div>
          <label htmlFor="category">{t("Choose a topic")}</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t(c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title">{t("Discussion title")}</label>
          <input
            id="title"
            placeholder={t("What would you like to talk about?")}
            required
            maxLength={140}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="body">{t("Your message")}</label>
          <textarea
            id="body"
            placeholder={t("Share a little of your everyday…")}
            required
            maxLength={4000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-48"
          />
        </div>
        <div className="anon-choice">
          <div>
            <strong>{t("Post anonymously")}</strong>
            <p className="text-xs muted">
              {(state.anonCommunity ?? false)
                ? t("This discussion appears as Anonymous.")
                : t("This discussion appears as {name}.", { name: state.name })}
            </p>
          </div>
          <Switch
            checked={state.anonCommunity ?? false}
            onCheckedChange={(v) => update((s) => ({ ...s, anonCommunity: v }))}
            aria-label={t("Post anonymously")}
          />
        </div>
        <p className="text-xs muted">
          {t("Please avoid sharing medical details or identifying information.")}
        </p>
        <div className="flex justify-end gap-3 flex-wrap">
          <Button asChild variant="outline">
            <Link to="/patient/community">{t("Cancel")}</Link>
          </Button>
          <Button type="submit">
            <Plus />
            {t("Post discussion")}
          </Button>
        </div>
      </form>
    </main>
  );
}
export function resonanceCount(thread: Thread) {
  const base = [...thread.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 17;
  return base + thread.replies.length * 2 + (thread.resonated ? 1 : 0);
}
export function ResonateButton({ thread, compact }: { thread: Thread; compact?: boolean }) {
  const t = useT();
  const { update } = useDemo();
  return (
    <button
      type="button"
      className={`resonate${compact ? " compact" : ""}${thread.resonated ? " on" : ""}`}
      aria-pressed={!!thread.resonated}
      aria-label={t("This resonated with me, {count}", { count: resonanceCount(thread) })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        update((s) => ({
          ...s,
          threads: s.threads.map((th) => (th.id === thread.id ? { ...th, resonated: !th.resonated } : th)),
        }));
      }}
    >
      <Heart size={16} />
      <span>{resonanceCount(thread)}</span>
      {!compact && <span className="resonate-label">{thread.resonated ? t("Resonated") : t("This resonated")}</span>}
    </button>
  );
}
export function ForumPost({ thread }: { thread: Thread }) {
  const t = useT();
  const { update } = useDemo();
  const author = thread.author === "Anonymous" ? t("Anonymous") : thread.author;
  return (
    <article className="forum-post">
      <ResonateButton thread={thread} compact />
      <div className="forum-main">
        <p className="forum-meta">
          <span className="forum-topic">{t(thread.category)}</span>
          <span aria-hidden="true">·</span>
          <span>{author}</span>
          <span aria-hidden="true">·</span>
          <span>{t(thread.time)}</span>
        </p>
        <h3>
          <Link to="/patient/community/$threadId" params={{ threadId: thread.id }} className="forum-link">
            {t(thread.title)}
          </Link>
        </h3>
        <p className="forum-preview">{t(thread.body)}</p>
        <div className="forum-actions">
          <Link to="/patient/community/$threadId" params={{ threadId: thread.id }}>
            <MessageSquare size={15} />
            {thread.replies.length === 1
              ? t("{count} reply", { count: 1 })
              : t("{count} replies", { count: thread.replies.length })}
          </Link>
          <button
            type="button"
            aria-pressed={thread.saved}
            onClick={() => {
              update((s) => ({
                ...s,
                threads: s.threads.map((th) => (th.id === thread.id ? { ...th, saved: !th.saved } : th)),
              }));
              toast.success(thread.saved ? t("Removed from saved discussions.") : t("Discussion saved."));
            }}
          >
            <Bookmark size={15} className={thread.saved ? "fill-current" : ""} />
            {thread.saved ? t("Saved") : t("Save")}
          </button>
        </div>
      </div>
    </article>
  );
}

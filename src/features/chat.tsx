import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Users,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Image,
  LogOut,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Check,
  Heart,
  ArrowLeft,
  CheckCheck,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useDemo, uid } from "@/lib/demo-store";
import { useT } from "@/lib/i18n";
import { groups, respond, type ChatMessage } from "@/lib/demo-data";
import { Back, PageHeading, Avatar, Modal, Empty } from "./shared";
import photo from "@/assets/community-cafe.jpg";
import wallpaper from "@/assets/group-wallpaper.jpg";
import breakfast from "@/assets/group-breakfast.jpg";
import soup from "@/assets/group-soup.jpg";
import lakeside from "@/assets/group-walk.jpg";
import balcony from "@/assets/group-balcony.jpg";

const demoPhotos = [
  {
    src: photo,
    alt: "Fictional photo of friends sharing coffee",
    caption: "A little coffee and company. ☕",
  },
  {
    src: breakfast,
    alt: "Fictional photo of coffee and a bread roll by a window",
    caption: "Coffee by the window. ☕",
  },
  {
    src: soup,
    alt: "Fictional photo of a pot of tomato soup with bread",
    caption: "Soup and bread. The classic.",
  },
  {
    src: lakeside,
    alt: "Fictional photo of a lakeside walking path",
    caption: "A short walk by the water.",
  },
  {
    src: balcony,
    alt: "Fictional photo of a small balcony with plants",
    caption: "The balcony this morning.",
  },
];
function Composer({
  onSend,
  image,
  onImage,
  placeholder = "Write a message…",
}: {
  onSend: (text: string) => void;
  image?: boolean;
  onImage?: () => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const t = useT();
  return (
    <div className="composer-wrap">
      <PromptInput
        onSubmit={({ text: message }) => {
          if (message.trim()) {
            onSend(message.trim());
            setText("");
          }
        }}
      >
        <PromptInputTextarea
          aria-label={t(placeholder)}
          placeholder={t(placeholder)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
        />
        <PromptInputFooter className="justify-between">
          <span className="text-xs muted">
            {image ? (
              <Button
                variant="ghost"
                size="icon"
                title={t("Share demo photo")}
                aria-label={t("Share demo photo")}
                onClick={onImage}
              >
                <Image />
              </Button>
            ) : text.trim() ? (
              t("You’re typing…")
            ) : (
              t("A little space to talk.")
            )}
          </span>
          <PromptInputSubmit aria-label={t("Send message")} status="ready" disabled={!text.trim()}>
            <Send />
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
function ChatBubble({
  message,
  children,
  group = false,
}: {
  message: ChatMessage;
  children?: React.ReactNode;
  group?: boolean;
}) {
  const t = useT();
  return (
    <Message from={message.role} className={message.intent === "emergency" ? "emergency" : ""}>
      <MessageContent className="message-bubble">
        {message.name && <span className="message-name">{t(message.name)}</span>}
        {message.image && (
          <img
            src={message.image}
            loading="lazy"
            alt={t("Demo photo shared in this simulated group")}
            className="w-64 max-w-full rounded-md"
          />
        )}
        {message.role === "assistant" ? (
          <MessageResponse>{t(message.text)}</MessageResponse>
        ) : (
          <p>{t(message.text)}</p>
        )}
        {message.time && (
          <span className="message-time">
            {t(message.time)}
            {group && message.role === "user" && <CheckCheck size={15} aria-label={t("Sent in demo")} />}
          </span>
        )}
      </MessageContent>
      {children}
    </Message>
  );
}
export function GroupDirectory() {
  const t = useT();
  const { state } = useDemo();
  return (
    <main className="page narrow patient-page">
      <Back to="/patient/connect" label="Connect" />
      <PageHeading
        eyebrow={t("Group chats")}
        title={t("A group that feels like you.")}
        description={t("Familiar faces. Everyday conversations. Choose a little circle and see what everyone’s talking about.")}
      />
      <div className="notice">
        <ShieldCheck size={20} />
        <p>
          {t("Simulated WhatsApp-style groups. Not connected to WhatsApp. Messages and members are fictional.")}
        </p>
      </div>
      <div className="choice-grid">
        {groups.map((g) => (
          <article className="group-card" key={g.id}>
            <span className="category-tag">{t(g.topic)}</span>
            <h2>{t(g.name)}</h2>
            <p>{t(g.description)}</p>
            <div className="people-preview">
              <div className="avatar-stack">
                {g.members.map((n) => (
                  <Avatar key={n} name={n} />
                ))}
              </div>
              <span className="text-xs muted">{t("{n} fictional members", { n: g.members.length })}</span>
            </div>
            <div className="group-meta">
              <MessageCircle size={15} />
              {t(g.note)}
            </div>
            <Button
              asChild
              variant={state.joined.includes(g.id) ? "secondary" : "default"}
              className="w-full"
            >
              <Link to="/patient/groups/$id" params={{ id: g.id }}>
                {state.joined.includes(g.id) ? "Open group" : t("Meet the group")}
                <ArrowRight />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}
export function GroupChat({ id }: { id: string }) {
  const t = useT();
  const { state, update } = useDemo();
  const navigate = useNavigate();
  const group = groups.find((g) => g.id === id);
  const [members, setMembers] = useState(false);
  const [leave, setLeave] = useState(false);
  const [share, setShare] = useState(false);
  const [pick, setPick] = useState(0);
  const [draft, setDraft] = useState("");
  const [joinAnon, setJoinAnon] = useState(false);
  if (!group)
    return (
      <main className="page patient-page">
        <Back to="/patient/groups" />
        <Empty
          title={t("We couldn’t find that group.")}
          text={t("Find your circle in the group directory.")}
        />
      </main>
    );
  const joined = state.joined.includes(id);
  const anon = (state.anonGroups ?? []).includes(id);
  function send(text: string, image?: string) {
    const message: ChatMessage = {
      id: uid(),
      role: "user",
      name: anon ? "Anonymous" : state.name,
      text,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      ...(image ? { image } : {}),
    };
    update((s) => ({
      ...s,
      groupMessages: { ...s.groupMessages, [id]: [...(s.groupMessages[id] ?? []), message] },
    }));
    toast.success(image ? "Demo photo shared." : t("Message sent."));
  }
  return (
    <main className={`page narrow patient-page ${joined ? "group-chat-page" : ""}`}>
      {!joined && <Back to="/patient/groups" label="Groups" />}
      {!joined ? (
        <>
          <PageHeading
            eyebrow={t("Before you join")}
            title={t(group.name)}
            description={t(group.description)}
          />
          <div className="form-surface">
            <div className="flex gap-3 items-center mb-5">
              <ShieldCheck className="text-primary" />
              <h2 className="text-xl">{t("A quick note on privacy")}</h2>
            </div>
            <p className="muted">
              {t("This is a simulated group, not a real WhatsApp chat. No phone number is requested and nothing is sent to WhatsApp.")}
            </p>
            <ul className="my-5 pl-5 list-disc space-y-3 text-sm">
              <li>
                {joinAnon ? (
                  <>
                    {t("You’ll appear as Anonymous — your name stays hidden.")}
                  </>
                ) : (
                  <>
                    {t("You’ll appear as {name} alongside fictional members.", { name: state.name })}
                  </>
                )}
              </li>
              <li>{t("Messages stay in this browser session.")}</li>
              <li>{t("Avoid sharing health details or private information.")}</li>
              <li>{t("You can leave the group at any time.")}</li>
            </ul>
            <div className="people-preview mb-6">
              <div className="avatar-stack">
                {group.members.map((n) => (
                  <Avatar key={n} name={n} />
                ))}
              </div>
              <span className="text-xs muted">{group.members.join(", ")}</span>
            </div>
            <div className="anon-choice mb-6">
              <div>
                <strong>{t("Join anonymized")}</strong>
                <p className="text-xs muted">
                  {t("When on, your messages show “Anonymous” instead of your name.")}
                </p>
              </div>
              <Switch
                checked={joinAnon}
                onCheckedChange={setJoinAnon}
                aria-label={t("Join anonymized")}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                update((s) => ({
                  ...s,
                  joined: [...s.joined, id],
                  anonGroups:
                    joinAnon && !s.anonGroups.includes(id) ? [...s.anonGroups, id] : s.anonGroups,
                }));
                toast.success(t("Welcome to {name}.", { name: t(group.name) }));
              }}
            >
              <Check />
              {t("Join simulated group")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="group-demo-label">
            <ShieldCheck size={13} /> {t("Simulated WhatsApp-style group · Not connected to WhatsApp")}
          </p>
          <div className="group-chat whatsapp-chat">
            <div className="chat-header">
              <Button asChild variant="ghost" size="icon" aria-label={t("Back to groups")}>
                <Link to="/patient/groups">
                  <ArrowLeft />
                </Link>
              </Button>
              <span className="avatar">
                <Users size={19} />
              </span>
              <div>
                <h2>{t(group.name)}</h2>
                <small>
                  {anon
                    ? t("Anonymized · You appear as Anonymous")
                    : t("Name shown · You appear as {name}", { name: state.name })}
                </small>
              </div>
              <div className="chat-controls">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("View members")}
                  title={t("View members")}
                  onClick={() => setMembers(true)}
                >
                  <Users />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("Leave group")}
                  title={t("Leave group")}
                  onClick={() => setLeave(true)}
                >
                  <LogOut />
                </Button>
              </div>
            </div>
            <div className="whatsapp-history">
              <img
                className="chat-wallpaper"
                src={wallpaper}
                width={1024}
                height={1024}
                alt=""
                aria-hidden="true"
              />
              <Conversation
                className="chat-transcript"
                initial={state.reducedMotion ? "instant" : "smooth"}
                resize={state.reducedMotion ? "instant" : "smooth"}
              >
                <ConversationContent>
                  <div className="chat-date">{t("Today")}</div>
                  {(state.groupMessages[id] ?? []).map((m) => (
                    <ChatBubble key={m.id} message={m} group />
                  ))}
                  <ConversationScrollButton />
                </ConversationContent>
              </Conversation>
            </div>
            <form
              className="whatsapp-composer"
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                send(draft.trim());
                setDraft("");
              }}
            >
              <div className="whatsapp-input">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("Share demo photo")}
                  title={t("Share demo photo")}
                  onClick={() => setShare(true)}
                >
                  <Paperclip />
                </Button>
                <textarea
                  aria-label={t("Write a message…")}
                  placeholder={t("Type a message")}
                  rows={1}
                  maxLength={2000}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim()}
                aria-label={t("Send message")}
                title={t("Send message")}
              >
                <Send />
              </Button>
            </form>
          </div>
        </>
      )}
      {members && (
        <Modal title={t("Your little circle")} onClose={() => setMembers(false)}>
          <p className="muted text-sm mb-3">
            {t("Everyone here is fictional, apart from your demo profile.")}
          </p>
          {[...group.members, anon ? "Anonymous" : state.name].map((n) => (
            <div className="member" key={n}>
              <Avatar name={n} />
              <span>
                {t(n)}
                {(anon && n === t("Anonymous")) || (!anon && n === state.name) ? t(" (you)") : ""}
              </span>
              <span className="ml-auto text-xs muted">
                {n === t("Anonymous")
                  ? t("You · name hidden")
                  : n === state.name
                    ? t("Demo profile")
                    : t("Fictional member")}
              </span>
            </div>
          ))}
          <div className="anon-choice mt-5">
            <div>
              <strong>{t("Anonymized in this group")}</strong>
              <p className="text-xs muted">
                {t("Applies to your next messages. Earlier messages keep the name they were sent with.")}
              </p>
            </div>
            <Switch
              checked={anon}
              onCheckedChange={(v) =>
                update((s) => ({
                  ...s,
                  anonGroups: v ? [...s.anonGroups, id] : s.anonGroups.filter((g) => g !== id),
                }))
              }
              aria-label={t("Anonymized in this group")}
            />
          </div>
        </Modal>
      )}
      {leave && (
        <Modal title={t("Leave this group?")} onClose={() => setLeave(false)}>
          <p className="muted">
            {t("You can rejoin any time. Your demo messages will remain in this session.")}
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setLeave(false)}>
              {t("Stay here")}
            </Button>
            <Button
              onClick={() => {
                update((s) => ({ ...s, joined: s.joined.filter((g) => g !== id) }));
                setLeave(false);
                toast.success(t("You’ve left the group."));
                navigate({ to: "/patient/groups" });
              }}
            >
              {t("Leave group")}
            </Button>
          </div>
        </Modal>
      )}
      {share && (
        <Modal title={t("Share a demo photo")} onClose={() => setShare(false)}>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t("Choose a demo photo")}>
            {demoPhotos.map((p, i) => (
              <button
                key={p.caption}
                type="button"
                role="radio"
                aria-checked={pick === i}
                onClick={() => setPick(i)}
                className={`rounded-xl border-2 p-1.5 text-left transition-colors ${
                  pick === i ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={p.src} alt={t(p.alt)} loading="lazy" className="w-full rounded-md" />
                <span className="mt-1 block text-xs muted">{t(p.caption)}</span>
              </button>
            ))}
          </div>
          <p className="text-sm muted mt-4">
            {t("Built-in fictional photos only — no personal uploads, nothing leaves this session.")}
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShare(false)}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                const chosen = demoPhotos[pick];
                if (chosen) send(chosen.caption, chosen.src);
                setShare(false);
              }}
            >
              <Image />
              {t("Share photo")}
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
export const quickPrompts = [
  "Give me a small routine idea",
  "How can I stay motivated?",
  "Help me connect with someone",
];
export function AskBearny() {
  const t = useT();
  const { state, update } = useDemo();
  const [reset, setReset] = useState(false);
  function send(text: string) {
    const result = respond(text, state.answers);
    update((s) => ({
      ...s,
      chat: [
        ...s.chat,
        { id: uid(), role: "user", text },
        {
          id: uid(),
          role: "assistant",
          text: result.text,
          intent: result.intent,
        },
      ],
    }));
  }
  const last = state.chat.at(-1);
  const lastUser = [...state.chat].reverse().find((m) => m.role === "user");
  const followups =
    last?.role === "assistant" && last.intent && lastUser
      ? respond(lastUser.text, state.answers).followups
      : [];
  function rate(m: ChatMessage, helpful: boolean) {
    const index = state.chat.findIndex((c) => c.id === m.id);
    const question = state.chat[index - 1]?.text ?? "Greeting";
    update((s) => ({
      ...s,
      feedback: [
        ...s.feedback.filter((f) => f.id !== m.id),
        { id: m.id, text: m.text, question, helpful, time: "Just now" },
      ],
    }));
    toast.success(t("Thank you. Your feedback has been saved."));
  }
  return (
    <main className="page patient-page">
      <Back to="/patient" label="Home" />
      <PageHeading
        eyebrow={t("Ask Bearny")}
        title={t("A little space to talk.")}
        description={t("Everyday questions. Gentle encouragement. One thought at a time.")}
      />
      <div className="ask-layout">
        <section className="group-chat ask-chat">
          <div className="chat-header">
            <div>
              <h2>Bearny</h2>
              <small>{t("Your everyday companion")}</small>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              title={t("Reset conversation")}
              aria-label={t("Reset conversation")}
              onClick={() => setReset(true)}
            >
              <RotateCcw />
            </Button>
          </div>
          <Conversation
            className="chat-transcript"
            initial={state.reducedMotion ? "instant" : "smooth"}
            resize={state.reducedMotion ? "instant" : "smooth"}
          >
            <ConversationContent>
              {state.chat.map((m) => (
                <ChatBubble key={m.id} message={m}>
                  {m.role === "assistant" && m.id !== "greeting" && (
                    <div className="feedback-actions">
                      <span>{t("Was this helpful?")}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("Helpful")}
                        aria-label={t("Helpful")}
                        className={
                          state.feedback.some((f) => f.id === m.id && f.helpful) ? "chosen" : ""
                        }
                        aria-pressed={state.feedback.some((f) => f.id === m.id && f.helpful)}
                        onClick={() => rate(m, true)}
                      >
                        <ThumbsUp size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("Not helpful")}
                        aria-label={t("Not helpful")}
                        className={
                          state.feedback.some((f) => f.id === m.id && !f.helpful) ? "chosen" : ""
                        }
                        aria-pressed={state.feedback.some((f) => f.id === m.id && !f.helpful)}
                        onClick={() => rate(m, false)}
                      >
                        <ThumbsDown size={15} />
                      </Button>
                    </div>
                  )}
                </ChatBubble>
              ))}
              {followups.length > 0 && (
                <div className="followups" aria-label={t("Follow-up suggestions")}>
                  {followups.map((p) => (
                    <Button key={p} variant="outline" onClick={() => send(p)}>
                      {t(p)}
                      <ArrowRight size={12} />
                    </Button>
                  ))}
                </div>
              )}
              <ConversationScrollButton />
            </ConversationContent>
          </Conversation>
          <Composer onSend={send} placeholder={t("What’s on your mind?")} />
        </section>
        <aside className="ask-aside">
          <h3>{t("A gentle place to start")}</h3>
          {quickPrompts.map((p, i) => (
            <Button key={p} variant="outline" className="prompt-chip" onClick={() => send(p)}>
              {i === 0 ? <SunIcon /> : i === 1 ? <Heart size={16} /> : <Users size={16} />} {t(p)}
            </Button>
          ))}
          <div className="aside-note border-t border-border mt-6 pt-5">
            <ShieldCheck size={22} className="text-primary" />
            <h3 className="mt-4">{t("Everyday support, not medical advice.")}</h3>
            <p>
              {t("For questions about your health or treatment, your care team is the right place to turn.")}
            </p>
            <p className="text-xs">{t("Research demo · Prepared responses · No generative AI")}</p>
          </div>
        </aside>
      </div>
      {reset && (
        <Modal title={t("Start a fresh conversation?")} onClose={() => setReset(false)}>
          <p className="muted">
            {t("Your messages will be cleared. Feedback you’ve shared stays saved for this demo session.")}
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setReset(false)}>
              {t("Keep chatting")}
            </Button>
            <Button
              onClick={() => {
                update((s) => ({
                  ...s,
                  chat: [
                    {
                      id: "greeting",
                      role: "assistant",
                      text: "Hi, I’m Bearny. A little encouragement, a fresh perspective, or just a place to start — what’s on your mind today?",
                    },
                  ],
                }));
                setReset(false);
                toast.success("A fresh start.");
              }}
            >
              {t("Reset conversation")}
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
function SunIcon() {
  return <MessageCircle size={16} />;
}

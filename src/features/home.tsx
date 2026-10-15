import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Heart,
  ShieldCheck,
  Sun,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { useT } from "@/lib/i18n";
import photo from "@/assets/community-cafe.jpg";
import { Header, Footer, Avatar, PageHeading, Back } from "./shared";
import type { Thread } from "@/lib/demo-data";

export function Landing() {
  const { update, ready } = useDemo();
  const navigate = useNavigate();
  const t = useT();
  function enter(role: "patient" | "professional") {
    update((s) => ({ ...s, role }));
    navigate({ to: role === "patient" ? "/patient" : "/professional" });
  }
  return (
    <>
      <Header />
      <main className="page landing-page">
        <section className="hero rounded-lg">
          <img
            src={photo}
            width={1536}
            height={1024}
            alt={t("Friends sharing a warm conversation over coffee in Zürich")}
          />
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {t("A little connection goes a long way")}
            </div>
            <h1>
              Bearny
              <br />
              {t("Life feels better")}
              <br />
              {t("with a little company.")}
            </h1>
            <p>
              {t(
                "A place to find people who understand, share the everyday, and take your next small step.",
              )}
            </p>
          </div>
        </section>
        <div className="section-row">
          <h2>{t("Choose your demo")}</h2>
          <span className="text-xs muted hidden sm:inline">
            {t("Two separate spaces. One Bearny.")}
          </span>
        </div>
        <div className="feature-grid role-grid">
          <article className="feature">
            <div className="feature-body">
              <div className="feature-label">
                <Heart size={20} /> {t("YOUR EVERYDAY SPACE")}
              </div>
              <h2>{t("Patient demo")}</h2>
              <p>{t("A little connection and encouragement, at your own pace.")}</p>
              <PeoplePreview />
            </div>
            <Button
              className="role-card-action"
              size="lg"
              disabled={!ready}
              onClick={() => enter("patient")}
            >
              {t("Enter patient demo")} <ArrowRight />
            </Button>
          </article>
          <article className="feature">
            <div className="feature-body">
              <div className="feature-label">
                <ShieldCheck size={20} /> {t("COMMUNITY CARE")}
              </div>
              <h2>{t("Professional demo")}</h2>
              <p>{t("Community moderation, Bearny’s prepared answers, and patient feedback.")}</p>
              <div className="role-preview">
                <ShieldCheck size={18} />
                <span>{t("Research team workspace")}</span>
              </div>
            </div>
            <Button
              className="role-card-action"
              size="lg"
              disabled={!ready}
              onClick={() => enter("professional")}
            >
              {t("Enter professional demo")} <ArrowRight />
            </Button>
          </article>
        </div>
        <div className="intro-band">
          <div>
            <Heart size={22} className="text-coral" />
            <h3>{t("Human, not clinical")}</h3>
            <p>{t("A little support for the everyday moments that matter.")}</p>
          </div>
          <div>
            <Users size={22} className="text-primary" />
            <h3>{t("Choose how you connect")}</h3>
            <p>{t("A wider community or a smaller circle. It’s up to you.")}</p>
          </div>
          <div>
            <ShieldCheck size={22} className="text-gold" />
            <h3>{t("A safe space to explore")}</h3>
            <p>{t("A fictional research demo. No personal health details needed.")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PeoplePreview() {
  const t = useT();
  return (
    <div className="people-preview">
      <div className="avatar-stack">
        {["Mira", "Daniel", "Sofia", "Alex"].map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </div>
      <span className="text-xs muted">{t("A few friendly faces, already here")}</span>
    </div>
  );
}

export function ThreadRow({ thread }: { thread: Thread }) {
  const t = useT();
  return (
    <Link
      to="/patient/community/$threadId"
      params={{ threadId: thread.id }}
      className="community-row"
    >
      <Avatar name={thread.author} />
      <div className="row-main">
        <span className="category-tag">{thread.category}</span>
        <h3>{thread.title}</h3>
        <small>
          {thread.author} · {thread.time}
        </small>
      </div>
      <span className="reply-count">
        <MessageSquare size={14} />
        {t("{count} replies", { count: thread.replies.length })}
      </span>
      <ArrowRight size={16} className="text-primary" />
    </Link>
  );
}

export function PatientHome() {
  const { state } = useDemo();
  const t = useT();
  return (
    <main className="page patient-page">
      <div className="welcome">
        <div>
          <p className="eyebrow">{t("A little space for you")}</p>
          <h1>{t("Hello, {name}.", { name: state.name })}</h1>
          <p className="muted text-sm">{t("You don’t have to do the everyday alone.")}</p>
        </div>
        <span className="date-note">
          <Sun size={18} className="text-gold" />
          {t("One small step at a time")}
        </span>
      </div>
      <section className="hero home-hero">
        <img
          src={photo}
          width={1536}
          height={1024}
          alt={t("Four friends enjoying a conversation in a sunny café")}
        />
        <div className="hero-copy">
          <div className="eyebrow">{t("Together feels a little lighter")}</div>
          <h1>
            {t("A familiar story.")}
            <br />
            {t("A friendly conversation.")}
          </h1>
          <p>
            {t(
              "Find a moment of connection, encouragement, or simply a little company. At your own pace.",
            )}
          </p>
          <div className="hero-tag">
            <Check size={14} />
            {t("You’re welcome, just as you are.")}
          </div>
        </div>
      </section>
      <div className="section-row">
        <h2>{t("What would feel good today?")}</h2>
        <span className="text-xs muted hidden sm:inline">
          {t("Two ways to find a little support")}
        </span>
      </div>
      <div className="feature-grid" data-testid="home-features">
        <Link to="/patient/connect" className="feature">
          <div className="feature-body">
            <div className="feature-label">
              <Users size={18} />
              {t("CONNECTION")}
            </div>
            <h2>{t("Connect with others")}</h2>
            <p>
              {t(
                "Real-life moments, shared experiences. Find your people in a community discussion or a smaller group.",
              )}
            </p>
            <PeoplePreview />
          </div>
          <div className="feature-bottom">
            <span>{t("Connect with others")}</span>
            <ArrowRight size={18} />
          </div>
        </Link>
        <Link to="/patient/ask" className="feature">
          <div className="feature-body">
            <div className="feature-label">
              <MessageCircle size={18} />
              {t("ENCOURAGEMENT")}
            </div>
            <h2>{t("Ask Bearny")}</h2>
            <p>{t("A question, a quiet thought, a little nudge forward. There’s a place to start.")}</p>
            <div className="chat-preview">
              <small>Bearny</small>
              <p>{t("What’s one small thing that could make today feel a little better?")}</p>
              <div className="mini-prompts">
                <span>{t("Everyday routines")}</span>
                <span>{t("A little motivation")}</span>
              </div>
            </div>
          </div>
          <div className="feature-bottom">
            <span>{t("Ask Bearny")}</span>
            <ArrowRight size={18} />
          </div>
        </Link>
      </div>
      <div className="section-row">
        <h2>{t("Around the community")}</h2>
        <Button asChild variant="link">
          <Link to="/patient/community">
            {t("See all")}
            <ArrowRight />
          </Link>
        </Button>
      </div>
      {state.threads
        .filter((t) => !t.hidden)
        .slice(0, 2)
        .map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
    </main>
  );
}

export function ConnectChoice() {
  const t = useT();
  return (
    <main className="page narrow patient-page">
      <Back to="/patient" label={t("Home")} />
      <PageHeading
        eyebrow={t("Connect with others")}
        title={t("Find your kind of company.")}
        description={t(
          "Some days you want to share a story. Other days, a simple hello is enough. Choose the space that feels right for you.",
        )}
      />
      <div className="choice-grid">
        <article className="choice-card">
          <div className="choice-top">
            <div className="choice-icon">
              <Users size={28} />
            </div>
            <span className="sim-tag">{t("Inside Bearny")}</span>
          </div>
          <h2>{t("Bearny Community")}</h2>
          <p>
            {t(
              "A welcoming place for stories, questions, and everyday moments. Browse at your own pace, or start a conversation.",
            )}
          </p>
          <ul>
            <li>{t("Discussions organised by topic")}</li>
            <li>{t("Share a story or reply to someone")}</li>
            <li>{t("Save conversations to come back to")}</li>
          </ul>
          <Button asChild className="w-full choice-action">
            <Link to="/patient/community">
              {t("Explore the community")}
              <ArrowRight />
            </Link>
          </Button>
        </article>
        <article className="choice-card">
          <div className="choice-top">
            <div className="choice-icon">
              <MessageCircle size={28} />
            </div>
            <span className="sim-tag">{t("Simulated WhatsApp-style")}</span>
          </div>
          <h2>{t("Group chats")}</h2>
          <p>
            {t(
              "A familiar little circle, with a more natural back-and-forth. Find a group and join the everyday conversation.",
            )}
          </p>
          <ul>
            <li>{t("Two friendly groups to choose from")}</li>
            <li>{t("Chat, share a demo photo, meet members")}</li>
            <li>{t("Join and leave whenever you like")}</li>
          </ul>
          <Button asChild className="w-full choice-action">
            <Link to="/patient/groups">
              {t("Find a group")}
              <ArrowRight />
            </Link>
          </Button>
        </article>
      </div>
      <div className="notice">
        <ShieldCheck size={20} />
        <p>
          {t(
            "Both spaces are fictional research demos. You decide where to join in — or just have a look around.",
          )}
        </p>
      </div>
    </main>
  );
}

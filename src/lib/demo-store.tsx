import { createContext, useContext, useEffect, useState, type ReactNode, type Context as ReactContext } from "react";
import { answers, threads, groups, type Answer, type Thread, type ChatMessage } from "./demo-data";
export type DemoState = {
  role: "patient" | "professional" | null;
  name: string;
  lang: "en" | "de" | "fr" | "it";
  largeText: boolean;
  reducedMotion: boolean;
  threads: Thread[];
  answers: Answer[];
  joined: string[];
  anonGroups: string[];
  anonCommunity: boolean;
  groupMessages: Record<string, ChatMessage[]>;
  chat: ChatMessage[];
  feedback: { id: string; text: string; question: string; helpful: boolean; time: string }[];
};
export function initialState(): DemoState {
  return {
    role: null,
    name: "Jamie",
    lang: "en",
    largeText: false,
    reducedMotion: false,
    threads: structuredClone(threads),
    answers: structuredClone(answers),
    joined: [],
    anonGroups: [],
    anonCommunity: false,
    groupMessages: Object.fromEntries(groups.map((g) => [g.id, structuredClone(g.messages)])),
    chat: [
      {
        id: "greeting",
        role: "assistant",
        text: "Hi, I’m Bearny. A little encouragement, a fresh perspective, or just a place to start — what’s on your mind today?",
      },
    ],
    feedback: [],
  };
}
export function hydrateDemoState(saved: Partial<DemoState>): DemoState {
  const defaults = initialState();
  const savedThreads = saved.threads ?? [];
  const seededThreadIds = new Set(defaults.threads.map((thread) => thread.id));
  return {
    ...defaults,
    ...saved,
    threads: [
      ...savedThreads.filter((thread) => !seededThreadIds.has(thread.id)),
      ...defaults.threads.map((thread) => {
        const previous = savedThreads.find((item) => item.id === thread.id);
        if (!previous) return thread;
        const seedIds = new Set(thread.replies.map((reply) => reply.id));
        return {
          ...thread,
          saved: previous.saved,
          reported: previous.reported,
          hidden: previous.hidden,
          ...(previous.resonated ? { resonated: true } : {}),
          replies: [
            // Seeded replies always come from the latest seed so content updates reach older sessions.
            ...thread.replies,
            ...previous.replies.filter((reply) => !seedIds.has(reply.id)),
          ],
        };
      }),
    ],
    groupMessages: {
      ...saved.groupMessages,
      ...Object.fromEntries(groups.map((group) => {
        const previous = saved.groupMessages?.[group.id] ?? [];
        const seedIds = new Set(group.messages.map((message) => message.id));
        return [group.id, [
          // Seeded messages come from the latest seed (e.g. newly added photos).
          ...group.messages,
          ...previous.filter((message) => !seedIds.has(message.id)),
        ]];
      })),
    },
  };
}
type DemoContextValue = {
  state: DemoState;
  update: (fn: (s: DemoState) => DemoState) => void;
  reset: () => void;
  ready: boolean;
};
// Keep the same context when Vite replaces this mixed component/utility module.
// Otherwise mounted providers and refreshed consumers can use different contexts.
const Context: ReactContext<DemoContextValue | null> =
  import.meta.hot?.data?.demoContext ?? createContext<DemoContextValue | null>(null);
if (import.meta.hot?.data) import.meta.hot.data.demoContext = Context;
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bearny-final-v1");
      if (saved) setState(hydrateDemoState(JSON.parse(saved)));
    } catch {
      sessionStorage.removeItem("bearny-final-v1");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) sessionStorage.setItem("bearny-final-v1", JSON.stringify(state));
  }, [state, ready]);
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", state.largeText);
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
  }, [state.largeText, state.reducedMotion]);
  useEffect(() => {
    document.documentElement.lang = state.lang;
  }, [state.lang]);
  return (
    <Context.Provider
      value={{
        state,
        update: setState,
        reset: () =>
          setState((s) => ({
            ...initialState(),
            role: s.role,
            name: s.name,
            lang: s.lang,
            largeText: s.largeText,
            reducedMotion: s.reducedMotion,
          })),
        ready,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const c = useContext(Context);
  if (!c) throw new Error("DemoProvider required");
  return c;
}
export const uid = () => crypto.randomUUID();

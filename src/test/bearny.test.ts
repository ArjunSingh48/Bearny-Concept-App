import { describe, it, expect } from "vitest";
import { classify, respond, answers, safety, groups, threads } from "@/lib/demo-data";
import { askDict } from "@/i18n/ask";
import { initialState, hydrateDemoState } from "@/lib/demo-store";
import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
describe("Bearny prepared answers", () => {
  for (const [question, intent] of [
    ["morning routine", "routine"],
    ["motivation", "motivation"],
    ["feeling lonely", "social"],
    ["simple meal", "food"],
    ["rehabilitation", "rehab"],
    ["quantum computers", "unknown"],
    ["should I change my medication dose?", "medical"],
    ["chest pain and cannot breathe", "emergency"],
    ["I want to kill myself", "emergency"],
  ])
    it(`classifies ${intent}`, () => expect(classify(question ?? "")).toBe(intent));
  it("safety takes precedence over edited match words", () =>
    expect(
      respond("chest pain", [
        { id: "custom", title: "custom", keywords: "chest", text: "bad", followups: [] },
      ]).text,
    ).toBe(safety.emergency));
  it("updated prepared responses are used", () =>
    expect(
      respond(
        "morning routine",
        answers.map((a) =>
          a.id === "routine" ? { ...a, text: "Updated safe routine response" } : a,
        ),
      ).text,
    ).toBe("Updated safe routine response"));
  it("new answer keywords are matched", () =>
    expect(
      respond("journaling", [
        ...answers,
        {
          id: "new",
          title: "Journal",
          keywords: "journaling",
          text: "A small note",
          followups: [],
        },
      ]).text,
    ).toBe("A small note"));
  for (const [question, intent] of [
    ["Ich habe Brustschmerzen und keine Luft", "emergency"],
    ["Je veux me suicider", "emergency"],
    ["Ho un forte dolore al petto, è un'emergenza", "emergency"],
    ["Soll ich die Dosis meines Medikaments ändern?", "medical"],
    ["Wie finde ich eine Morgenroutine?", "routine"],
  ] as const)
    it(`classifies multilingual input as ${intent}`, () => expect(classify(question)).toBe(intent));
  it("every answer title, text and followup has an askDict translation", () => {
    for (const answer of answers) {
      if (answer.title) expect(askDict[answer.title], answer.title).toBeDefined();
      if (answer.text) expect(askDict[answer.text], answer.text).toBeDefined();
      for (const followup of answer.followups)
        expect(askDict[followup], followup).toBeDefined();
    }
  });
  it("every safety text has an askDict translation", () => {
    for (const text of Object.values(safety)) expect(askDict[text], text).toBeDefined();
  });
  it("reset makes independent fictional state", () => {
    const first = initialState();
    first.threads[0]?.replies.push({ id: "test", author: "Test", text: "hello", time: "now" });
    expect(initialState().threads[0]?.replies.length).toBe(threads[0]?.replies.length);
    expect(groups).toHaveLength(2);
  });
});
describe("Expanded fictional conversations", () => {
  it("includes substantial unique exchanges from every group member", () => {
    for (const group of groups) {
      expect(group.messages.length).toBeGreaterThanOrEqual(36);
      expect(new Set(group.messages.map((message) => message.id)).size).toBe(group.messages.length);
      expect(new Set(group.messages.map((message) => message.name))).toEqual(new Set(group.members));
      expect(group.messages.map((message) => message.time)).toEqual(
        group.messages.map((message) => message.time).sort(),
      );
    }
    for (const thread of threads) expect(thread.replies.length).toBeGreaterThanOrEqual(7);
    const seededPhotos = groups.flatMap((group) => group.messages).filter((m) => m.image);
    expect(seededPhotos.length).toBeGreaterThanOrEqual(4);
    expect(new Set(seededPhotos.map((m) => m.image)).size).toBeGreaterThanOrEqual(4);
  });
  it("upgrades older sessions without losing messages, replies or moderation", () => {
    const old = initialState();
    old.joined = ["daily-circle"];
    old.anonGroups = ["daily-circle"];
    const discussion = old.threads[0];
    if (!discussion) throw new Error("Missing fixture");
    discussion.replies = discussion.replies.slice(0, 3);
    discussion.replies.push({ id: "my-reply", author: "Jamie", text: "My reply", time: "now" });
    discussion.hidden = true;
    discussion.saved = true;
    old.threads.push({ ...discussion, id: "my-thread", title: "My discussion" });
    old.groupMessages["daily-circle"] = [
      ...(old.groupMessages["daily-circle"] ?? []).slice(0, 4),
      { id: "my-message", role: "user", name: "Anonymous", text: "My message", time: "15:00" },
    ];
    const upgraded = hydrateDemoState(old);
    expect(upgraded.groupMessages["daily-circle"]).toHaveLength(39);
    expect(upgraded.groupMessages["daily-circle"]?.at(-1)?.text).toBe("My message");
    expect(upgraded.threads.find((thread) => thread.id === "small-routines")?.replies).toHaveLength(10);
    expect(upgraded.threads.find((thread) => thread.id === "small-routines")?.hidden).toBe(true);
    expect(upgraded.threads.find((thread) => thread.id === "small-routines")?.saved).toBe(true);
    expect(upgraded.threads.some((thread) => thread.id === "my-thread")).toBe(true);
    expect(upgraded.joined).toEqual(old.joined);
    expect(upgraded.anonGroups).toEqual(old.anonGroups);
    expect(hydrateDemoState(upgraded)).toEqual(upgraded);
  });
});
describe("All content routes", () => {
  for (const path of [
    "/",
    "/patient",
    "/patient/connect",
    "/patient/community",
    "/patient/community/small-routines",
    "/patient/community/new",
    "/patient/groups",
    "/patient/groups/daily-circle",
    "/patient/ask",
    "/patient/profile",
    "/professional",
    "/professional/moderation",
    "/professional/answers",
    "/professional/feedback",
  ])
    it(path, () => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId).not.toBe("__root__");
      expect(matches.at(-1)?.routeId).toBeTruthy();
    });
});

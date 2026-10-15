import { useCallback } from "react";
import { useDemo } from "./demo-store";
import { shellDict } from "@/i18n/shell";
import { communityDict } from "@/i18n/community";
import { groupsDict } from "@/i18n/groups";
import { askDict } from "@/i18n/ask";
import { homeDict } from "@/i18n/home";
import { professionalDict } from "@/i18n/professional";

export type Lang = "en" | "de" | "fr" | "it";
/** English source text → [German, French, Italian]. */
export type Dict = Record<string, readonly [string, string, string]>;

export const languages: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "it", label: "IT", name: "Italiano" },
];

const dictionary: Dict = { ...shellDict, ...communityDict, ...groupsDict, ...askDict, ...homeDict, ...professionalDict };
const index = { de: 0, fr: 1, it: 2 } as const;

/** Translate English source text; unknown text (e.g. what a user typed) is returned unchanged. */
export function translate(lang: Lang, text: string, vars?: Record<string, string | number>) {
  const entry = lang === "en" ? undefined : dictionary[text];
  let out: string = entry && lang !== "en" ? entry[index[lang]] : text;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

export function useT() {
  const { state } = useDemo();
  const lang: Lang = state.lang ?? "en";
  return useCallback(
    (text: string, vars?: Record<string, string | number>) => translate(lang, text, vars),
    [lang],
  );
}

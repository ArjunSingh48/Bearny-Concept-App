import { createFileRoute } from "@tanstack/react-router";
import { AnswerLibrary } from "@/features/professional";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/professional/answers")({
  component: AnswerLibrary,
  head: () =>
    pageHead("Prepared answer library", "Edit and preview prepared everyday encouragement."),
});

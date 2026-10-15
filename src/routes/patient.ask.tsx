import { createFileRoute } from "@tanstack/react-router";
import { AskBearny } from "@/features/chat";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/ask")({
  component: AskBearny,
  head: () => pageHead("Ask Bearny", "Safe prepared encouragement for everyday questions."),
});

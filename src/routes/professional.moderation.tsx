import { createFileRoute } from "@tanstack/react-router";
import { Moderation } from "@/features/professional";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/professional/moderation")({
  component: Moderation,
  head: () => pageHead("Moderation queue", "Review and manage fictional community discussions."),
});

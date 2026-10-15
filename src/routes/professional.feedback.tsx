import { createFileRoute } from "@tanstack/react-router";
import { Feedback } from "@/features/professional";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/professional/feedback")({
  component: Feedback,
  head: () => pageHead("Patient feedback", "Review helpfulness feedback from the research demo."),
});

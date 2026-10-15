import { createFileRoute } from "@tanstack/react-router";
import { Community } from "@/features/community";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/community/")({
  component: Community,
  head: () =>
    pageHead(
      "Bearny community",
      "Fictional stories, supportive discussions, and shared everyday moments.",
    ),
});

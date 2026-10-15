import { createFileRoute } from "@tanstack/react-router";
import { NewDiscussion } from "@/features/community";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/community/new")({
  component: NewDiscussion,
  head: () => pageHead("Start a discussion", "Share an everyday story in the Bearny community."),
});

import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/features/home";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/")({
  component: Landing,
  head: () =>
    pageHead("Welcome to Bearny", "Everyday connection and encouragement, at your own pace."),
});

import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "@/features/profile";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/profile")({
  component: Profile,
  head: () => pageHead("Your profile", "Your demo name and accessible reading preferences."),
});

import { createFileRoute } from "@tanstack/react-router";
import { PatientHome } from "@/features/home";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/")({
  component: PatientHome,
  head: () =>
    pageHead("Your everyday space", "Find your community and a little encouragement with Bearny."),
});

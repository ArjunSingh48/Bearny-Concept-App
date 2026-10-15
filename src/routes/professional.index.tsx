import { createFileRoute } from "@tanstack/react-router";
import { ProfessionalHome } from "@/features/professional";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/professional/")({
  component: ProfessionalHome,
  head: () =>
    pageHead(
      "Research workspace",
      "Manage fictional community conversations and everyday prepared responses.",
    ),
});

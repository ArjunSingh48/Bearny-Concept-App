import { createFileRoute } from "@tanstack/react-router";
import { ConnectChoice } from "@/features/home";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/connect")({
  component: ConnectChoice,
  head: () =>
    pageHead(
      "Connect with others",
      "Choose a community conversation or a smaller simulated group.",
    ),
});

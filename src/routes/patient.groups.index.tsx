import { createFileRoute } from "@tanstack/react-router";
import { GroupDirectory } from "@/features/chat";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/groups/")({
  component: GroupDirectory,
  head: () => pageHead("Find a group", "Meet a smaller circle in our simulated group directory."),
});

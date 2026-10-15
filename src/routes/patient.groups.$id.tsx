import { createFileRoute } from "@tanstack/react-router";
import { GroupChat } from "@/features/chat";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/groups/$id")({
  component: Screen,
  head: () =>
    pageHead("Your group conversation", "A simulated group conversation for everyday connection."),
});
function Screen() {
  const { id } = Route.useParams();
  return <GroupChat id={id} />;
}

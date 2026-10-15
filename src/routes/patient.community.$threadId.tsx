import { createFileRoute } from "@tanstack/react-router";
import { ThreadDetail } from "@/features/community";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/patient/community/$threadId")({
  component: Screen,
  head: () => pageHead("Community conversation", "A supportive fictional community conversation."),
});
function Screen() {
  const { threadId } = Route.useParams();
  return <ThreadDetail threadId={threadId} />;
}

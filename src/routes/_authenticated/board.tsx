import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/board")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/board"!</div>;
}

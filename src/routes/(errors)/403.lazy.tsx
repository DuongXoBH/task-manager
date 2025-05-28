import ForbiddenError from "@/view/errors/forbidden";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(errors)/403")({
  component: ForbiddenError,
});

import ProjectDetails from "@/view/project/project-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/project/$projectId")({
  component: ProjectDetails,
});

import MaintenanceError from "@/view/errors/maintenance-error";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(errors)/503")({
  component: MaintenanceError,
});

import { RegisterForm } from "@/view/auth/register";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/register")({
  component: RegisterForm,
});

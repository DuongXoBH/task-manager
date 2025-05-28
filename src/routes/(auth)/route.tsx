import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthGuard,
});

function AuthGuard() {
  return (
    <div
      id="content"
      className={cn(
        "mx-auto w-full max-w-full sm:max-w-[640px] lg:max-w-[1024px] xl:max-w-[1280px]",
        "flex flex-col"
      )}
    >
      <Outlet />
    </div>
  );
}

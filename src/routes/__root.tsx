import GeneralError from "@/view/errors/general-error";
import NotFoundError from "@/view/errors/not-found-error";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    return (
      <>
        <Outlet />
        {import.meta.env.MODE === "development" && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: import.meta.env.MODE === "development" ? false : GeneralError,
});

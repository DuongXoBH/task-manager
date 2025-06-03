// src/router.ts

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient: new QueryClient(),
  },
});

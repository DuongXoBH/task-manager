import { Home, Table } from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Project",
          url: "/project",
          icon: Table,
        },
      ],
    },
  ],
};

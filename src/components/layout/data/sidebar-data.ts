import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  Table,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
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
          title: "Dashboard",
          url: "/dashboard",
          icon: Table,
        },
      ],
    },
  ],
};

import { AppSidebar } from "@/components/layout/app-sidebar";
import Search from "@/components/layout/search";
import SkipToMain from "@/components/skip-to-main";
import { cn } from "@/lib/utils";
import HomePage from "@/view/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="w-full xl:max-w-[1280px] mx-auto relative">
      <SkipToMain />
      <AppSidebar />
      <div
        id="content"
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
        )}
      >
        <div className="w-full flex flex-col pt-2">
          <Search />
          <div className="w-full pt-[9px]">
            <HomePage />
          </div>
        </div>
      </div>
    </div>
  );
}

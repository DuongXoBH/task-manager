import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import SkipToMain from "@/components/skip-to-main";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import { useEffect } from "react";
import { useGetMe } from "@/apis/use-get-me";
import Search from "@/components/layout/search";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  const [accessToken] = useAtom(useAuthAccessToken);
  const [, setUserInfo] = useAtom(useUserInfoStore);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      navigate({
        to: "/login",
        search: {
          backUrl: location.pathname === "/" ? undefined : location.pathname,
        },
      });
    }
  }, [accessToken, location.pathname, navigate]);

  const { data: dataUser } = useGetMe();
  useEffect(() => {
    if (dataUser) setUserInfo(dataUser);
  }, [dataUser]);
  if (!accessToken) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="w-full lg:max-w-[1024px] mx-auto relative">
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
          <div className="w-full flex flex-col">
            <Search />
            <div className="w-full pt-[9px]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

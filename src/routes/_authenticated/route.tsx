import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import { useEffect } from "react";
import { useGetMe } from "@/apis/use-get-me";

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
      const timeout = setTimeout(() => {
        navigate({
          to: "/login",
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [accessToken, location.pathname, navigate]);

  const { data: dataUser } = useGetMe();
  useEffect(() => {
    if (dataUser) setUserInfo(dataUser);
  }, [dataUser]);
  if (!accessToken) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <Outlet />
    </SidebarProvider>
  );
}

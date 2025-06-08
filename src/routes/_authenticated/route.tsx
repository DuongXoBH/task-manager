import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useAtom } from "jotai";
import {
  useAuthAccessToken,
  useUserInfoStore,
  useUserList,
} from "@/store/auth";
import { useEffect } from "react";
import { useGetMe } from "@/apis/use-get-me";
import { useGetUsers } from "@/apis/use-get-users";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  const [accessToken] = useAtom(useAuthAccessToken);
  const [, setUserInfo] = useAtom(useUserInfoStore);
  const [, setUsers] = useAtom(useUserList);

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
  const { data: dataUsers } = useGetUsers();

  useEffect(() => {
    if (dataUser) setUserInfo(dataUser);
  }, [dataUser]);

  useEffect(() => {
    if (dataUsers) setUsers(dataUsers);
  }, [dataUsers]);
  if (!accessToken) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <Outlet />
    </SidebarProvider>
  );
}

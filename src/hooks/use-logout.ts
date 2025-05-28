import { useSetAtom } from "jotai";
import { useAuthAccessToken, useAuthRefreshToken } from "@/store/auth";

export function useLogout() {
  const setAccessToken = useSetAtom(useAuthAccessToken);
  const setRefreshToken = useSetAtom(useAuthRefreshToken);

  return () => {
    setAccessToken("");
    setRefreshToken("");
  };
}

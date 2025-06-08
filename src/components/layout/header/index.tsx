import { Link } from "@tanstack/react-router";
import Search from "../search";
import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";
import { HeadUser } from "./head-user";

export default function Header() {
  const [userInfo] = useAtom(useUserInfoStore);
  return (
    <div className="w-full flex flex-row justify-between items-center px-10 py-2">
      <Link to="/">
        <img src="/vite.svg" alt="" className="size-10" />
      </Link>
      <Search />
      <HeadUser user={userInfo} />
    </div>
  );
}

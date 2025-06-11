import { Icons } from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";

export default function UserProfile({
  setIsEdit,
}: {
  setIsEdit: (open: boolean) => void;
}) {
  const [userInfo] = useAtom(useUserInfoStore);
  return (
    <div className="relative flex w-full flex-col space-y-5 pr-[50px] pl-10">
      <div className="w-full flex-row justify-between">
        <div className="flex items-center gap-[13px]">
          <Avatar className="size-[70px]">
            <AvatarImage
              src={userInfo?.avatar || "/api/placeholder/40/40"}
              alt={userInfo?.name}
            />
            <AvatarFallback className="bg-gray-700 text-white">
              {userInfo?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 font-semibold">
            <p className="mb-1 truncate text-[15px] font-semibold text-black">
              {userInfo?.name}
            </p>
            <p className="truncate text-sm font-semibold text-[#697698]">
              {userInfo?.email}
            </p>
          </div>
          <Button
            className="border-blue-light border-1 bg-gray-100 p-2.5 hover:bg-gray-300"
            onClick={() => setIsEdit(true)}
          >
            <Icons.huge />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="w-full max-w-md">
        <span className="mb-5 px-1 text-[15px] font-bold text-slate-800">
          Personal Info
        </span>
      </div>
    </div>
  );
}

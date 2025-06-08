import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUp, X } from "lucide-react";
import { useGetUserById } from "@/apis/use-get-user-by-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";
import { Link } from "@tanstack/react-router";
interface IUserProfilePopoverProps {
  userId: string;
  createdById?: string;
}
export default function UserProfilePopover({
  userId,
  createdById,
}: IUserProfilePopoverProps) {
  const [userInfo] = useAtom(useUserInfoStore);
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: user } = useGetUserById(userId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="!p-0 !rounded-full hover:bg-gray-200 -ml-1 hover:opacity-80 text-black bg-white dark:text-white   "
          onClick={() => setIsOpen(true)}
        >
          <div className="relative">
            <Avatar isCircle className="w-8 h-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-xs">CN</AvatarFallback>
            </Avatar>
            {createdById === user?._id && (
              <div className="absolute -bottom-2.5 -right-1 rounded-full p-0.5 bg-black">
                <ChevronsUp className="w-2 h-2 text-red-600" />
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 bg-white rounded-lg shadow-lg border border-gray-200"
        align="center"
        sideOffset={5}
      >
        <div className="relative bg-blue-500 h-20 rounded-t-lg">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-black !bg-gray-100 hover:!bg-gray-300 rounded-sm !py-0 !px-2.5"
          >
            <X className="size-3" />
          </Button>
        </div>

        <div className="px-4 pb-4">
          <div className="relative -mt-8 mb-3">
            <Avatar className="size-16 text-black" isCircle>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="w-full flex flex-col space-y-1">
            <Link
              to="/"
              type="button"
              className="w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md border-b border-gray-100"
            >
              {userInfo?._id === user?._id
                ? "Edit personal information"
                : "View profile"}
            </Link>
            <Link
              to="/"
              type="button"
              className="w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              View member activity in the board
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

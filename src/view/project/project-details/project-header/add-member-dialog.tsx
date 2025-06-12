import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Plus, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useUpdateProject } from "../../apis/project/use-update-project";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { IProjectResponse } from "../../types";
import { useAtom } from "jotai";
import { useUserInfoStore, useUserList } from "@/store/auth";

export default function AddMemberDialog({
  project,
}: {
  project: IProjectResponse;
}) {
  const [auth] = useAtom(useUserInfoStore);
  const isAuth = auth?._id === project.createdById;
  const [memberList, setMemberList] = useState<string[]>(project.memberIds);
  const [users] = useAtom(useUserList);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateProjectMutate = useUpdateProject(() => {
    toast.success("Success");
    setIsOpen(false);
    queryClient.refetchQueries({
      queryKey: ["getProjectById", project._id],
    });
  });
  const filterUsers = useMemo(() => {
    return users?.filter((user) => !memberList.includes(user._id)) ?? [];
  }, [users, memberList]).slice(0, 10);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="!bg-gray-600 hover:!bg-gray-800 dark:text-white"
        >
          <UserPlus />
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex flex-row space-x-1">
            <Plus className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">
              Add New Member To Project
            </span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Type a username or email " />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {filterUsers?.map((user) => (
                <CommandItem
                  key={user._id}
                  value={user._id}
                  onSelect={() => {
                    setMemberList((prev) => {
                      return prev.includes(user._id)
                        ? prev
                        : [...prev, user._id];
                    });
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <span className="text-lg font-semibold">Member List</span>
        {users?.map((user) => {
          return (
            memberList.includes(user._id) && (
              <div
                key={`selectedList-${user._id}`}
                className="w-full flex justify-between"
              >
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
                {isAuth && user._id != project.createdById && (
                  <Button
                    onClick={() =>
                      setMemberList((prev) =>
                        prev.filter((item) => item != user._id)
                      )
                    }
                    className="!px-1.5 !border-0 text-gray-500 !bg-inherit hover:!bg-gray-300"
                  >
                    <X />
                  </Button>
                )}
              </div>
            )
          );
        })}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-400 hover:bg-gray-500"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() =>
              updateProjectMutate.mutate({
                projectId: project._id,
                memberIds: memberList,
              })
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            {updateProjectMutate.isPending ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

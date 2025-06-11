import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/user-info";
import { formatPhoneNumberWithSpaces } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AvatarUpload from "@/components/avatar-upload";
import { useUpdateMe } from "./apis/use-update-me";
import EditPassword from "./component/edit-password";
import PersonalInfoEdit from "./component/edit-personal-info";
import {
  editFormSchema,
  TUpdateForm,
  TUpdateMePayload,
} from "./types/edit-profile";

export default function EditProfile() {
  const [isDisable, setIsDisable] = useState(true);
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();

  const form = useForm<TUpdateForm>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: userInfo?.name,
      email: userInfo?.email,
    },
  });
  const { handleSubmit } = form;
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getMe"] });

    toast.success("Update successful");
  };

  const { mutate, isPending } = useUpdateMe();

  const onSubmit = (val: TUpdateForm) => {
    const data: TUpdateMePayload = {
      name: val.name,
      email: val.email,
      password: val.password || undefined,
      avatar: val.avatar || undefined,
    };
    mutate(data, { onSuccess });
  };

  return (
    <div className="w-full flex-col px-[25px]">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center"
          onChange={() => setIsDisable(false)}
        >
          <AvatarUpload
            setAvatar={(images: string) => form.setValue("avatar", images)}
            defaultAvatar={userInfo?.avatar}
          />
          <div className="mt-[33px] flex w-full flex-col space-y-[37px]">
            <PersonalInfoEdit />
            <EditPassword />
          </div>

          <Button
            type="submit"
            variant={"secondary"}
            disabled={isDisable || isPending}
            className="bg-secondary mt-[30px] ml-[30px] h-[50px] w-[calc(100%-60px)] rounded-[5px] text-sm font-bold text-white hover:bg-green-600"
          >
            {isPending ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

import { useState } from "react";
import EditProfile from "./component/edit-profile";
import UserProfile from "./component/profile";
import SheetContentLayout from "./component/sheet-layout";

export default function UserSheet() {
  const [isEditPage, setIsEditPage] = useState(false);
  const content = !isEditPage ? (
    <UserProfile setIsEdit={setIsEditPage} />
  ) : (
    <EditProfile setIsEdit={setIsEditPage} />
  );

  const title = !isEditPage ? "user profile" : "user profile edit";

  return (
    <SheetContentLayout
      title={title}
      content={content}
      isEdit={isEditPage}
      setIsEdit={setIsEditPage}
    />
  );
}

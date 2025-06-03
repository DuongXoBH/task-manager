import GuestProject from "./component/guest-project";
import ProjectByMe from "./component/project-by-me";
import RecentlyProject from "./component/recently-project";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col px-4 space-y-10">
      <RecentlyProject />
      <ProjectByMe />
      <GuestProject />
    </div>
  );
}

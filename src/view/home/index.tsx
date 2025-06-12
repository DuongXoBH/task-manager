import HomeRightSidebar from "./home-right-sidebar.tsx";

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="w-full flex flex-row">
        <div className="w-full min-h-10 px-10 flex justify-center">
          <div className="flex flex-col items-center rounded-xl border pb-0.5">
            <img src="images/home-banner.svg" alt="" className="w-full" />
            <span className="px-1 text-xl font-bold">Monitor and update</span>
            <span className="px-1 text-base font-light text-center">
              Invite everyone to the board and cards, leave comments, add due
              dates, and we'll display the most important activity here.
            </span>
          </div>
        </div>
        <HomeRightSidebar />
      </div>
    </div>
  );
}

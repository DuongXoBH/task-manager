import HomeContent from "./component/home-content";
import HomeRightSidebar from "./component/home-right-sidebar";

export default function HomePage() {
  return (
    <div className="w-full flex flex-row">
      <HomeContent />
      <HomeRightSidebar />
    </div>
  );
}

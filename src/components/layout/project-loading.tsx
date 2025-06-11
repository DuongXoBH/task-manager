import { Skeleton } from "../ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="flex w-full h-[calc(100vh-106px)] flex-row px-3 space-x-6 py-5">
      <Skeleton className="w-68 h-80 rounded-lg" />
      <Skeleton className="w-68 h-80 rounded-lg" />
      <Skeleton className="w-68 h-80 rounded-lg" />
      <Skeleton className="w-68 h-9 rounded-lg" />
    </div>
  );
}

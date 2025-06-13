import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectListLoading({
  projectKey,
}: {
  projectKey: string;
}) {
  return Array(4)
    .fill(null)
    .map((_, index) => (
      <Skeleton
        key={`${projectKey}-${index}`}
        className="w-full h-[152px] rounded-sm"
      />
    ));
}

import { Link } from "@tanstack/react-router";

export interface IProjectCardProps {
  image: string;
  name: string;
  projectId: string;
}
export default function ProjectCard({
  image,
  name,
  projectId,
}: IProjectCardProps) {
  return (
    <Link to="/project/$projectId" params={{ projectId }} className="w-full">
      <div className="w-full rounded-sm shadow-sm overflow-hidden">
        <img src={image} alt="" className="w-full h-28" />
        <div className="w-full flex justify-center items-center ">
          <span className="p-2 w-full ">{name}</span>
        </div>
      </div>
    </Link>
  );
}

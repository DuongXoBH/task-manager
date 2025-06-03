import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetRecentlyProject } from "@/view/project/apis/project/use-get-recently-project";
import { Link } from "@tanstack/react-router";

const ListComponent: React.FC = () => {
  const { data: projectList } = useGetRecentlyProject();
  return (
    <div className="w-full max-w-md mx-auto mb-10">
      {projectList?.length != 0 ? (
        projectList?.map((item) => (
          <Link
            to="/project/$projectId"
            params={{ projectId: item._id }}
            className="w-full"
            key={item._id}
          >
            <div className="flex items-center space-x-3 p-4 hover:bg-gray-200 cursor-pointer transition-colors duration-150 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.image} alt={item.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-sm">
                  {"IM"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{item._id}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <span className="mx-4">No projects available.</span>
      )}
    </div>
  );
};

export default ListComponent;

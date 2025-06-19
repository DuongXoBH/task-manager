import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetRecentlyProject } from "@/view/project/apis/project/use-get-recently-project";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const ListComponent: React.FC = () => {
  const { data: projectList } = useGetRecentlyProject();
  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex flex-row text-xs text-gray-600 gap-2 items-center mx-4">
        <Clock />
        <span className="w-full font-medium">Recently</span>
      </div>
      <div className="w-full mx-auto mb-5">
        {projectList?.length != 0 ? (
          projectList?.map((item) => (
            <Link
              to="/project/$projectId"
              params={{ projectId: item._id }}
              className="w-full"
              key={item._id}
            >
              <div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-200 cursor-pointer transition-colors duration-150 rounded-lg">
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
                  <p className="text-sm text-gray-500 truncate">
                    Last accessed{" "}
                    {formatDistanceToNow(new Date(item.recentlyAccessedAt), {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <span className="mx-4">No projects available.</span>
        )}
      </div>
    </div>
  );
};

export default ListComponent;

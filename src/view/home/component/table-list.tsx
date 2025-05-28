import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListItem {
  id: string;
  title: string;
  workSpace: string;
  avatar: string;
  avatarFallback: string;
}

const listItems: ListItem[] = [
  {
    id: "1",
    title: "dismecuocdoi",
    workSpace: "yours",
    avatar: "/api/placeholder/40/40",
    avatarFallback: "DM",
  },
  {
    id: "2",
    title: "Test",
    workSpace: "yours",
    avatar: "/api/placeholder/40/40",
    avatarFallback: "T",
  },
  {
    id: "3",
    title: "ILoveYou",
    workSpace: "yours",
    avatar: "/api/placeholder/40/40",
    avatarFallback: "IL",
  },
  {
    id: "4",
    title: "Training",
    workSpace: "bhsoft",
    avatar: "/api/placeholder/40/40",
    avatarFallback: "TR",
  },
];

const ListComponent: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      {listItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-3 p-4 hover:bg-gray-200 cursor-pointer transition-colors duration-150 rounded-lg"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={item.avatar} alt={item.title} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-sm">
              {item.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </p>
            <p className="text-sm text-gray-500 truncate">{item.workSpace}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListComponent;

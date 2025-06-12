import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, X, User, Check } from "lucide-react";
import type { IUserResponse } from "@/types";
import { useAtom } from "jotai";
import { useUserInfoStore, useUserList } from "@/store/auth";
import { useFormContext } from "react-hook-form";
import type { TCreateProjectForm } from "../../project/types/create-project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types

interface IProjectMember extends IUserResponse {
  position: "admin" | "member";
  addedAt: Date;
}

// Mock user data - replace with your actual user data
const AddMemberToProject: React.FC = () => {
  const [users] = useAtom(useUserList);
  const { setValue } = useFormContext<TCreateProjectForm>();
  const [userInfo] = useAtom(useUserInfoStore);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<IProjectMember[]>(
    userInfo
      ? [
          {
            ...userInfo,
            position: "admin",
            addedAt: new Date(),
          },
        ]
      : []
  );
  const [projectMembersIds, setProjectMembersIds] = useState<string[]>([
    userInfo?._id ?? "",
  ]);

  const filteredUsers = useMemo(() => {
    return (
      users?.filter(
        (user) =>
          !projectMembersIds.includes(user._id) &&
          (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ) ?? []
    );
  }, [searchQuery, users, projectMembersIds]);

  const addMemberToProject = (user: IUserResponse) => {
    const newMember: IProjectMember = {
      ...user,
      position: "member",
      addedAt: new Date(),
    };

    setProjectMembers((prev) => [...prev, newMember]);
    setProjectMembersIds((prev) => [...prev, newMember._id]);
    setSearchQuery("");
    setIsOpen(false);
  };

  const removeMemberFromProject = (userId: string) => {
    setProjectMembers((prev) => prev.filter((member) => member._id !== userId));
    setProjectMembersIds((prev) =>
      prev.filter((memberId) => memberId !== userId)
    );
  };

  useEffect(() => {
    setValue("memberIds", projectMembersIds);
  }, [projectMembersIds]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Add Member Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Add New Member</span>
          </div>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(e.target.value.length > 0);
                }}
                onFocus={() => setIsOpen(searchQuery.length > 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Search Results Dropdown */}
            {isOpen && searchQuery && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => addMemberToProject(user)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Members List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Current Members ({projectMembers.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {projectMembers.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    member.role === "admin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {member.position}
                </span>

                {member.role !== "admin" && (
                  <Button
                    onClick={() => removeMemberFromProject(member._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors !p-0 !bg-inherit"
                    title="Remove member"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Project Access Summary
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {projectMembers.length} member
              {projectMembers.length !== 1 ? "s" : ""} currently have access to
              this project. Members can view and collaborate on project content
              based on their role permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberToProject;

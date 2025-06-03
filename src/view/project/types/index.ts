export interface IProjectResponse {
  _id: string;
  name: string;
  image?: string;
  createdById: string;
  memberIds: string[];
  taskStatusIds: string[];
  taskIds: string[];
  recentlyAccessedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITaskResponse {
  _id: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  createdById: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITaskStatusResponse {
  _id: string;
  projectId: string;
  title: string;
  order: string;
}

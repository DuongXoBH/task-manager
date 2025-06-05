import type { ITaskResponse } from "@/view/project/types";
import { atom } from "jotai";

export interface IColumn {
  id: string;
  title: string;
  tasks: ITaskResponse[];
}

export const useTaskListStore = atom<IColumn[]>();

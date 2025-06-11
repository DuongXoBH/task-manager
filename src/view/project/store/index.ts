import type { ITaskResponse } from "@/view/project/types";
import { atom } from "jotai";

export interface IColumn {
  id: string;
  title: string;
  tasks: ITaskResponse[];
}
export interface IFilter {
  completed: boolean | undefined;
  isNoExpiration: boolean;
  isOverdue: boolean;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}
export const useInitTaskListStore = atom<IColumn[]>();
export const useTaskListStore = atom<IColumn[]>();
export const useFilterTask = atom<IFilter>({
  completed: undefined,
  isNoExpiration: false,
  isOverdue: false,
  fromDate: undefined,
  toDate: undefined,
});

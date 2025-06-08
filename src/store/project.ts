import type { ITaskResponse } from "@/view/project/types";
import { atom } from "jotai";

export interface IColumn {
  id: string;
  title: string;
  tasks: ITaskResponse[];
}
export interface IFilter {
  cardStatus: {
    completed: boolean;
    notCompleted: boolean;
  };
  expirationDate: {
    noExpiration: boolean;
    overdue: boolean;
    expiresTomorrow: boolean;
    expiresNextWeek: boolean;
    expiresNextMonth: boolean;
  };
}
export const useInitTaskListStore = atom<IColumn[]>();
export const useTaskListStore = atom<IColumn[]>();
export const useFilterTask = atom<IFilter>({
  cardStatus: {
    completed: false,
    notCompleted: false,
  },
  expirationDate: {
    noExpiration: false,
    overdue: false,
    expiresTomorrow: false,
    expiresNextWeek: false,
    expiresNextMonth: false,
  },
});

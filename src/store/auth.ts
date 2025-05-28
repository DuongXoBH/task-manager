import type { IUserResponse } from "@/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const useUserInfoStore = atom<IUserResponse>();
export const useAuthToken = atomWithStorage("authToken", "");

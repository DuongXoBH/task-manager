import type { IUserResponse } from "@/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const useAuthAccessToken = atomWithStorage("authToken", "");
export const useAuthRefreshToken = atomWithStorage("refreshToken", "");
export const useUserInfoStore = atom<IUserResponse>();
export const useUserList = atom<IUserResponse[]>([]);

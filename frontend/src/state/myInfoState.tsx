import { atom } from "recoil";

export interface MyInfoState {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

export const myInfoState = atom<MyInfoState>({
  key: "myInfoState",
  default: {
    userId: -1,
    nickname: "",
    avatarUrl: "",
  },
});

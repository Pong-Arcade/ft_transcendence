import { atom } from "recoil";

export interface IMyInfoState {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

const myInfoState = atom<IMyInfoState>({
  key: "myInfoState",
  default: {
    userId: -1,
    nickname: "",
    avatarUrl: "",
  },
});

export default myInfoState;

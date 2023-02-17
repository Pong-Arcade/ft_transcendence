import { atom } from "recoil";

export interface IInfoState {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

const infoState = atom<IInfoState>({
  key: "infoState",
  default: {
    userId: -1,
    nickname: "",
    avatarUrl: "",
  },
});

export default infoState;

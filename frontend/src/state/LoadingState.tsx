import { atom } from "recoil";

export const loadingState = atom<boolean>({
  key: "loading",
  default: false,
});

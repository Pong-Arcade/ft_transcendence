import { atom } from "recoil";

const errorState = atom<boolean>({
  key: "errorState",
  default: false,
});

export default errorState;

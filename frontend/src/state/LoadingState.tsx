import { atom } from "recoil";

export default atom<boolean>({
  key: "loading",
  default: false,
});

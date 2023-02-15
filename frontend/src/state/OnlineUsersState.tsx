import { atom } from "recoil";
import { IUser } from "../components/modules/Pagination/Pagination";

export const onlineUsersState = atom<IUser[]>({
  key: "onlineUsersState",
  default: [],
});

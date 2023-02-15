import { atom } from "recoil";
import { IUser } from "../components/modules/Pagination/Pagination";

export const friendUsersState = atom<IUser[]>({
  key: "friendUsersState",
  default: [],
});

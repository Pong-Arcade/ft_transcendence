import { atom } from "recoil";
import { IUser } from "../components/modules/Pagination/Pagination";

export const blockUsersState = atom<IUser[]>({
  key: "blockUsersState",
  default: [],
});

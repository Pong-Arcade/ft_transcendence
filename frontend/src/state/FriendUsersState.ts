import { atom } from "recoil";
import { IUser } from "../components/modules/Pagination/Pagination";

const friendUsersState = atom<IUser[]>({
  key: "friendUsersState",
  default: [],
});

export default friendUsersState;

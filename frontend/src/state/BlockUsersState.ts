import { atom } from "recoil";
import { IUser } from "../components/modules/Pagination/Pagination";

const blockUsersState = atom<IUser[]>({
  key: "blockUsersState",
  default: [],
});

export default blockUsersState;

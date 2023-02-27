import { atom } from "recoil";
import { ILobbyChatRoom } from "../components/modules/Pagination/Pagination";

const chatRoomListState = atom<ILobbyChatRoom[]>({
  key: "chatRoomListState",
  default: [],
});

export default chatRoomListState;

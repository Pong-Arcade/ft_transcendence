import { atom } from "recoil";
import { ILobbyGameRoom } from "../components/modules/Pagination/Pagination";

const gameRoomListState = atom<ILobbyGameRoom[]>({
  key: "gameRoomListState",
  default: [],
});

export default gameRoomListState;

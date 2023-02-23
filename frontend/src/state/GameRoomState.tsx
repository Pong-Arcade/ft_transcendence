import { atom } from "recoil";
import { IGameRoom } from "../components/modules/Pagination/Pagination";

const gameRoomState = atom<IGameRoom>({
  key: "gameRoomState",
  default: {
    roomId: -1,
    users: [],
  },
});

export default gameRoomState;

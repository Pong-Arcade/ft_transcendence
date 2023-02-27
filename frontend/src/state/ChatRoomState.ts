import { atom } from "recoil";
import { IChatRoom } from "../components/modules/Pagination/Pagination";

const chatRoomState = atom<IChatRoom>({
  key: "chatRoomState",
  default: {
    roomId: -1,
    mastUserId: -1,
    users: [],
  },
});

export default chatRoomState;

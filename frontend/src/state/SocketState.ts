import { atom } from "recoil";
import ChatSocket from "../utils/ChatSocket";

const socketState = atom<ChatSocket>({
  key: "socketState",
  default: new ChatSocket(),
});

export default socketState;

import { useContext, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ILobbyChatRoom } from "../../components/modules/Pagination/Pagination";
import chatRoomListState from "../../state/ChatRoomListState";
import InfoState from "../../state/InfoState";
import { SocketContext } from "../../utils/ChatSocket";

const lobbyChatEvent = () => {
  const socket = useContext(SocketContext);
  const myInfo = useRecoilValue(InfoState);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);

  useEffect(() => {
    socket.socket.off("addChatRoom");
    socket.socket.off("deleteChatRoom");
    socket.socket.on("addChatRoom", async (addRoom: ILobbyChatRoom) => {
      setChatRoomList((prev) => [...prev, addRoom]);
    });

    socket.socket.on("deleteChatRoom", async (roomId: number) => {
      setChatRoomList(chatRoomList.filter((room) => room.roomId != roomId));
    });
  }, []);
  useEffect(() => {
    socket.setUser(myInfo.userId, myInfo.nickname);
    socket.socket.emit("addUser", {
      userId: socket.userId,
      userName: socket.userName,
    });
  }, [myInfo]);
};

export default lobbyChatEvent;

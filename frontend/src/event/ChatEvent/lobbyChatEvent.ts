import { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";
import { ILobbyChatRoom } from "../../components/modules/Pagination/Pagination";
import chatRoomListState from "../../state/ChatRoomListState";
import { SocketContext } from "../../utils/ChatSocket";

const lobbyChatEvent = () => {
  const socket = useContext(SocketContext);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);

  useEffect(() => {
    socket.socket.on("addChatRoom", (addRoom: ILobbyChatRoom) => {
      setChatRoomList((prev) => [...prev, addRoom]);
    });
    socket.socket.on("deleteChatRoom", (roomId: number) => {
      setChatRoomList(chatRoomList.filter((room) => room.roomId != roomId));
    });
    socket.socket.on("updateChatRoom", (updateRoom: ILobbyChatRoom) => {
      const newList = new Array<ILobbyChatRoom>();
      for (const room of chatRoomList) {
        if (room.roomId != updateRoom.roomId) newList.push(room);
        else newList.push(updateRoom);
      }
      setChatRoomList(newList);
    });
    return () => {
      socket.socket.off("addChatRoom");
      socket.socket.off("deleteChatRoom");
      socket.socket.off("updateChatRoom");
    };
  }, [chatRoomList]);
};

export default lobbyChatEvent;

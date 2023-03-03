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
    socket.socket.on("addChatRoom", async (addRoom: ILobbyChatRoom) => {
      await setChatRoomList((prev) => [...prev, addRoom]);
    });
    socket.socket.on("deleteChatRoom", async (roomId: number) => {
      await setChatRoomList(
        chatRoomList.filter((room) => room.roomId != roomId)
      );
    });
    socket.socket.on("updateChatRoom", async (updateRoom: ILobbyChatRoom) => {
      const newList = new Array<ILobbyChatRoom>();
      for (const room of chatRoomList) {
        if (room.roomId != updateRoom.roomId) newList.push(room);
        else newList.push(updateRoom);
      }
      await setChatRoomList(newList);
    });
    return () => {
      socket.socket.off("addChatRoom");
      socket.socket.off("deleteChatRoom");
      socket.socket.off("updateChatRoom");
    };
  }, [chatRoomList]);
};

export default lobbyChatEvent;

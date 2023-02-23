import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getChatRoomListAPI } from "../api/room";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
  getUserInfoAPI,
} from "../api/users";
import {
  ILobbyChatRoom,
  IUser,
} from "../components/modules/Pagination/Pagination";
import blockUsersState from "../state/BlockUsersState";
import friendUsersState from "../state/FriendUsersState";
import infoState from "../state/InfoState";
import { SocketContext } from "../utils/ChatSocket";
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] =
    useRecoilState<IUser[]>(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState<IUser[]>(blockUsersState);
  const [chatRoomList, setChatRoomList] = useState<ILobbyChatRoom[]>([]);
  const [myInfo, setMyInfo] = useRecoilState(infoState);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.socket.off("addChatRoom");
    socket.socket.off("deleteChatRoom");
    socket.socket.on("addChatRoom", async (addRoom: ILobbyChatRoom) => {
      await setChatRoomList((prev) => [...prev, addRoom]);
    });

    socket.socket.on("deleteChatRoom", async (roomId: number) => {
      const newList = new Array<ILobbyChatRoom>();
      for (const room of chatRoomList) {
        if (room.roomId != roomId.toString()) newList.push(room);
      }
      await setChatRoomList(newList);
    });
  }, [chatRoomList]);
  const setLobbyData = async () => {
    const info = JSON.parse(getDecodedCookie());

    setMyInfo(await getUserInfoAPI(info.userId));
    setOnlineUsers(await getOnlineUsersAPI());
    setFriendUsers(await getFriendUsersAPI());
    setBlockUsers(await getBlockUsersAPI());
    setChatRoomList(await getChatRoomListAPI());
  };

  const getLobbyData = () => {
    return {
      onlineUsers,
      setOnlineUsers,
      friendUsers,
      blockUsers,
      chatRoomList,
      myInfo,
    };
  };

  return { setLobbyData, getLobbyData };
};

export default useLobbyData;

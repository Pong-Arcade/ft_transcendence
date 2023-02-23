import { useContext, useState } from "react";
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
  socket.socket.on("addChatRoom", (addRoom: ILobbyChatRoom) => {
    console.log("addchat", addRoom);
    const newList = new Array<ILobbyChatRoom>();
    chatRoomList.forEach((room) => {
      newList.push(room);
    });
    newList.push(addRoom);
    setChatRoomList(newList);
  });
  // socket.socket.on("deleteChatRoom", (roomId: number) => {
  //   list.filter((room) => {
  //     room.roomId !== roomId.toString();
  //   });
  // });
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
      friendUsers,
      blockUsers,
      chatRoomList,
      myInfo,
    };
  };

  return { setLobbyData, getLobbyData };
};

export default useLobbyData;

import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getChatRoomListAPI, getGameRoomListAPI } from "../api/room";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
  getUserInfoAPI,
} from "../api/users";
import { IUser } from "../components/modules/Pagination/Pagination";
import blockUsersState from "../state/BlockUsersState";
import chatRoomListState from "../state/ChatRoomListState";
import friendUsersState from "../state/FriendUsersState";
import gameRoomListState from "../state/GameRoomListState";
import infoState from "../state/InfoState";
import { SocketContext } from "../utils/ChatSocket";
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);
  const [gameRoomList, setGameRoomList] = useRecoilState(gameRoomListState);
  const [myInfo, setMyInfo] = useRecoilState(infoState);
  const socket = useContext(SocketContext);

  //유저 정보 변경시 소켓 이벤트
  useEffect(() => {
    socket.setUser(myInfo.userId, myInfo.nickname);
    socket.socket.emit("addUser", {
      userId: socket.userId,
      userName: socket.userName,
    });
  }, [myInfo]);
  //온라인 유저 소켓 이벤트
  const addOnlineUser = (user: IUser) => {
    onlineUsers.find((u) => u.userId == user.userId) &&
      user.userId &&
      deleteOnlineUser(user.userId);
    setOnlineUsers((prev) => [...prev, user]);
  };
  const deleteOnlineUser = (userId: number) => {
    if (!onlineUsers) return;
    setOnlineUsers((prev) => prev.filter((user) => user.userId != userId));
  };
  useEffect(() => {
    socket.socket.on("addOnlineUser", (user) => addOnlineUser(user));
    socket.socket.on("deleteOnlineUser", (userId) => deleteOnlineUser(userId));
    return () => {
      socket.socket.off("addOnlineUser");
      socket.socket.off("deleteOnlineUser");
    };
  }, [onlineUsers]);

  const setLobbyData = async () => {
    const info = JSON.parse(getDecodedCookie());

    setMyInfo(await getUserInfoAPI(info.userId));
    setOnlineUsers(await getOnlineUsersAPI());
    setFriendUsers(await getFriendUsersAPI());
    setBlockUsers(await getBlockUsersAPI());
    setChatRoomList(await getChatRoomListAPI());
    setGameRoomList(await getGameRoomListAPI());
  };

  const getLobbyData = () => {
    return {
      onlineUsers,
      friendUsers,
      blockUsers,
      chatRoomList,
      gameRoomList,
      myInfo,
    };
  };

  return { setLobbyData, getLobbyData };
};

export default useLobbyData;

import { useContext, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  getChatRoomListAPI,
  getGameBoardConfigAPI,
  getGameRoomListAPI,
} from "../api/room";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
  getUserInfoAPI,
} from "../api/users";
import { IUser } from "../components/modules/Pagination/Pagination";
import blockUsersState from "../state/BlockUsersState";
import chatRoomListState from "../state/ChatRoomListState";
import chatRoomState from "../state/ChatRoomState";
import friendUsersState from "../state/FriendUsersState";
import gameBoardState from "../state/GameBoardState";
import gameRoomListState from "../state/GameRoomListState";
import gameRoomState from "../state/GameRoomState";
import infoState from "../state/InfoState";
import { SocketContext } from "../utils/ChatSocket";
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);
  const [gameRoomList, setGameRoomList] = useRecoilState(gameRoomListState);
  const setChatRoom = useSetRecoilState(chatRoomState);
  const [myInfo, setMyInfo] = useRecoilState(infoState);
  const setGameBoardState = useSetRecoilState(gameBoardState);
  const socket = useContext(SocketContext);
  const setGameState = useSetRecoilState(gameRoomState);
  //유저 정보 변경시 소켓 이벤트
  useEffect(() => {
    if (socket.userId === myInfo.userId && socket.userName === myInfo.nickname)
      return;
    socket.setUser(myInfo.userId, myInfo.nickname);
    socket.socket.emit("addUser", {
      userId: socket.userId,
      userName: socket.userName,
    });
  }, [myInfo]);
  //온라인 유저 소켓 이벤트
  const addOnlineUser = (user: IUser) => {
    setOnlineUsers((prev) => [...prev, user]);
  };

  const deleteOnlineUser = (userId: number) => {
    setOnlineUsers((prev) => prev.filter((user) => user.userId != userId));
  };

  const setLobbyData = async () => {
    const info = JSON.parse(getDecodedCookie());
    setGameState({
      roomId: -1,
      redUser: {},
      blueUser: {},
    });
    setChatRoom({ roomId: -1, title: "", mastUserId: -1, users: [] });
    setMyInfo(await getUserInfoAPI(info.userId));
    setOnlineUsers(await getOnlineUsersAPI());
    setFriendUsers(await getFriendUsersAPI());
    setBlockUsers(await getBlockUsersAPI());
    setChatRoomList(await getChatRoomListAPI());
    setGameRoomList(await getGameRoomListAPI());
    setGameBoardState(await getGameBoardConfigAPI());

    socket.socket.on("addOnlineUser", (user) => addOnlineUser(user));
    socket.socket.on("deleteOnlineUser", (userId) => deleteOnlineUser(userId));
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

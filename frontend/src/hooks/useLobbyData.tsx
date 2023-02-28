import { useState } from "react";
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
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);
  const [gameRoomList, setGameRoomList] = useRecoilState(gameRoomListState);
  const [myInfo, setMyInfo] = useRecoilState(infoState);

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

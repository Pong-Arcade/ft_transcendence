import { useState } from "react";
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
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] =
    useRecoilState<IUser[]>(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState<IUser[]>(blockUsersState);
  const [chatRoomList, setChatRoomList] = useState<ILobbyChatRoom[]>([]);
  const [myInfo, setMyInfo] = useRecoilState(infoState);

  const setLobbyData = async () => {
    const info = JSON.parse(getDecodedCookie());

    setMyInfo(await getUserInfoAPI(info.userId));
    setOnlineUsers(await getOnlineUsersAPI());
    setFriendUsers(await getFriendUsersAPI());
    setBlockUsers(await getBlockUsersAPI());
    setChatRoomList(await getChatRoomListAPI());
  };

  const getLobbyData = () => {
    return { onlineUsers, friendUsers, blockUsers, chatRoomList, myInfo };
  };

  return { setLobbyData, getLobbyData };
};

export default useLobbyData;

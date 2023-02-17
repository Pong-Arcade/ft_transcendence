import { useState } from "react";
import { useRecoilState } from "recoil";
import { getChatRoomListAPI } from "../api/chatRoom";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
  getUserInfoAPI,
} from "../api/users";
import { IChatRoom, IUser } from "../components/modules/Pagination/Pagination";
import { blockUsersState } from "../state/blockUsersState";
import { friendUsersState } from "../state/friendUsersState";
import { myInfoState } from "../state/myInfoState";
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] =
    useRecoilState<IUser[]>(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState<IUser[]>(blockUsersState);
  const [chatRoomList, setChatRoomList] = useState<IChatRoom[]>([]);
  const [myInfo, setMyInfo] = useRecoilState(myInfoState);

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

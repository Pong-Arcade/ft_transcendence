import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getChatRoomListAPI, getGameRoomListAPI } from "../api/room";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
  getUserInfoAPI,
} from "../api/users";
import {
  ILobbyChatRoom,
  ILobbyGameRoom,
  IUser,
} from "../components/modules/Pagination/Pagination";
import blockUsersState from "../state/BlockUsersState";
import friendUsersState from "../state/FriendUsersState";
import GameSocket from "../state/GameSocket";
import infoState from "../state/InfoState";
import { SocketContext } from "../utils/ChatSocket";
import { getDecodedCookie } from "../utils/cookie";

const useLobbyData = () => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [friendUsers, setFriendUsers] =
    useRecoilState<IUser[]>(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState<IUser[]>(blockUsersState);
  const [chatRoomList, setChatRoomList] = useState<ILobbyChatRoom[]>([]);
  const [gameRoomList, setGameRoomList] = useState<ILobbyGameRoom[]>([]);
  const [myInfo, setMyInfo] = useRecoilState(infoState);
  const socket = useContext(SocketContext);
  const gameSocket = useContext(GameSocket);

  useEffect(() => {
    socket.socket.on("addChatRoom", (addRoom: ILobbyChatRoom) => {
      setChatRoomList((prev) => [...prev, addRoom]);
    });

    socket.socket.on("deleteChatRoom", (roomId: number) => {
      setChatRoomList(
        chatRoomList.filter((room) => {
          room.roomId !== roomId.toString();
        })
      );
    });
    gameSocket.socket.on("addGameRoom", (addRoom: ILobbyGameRoom) => {
      setGameRoomList((prev) => [...prev, addRoom]);
    });

    return () => {
      socket.socket.off("addChatRoom");
      socket.socket.off("deleteChatRoom");
      gameSocket.socket.off("addGameRoom");
    };
  }, []);

  const setLobbyData = async () => {
    const info = JSON.parse(getDecodedCookie());

    setMyInfo(await getUserInfoAPI(info.userId));
    setOnlineUsers(await getOnlineUsersAPI());
    setFriendUsers(await getFriendUsersAPI());
    setBlockUsers(await getBlockUsersAPI());
    setChatRoomList(await getChatRoomListAPI());
    setGameRoomList(await getGameRoomListAPI());
    gameSocket.userId = info.userId;
    gameSocket.userName = info.nickname;
  };

  const getLobbyData = () => {
    return {
      onlineUsers,
      friendUsers,
      blockUsers,
      chatRoomList,
      gameRoomList,
      setGameRoomList, //FIXME:
      myInfo,
    };
  };

  return { setLobbyData, getLobbyData };
};

export default useLobbyData;

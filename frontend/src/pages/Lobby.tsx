import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtonGroup from "../components/modules/LobbyCreateRoomButtonGroup";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import UserInfoSettingModal from "../components/modules/UserInfoSettingModal";
import LobbyTemplate from "../components/templates/LobbyTemplate";
import ChatSocket from "../utils/ChatSocket";
import useFirstLoginModal from "../hooks/useFirstLoginModal";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../state/LoadingState";
import {
  getBlockUsersAPI,
  getFriendUsersAPI,
  getOnlineUsersAPI,
} from "../api/users";
import { onlineUsersState } from "../state/OnlineUsersState";
import { friendUsersState } from "../state/FriendUsersState";
import { blockUsersState } from "../state/BlockUsersState";
import { IChatRoom } from "../components/modules/Pagination/Pagination";
import { getChatRoomListAPI } from "../api/chatRoom";

const UserWrapper = styled(Board).attrs({
  width: "25%",
  height: "98%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const RoomListChatWrapper = styled(Board).attrs({
  width: "74%",
  height: "98%",
  flexDirection: "column",
  boarderRadius: true,
  borderRadius: true,
  justifyContent: "space-between",
})``;

const RoomListChat = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "89%",
    backgroundColor: props.theme.background.middle,
    boxShadow: true,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: true,
  };
})``;

// const Lobby = ({ socket }: { socket: ChatSocket }) => {
const Lobby = () => {
  const socket = useRecoilValue(chatSocket);
  console.log(socket);
  // console.log("recoil:", test);
  const { isFirstLogin, onSubmit, onClose } = useFirstLoginModal();
  const setIsLoadingState = useSetRecoilState(loadingState);
  const setOnlineUsers = useSetRecoilState(onlineUsersState);
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const setBlockUsers = useSetRecoilState(blockUsersState);
  const [chatRoomList, setChatRoomList] = useState<IChatRoom[]>([]);

  useEffect(() => {
    if (socket === undefined) {
      // socket = new ChatSocket(1, "user" + Math.floor(Math.random() * 100));
      // console.log("recreated socket");
    }
    if (socket) {
      socket.socket.emit("joinLobby", socket.userid);
      // const createRoom = ({ type, roomname, password, maxUser }: any) => {
      //   socket.socket.emit("createRoom", { type, roomname, password, maxUser });
      // };
    }
    (async () => {
      setIsLoadingState(true);
      setOnlineUsers(await getOnlineUsersAPI());
      setFriendUsers(await getFriendUsersAPI());
      setBlockUsers(await getBlockUsersAPI());
      setChatRoomList(await getChatRoomListAPI());
      setIsLoadingState(false);
    })();
  }, []);

  return (
    <>
      <LobbyTemplate>
        <UserWrapper>
          <LobbyUserProfile />
          <LobbyUserList socket={socket} />
        </UserWrapper>
        <RoomListChatWrapper>
          <LobbyCreateRoomButtonGroup />
          <RoomListChat>
            <LobbyChatRoomList list={chatRoomList} />
            {/* <LobbyGameRoomList /> */}
            <Chat width="98%" height="40%" boxShadow socket={socket} />
          </RoomListChat>
        </RoomListChatWrapper>
      </LobbyTemplate>
      {isFirstLogin && (
        <UserInfoSettingModal onSubmit={onSubmit} onClose={onClose} />
      )}
    </>
  );
};

export default Lobby;

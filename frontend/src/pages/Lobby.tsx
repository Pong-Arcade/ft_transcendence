import React, { useEffect } from "react";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtons from "../components/modules/LobbyCreateRoomButtons";
import LobbyRoomListTypeButtons from "../components/modules/LobbyRoomListTypeButtons";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import LobbyTemplate from "../components/templates/LobbyTemplate";
import ChatSocket from "../utils/ChatSocket";

const UserWrapper = styled(Board).attrs({
  width: "29%",
  height: "98%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const RoomListChatWrapper = styled(Board).attrs({
  width: "69%",
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
    justifyContent: "space-evenly",
    borderRadius: true,
  };
})``;

const Lobby = ({ socket }: { socket: ChatSocket }) => {
  useEffect(() => {
    if (socket === undefined) {
      socket = new ChatSocket(1, "user" + Math.floor(Math.random() * 100));
      console.log("recreated socket");
    }
    if (socket) {
      socket.socket.emit("joinLobby", socket.userid);
      const createRoom = ({ type, roomname, password, maxUser }: any) => {
        socket.socket.emit("createRoom", { type, roomname, password, maxUser });
      };
    }
  });
  return (
    <LobbyTemplate>
      <UserWrapper>
        <LobbyUserProfile />
        <LobbyUserList />
      </UserWrapper>
      <RoomListChatWrapper>
        <LobbyCreateRoomButtons />
        <RoomListChat>
          <LobbyRoomListTypeButtons />
          <LobbyChatRoomList />
          {/* <LobbyGameRoomList /> */}
          <Chat width="98%" height="40%" boxShadow />
        </RoomListChat>
      </RoomListChatWrapper>
    </LobbyTemplate>
  );
};

export default Lobby;

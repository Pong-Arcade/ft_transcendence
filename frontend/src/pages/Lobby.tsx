import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import ModalWrapper from "../components/atoms/ModalWrapper";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtons from "../components/modules/LobbyCreateRoomButtons";
import LobbyRoomListTypeButtons from "../components/modules/LobbyRoomListTypeButtons";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import UserInfoSettingModal from "../components/modules/UserInfoSettingModal";
import LobbyTemplate from "../components/templates/LobbyTemplate";

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

const LoginQueryKey = "isFirstLogin";

const Lobby = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get(LoginQueryKey) === "true") {
      setIsFirstLogin(true);
    }
  }, []);

  const onClose = () => {
    setIsFirstLogin(false);
  };

  return (
    <>
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
      {isFirstLogin && (
        <ModalWrapper onClose={onClose}>
          <UserInfoSettingModal onClose={onClose} />
        </ModalWrapper>
      )}
    </>
  );
};

export default Lobby;

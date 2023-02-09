import styled from "styled-components";
import Board from "../components/atoms/Board";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtons from "../components/modules/LobbyCreateRoomButtons";
import LobbyRoomListTypeButtons from "../components/modules/LobbyRoomListTypeButtons";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import UserInfoSettingModal from "../components/modules/UserInfoSettingModal";
import LobbyTemplate from "../components/templates/LobbyTemplate";
import useFirstLoginModal from "../hooks/useFirstLoginModal";

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

const Lobby = () => {
  const { isFirstLogin, onSubmit, onClose } = useFirstLoginModal();

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
        <UserInfoSettingModal onSubmit={onSubmit} onClose={onClose} />
      )}
    </>
  );
};

export default Lobby;

import { useEffect, useContext } from "react";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtonGroup from "../components/modules/LobbyCreateRoomButtonGroup";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import UserInfoSettingModal from "../components/modules/UserInfoSettingModal";
import LobbyTemplate from "../components/templates/LobbyTemplate";
import { SocketContext } from "../utils/ChatSocket";
import useFirstLoginModal from "../hooks/useFirstLoginModal";
import useLoading from "../hooks/useLoading";
import FullSpinner from "../components/atoms/FullSpinner";
import useLobbyData from "../hooks/useLobbyData";
import socketState from "../state/SocketState";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import errorState from "../state/ErrorState";

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

const Lobby = () => {
  const { setLobbyData, getLobbyData } = useLobbyData();
  const { isLoading, endLoading } = useLoading({
    initialLoading: true,
  });
  const socket = useContext(SocketContext);
  // const [socket, setSocket] = useRecoilValue(socketState);
  const {
    onlineUsers,
    setOnlineUsers,
    friendUsers,
    blockUsers,
    chatRoomList,
    myInfo,
  } = getLobbyData();
  const { isFirstLoginModal, FirstLoginModalClose } = useFirstLoginModal();
  const setError = useSetRecoilState(errorState);

  useEffect(() => {
    (async () => {
      await setLobbyData().catch(() => setError(true));
      endLoading();
    })();
  }, []);
  useEffect(() => {
    socket.setUser(myInfo.userId, myInfo.nickname);
    socket.socket.emit("addUser", {
      userId: socket.userId,
      userName: socket.userName,
    });
  }, [myInfo]);

  return (
    <>
      <LobbyTemplate>
        <UserWrapper>
          <LobbyUserProfile info={myInfo} />
          <LobbyUserList
            onlineUsers={onlineUsers}
            friendUsers={friendUsers}
            blockUsers={blockUsers}
          />
        </UserWrapper>
        <RoomListChatWrapper>
          <LobbyCreateRoomButtonGroup />
          <RoomListChat>
            <LobbyChatRoomList list={chatRoomList} />
            {/* <LobbyGameRoomList /> */}
            <Chat width="98%" height="40%" boxShadow />
          </RoomListChat>
        </RoomListChatWrapper>
      </LobbyTemplate>
      {isFirstLoginModal && (
        <UserInfoSettingModal onClose={FirstLoginModalClose} info={myInfo} />
      )}
      {isLoading && <FullSpinner />}
    </>
  );
};

export default Lobby;

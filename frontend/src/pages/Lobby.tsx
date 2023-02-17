import { useEffect } from "react";
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
import useLoading from "../hooks/useLoading";
import FullSpinner from "../components/atoms/FullSpinner";
import useLobbyData from "../hooks/useLobbyData";

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

// TODO: 소켓 이벤트 등록하기  => LobbyUserList 파일 주석 확인
const Lobby = ({ socket }: { socket: ChatSocket }) => {
  const { setLobbyData, getLobbyData } = useLobbyData();
  const { isLoading, endLoading } = useLoading({
    initialLoading: true,
  });

  useEffect(() => {
    if (socket === undefined) {
      socket = new ChatSocket(1, "user" + Math.floor(Math.random() * 100));
      console.log("recreated socket");
    }
    if (socket) {
      // socket.socket.emit("addUser", socket);
      // const createRoom = ({ type, roomname, password, maxUser }: any) => {
      //   socket.socket.emit("createRoom", { type, roomname, password, maxUser });
      // };
    }
    (async () => {
      await setLobbyData();
      endLoading();
    })();
  }, []);
  const { onlineUsers, friendUsers, blockUsers, chatRoomList, myInfo } =
    getLobbyData();
  const { isFirstLoginModal, FirstLoginModalClose, FirstLoginModalSubmit } =
    useFirstLoginModal();

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
            <Chat width="98%" height="40%" boxShadow socket={socket} />
          </RoomListChat>
        </RoomListChatWrapper>
      </LobbyTemplate>
      {isFirstLoginModal && (
        <UserInfoSettingModal
          onSubmit={FirstLoginModalSubmit}
          onClose={FirstLoginModalClose}
          info={myInfo}
        />
      )}
      {isLoading && <FullSpinner />}
    </>
  );
};

export default Lobby;

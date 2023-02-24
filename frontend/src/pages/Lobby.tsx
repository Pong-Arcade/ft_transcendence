import { useEffect, useContext, useState } from "react";
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
import { useSetRecoilState } from "recoil";
import errorState from "../state/ErrorState";
import LobbyRoomListTypeChoiceButtonGroup from "../components/modules/LobbyRoomListTypeChoiceButtonGroup";
import { EROOM_BUTTON } from "../components/modules/LobbyRoomListTypeChoiceButtonGroup/LobbyRoomListTypeChoiceButtonGroup";
import LobbyGameRoomList from "../components/modules/LobbyGameRoomList";
import { getGameRoomListAPI } from "../api/room";
import GameSocket from "../state/GameSocket";

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
  const gameSocket = useContext(GameSocket);

  const {
    onlineUsers,
    friendUsers,
    blockUsers,
    chatRoomList,
    gameRoomList,
    setGameRoomList, //FIXME: 임시로 여기에 둠
    myInfo,
  } = getLobbyData();
  const { isFirstLoginModal, FirstLoginModalClose } = useFirstLoginModal();
  const setError = useSetRecoilState(errorState);
  const [currentButton, setCurrentButton] = useState(EROOM_BUTTON.CHATROOM);
  const [page, setPage] = useState(0);

  const onChoiceButtonClick = async (button: EROOM_BUTTON) => {
    if (button === EROOM_BUTTON.GAMEROOM) {
      setGameRoomList(await getGameRoomListAPI()); //FIXME: 임시로 여기에 둠
    }
    setCurrentButton(button);
    setPage(0);
  };

  useEffect(() => {
    (async () => {
      await setLobbyData().catch(() => {
        setError(true);
      });
      endLoading();
    })();
  }, []);
  useEffect(() => {
    socket.setUser(myInfo.userId, myInfo.nickname);
    socket.socket.emit("addUser", {
      userId: socket.userId,
      userName: socket.userName,
    });
    gameSocket.socket.emit("addUser", {
      userId: myInfo.userId,
      userName: myInfo.nickname,
    });
  }, [myInfo]);

  const onNextPage = () => {
    setPage(page + 1);
  };
  const onPrevPage = () => {
    setPage(page - 1);
  };

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
            <LobbyRoomListTypeChoiceButtonGroup
              onClick={onChoiceButtonClick}
              currentButton={currentButton}
            />
            {currentButton === EROOM_BUTTON.CHATROOM ? (
              <LobbyChatRoomList
                list={chatRoomList}
                page={page}
                onPrevPage={onPrevPage}
                onNextPage={onNextPage}
              />
            ) : (
              <LobbyGameRoomList
                list={gameRoomList}
                page={page}
                onPrevPage={onPrevPage}
                onNextPage={onNextPage}
              />
            )}
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

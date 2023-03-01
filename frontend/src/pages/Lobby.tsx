import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import Chat from "../components/modules/Chat";
import LobbyChatRoomList from "../components/modules/LobbyChatRoomList";
import LobbyCreateRoomButtonGroup from "../components/modules/LobbyCreateRoomButtonGroup";
import LobbyUserList from "../components/modules/LobbyUserList";
import LobbyUserProfile from "../components/modules/LobbyUserProfile";
import UserInfoSettingModal from "../components/modules/UserInfoSettingModal";
import LobbyTemplate from "../components/templates/LobbyTemplate";
import useFirstLoginModal from "../hooks/useFirstLoginModal";
import useLoading from "../hooks/useLoading";
import FullSpinner from "../components/atoms/FullSpinner";
import useLobbyData from "../hooks/useLobbyData";
import { useSetRecoilState } from "recoil";
import errorState from "../state/ErrorState";
import LobbyRoomListTypeChoiceButtonGroup from "../components/modules/LobbyRoomListTypeChoiceButtonGroup";
import { EROOM_BUTTON } from "../components/modules/LobbyRoomListTypeChoiceButtonGroup/LobbyRoomListTypeChoiceButtonGroup";
import LobbyGameRoomList from "../components/modules/LobbyGameRoomList";
import useModal from "../hooks/useModal";
import ChatInviteModal from "../components/modules/ChatInviteModal";
import lobbyChatEvent from "../event/ChatEvent/lobbyChatEvent";
import lobbyGameEvent from "../event/GameEvent/lobbyGameEvent";
import { SocketContext } from "../utils/ChatSocket";
import ErrorModal from "../components/modules/ErrorModal";

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
  lobbyChatEvent();
  lobbyGameEvent();

  const { setLobbyData, getLobbyData } = useLobbyData();
  const { isLoading, endLoading } = useLoading({
    initialLoading: true,
  });

  const {
    onlineUsers,
    friendUsers,
    blockUsers,
    chatRoomList,
    gameRoomList,
    myInfo,
  } = getLobbyData();
  const { isFirstLoginModal, FirstLoginModalClose } = useFirstLoginModal();
  const setError = useSetRecoilState(errorState);
  const [currentButton, setCurrentButton] = useState(EROOM_BUTTON.CHATROOM);
  const [page, setPage] = useState(0);
  const socket = useContext(SocketContext);
  const [inviteRoomId, setInviteRoomId] = useState(0);
  const [inviteUserName, setInviteUserName] = useState("");
  const [roomError, setRoomError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const onChoiceButtonClick = (button: EROOM_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  // 채팅 초대 모달
  const {
    isModalOpen: isChatInviteModalOpen,
    onModalOpen: onChatInviteModalOpen, // 초대 이벤트 발생 시 오픈
    onModalClose: onChatInviteModalClose,
  } = useModal({});

  useEffect(() => {
    (async () => {
      await setLobbyData().catch(() => {
        setError(true);
      });
      endLoading();
    })();
    // socket.socket.off("inviteChatRoom");

    socket.socket.on("inviteChatRoom", (roomId: number, userName: string) => {
      setInviteRoomId(roomId);
      setInviteUserName(userName);
      onChatInviteModalOpen();
    });
  }, []);

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
      {isChatInviteModalOpen && (
        <ChatInviteModal
          roomId={inviteRoomId}
          userName={inviteUserName}
          onClose={onChatInviteModalClose} // 초대 거절
          setError={setRoomError}
          setErrorContent={setErrorContent}
        />
      )}
      {roomError && (
        <ErrorModal
          onClose={() => setRoomError(false)}
          errors={errorContent}
          title="방입장 실패"
        />
      )}
    </>
  );
};

export default Lobby;

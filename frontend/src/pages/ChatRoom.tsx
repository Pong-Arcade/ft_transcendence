import ChatRoomTemplate from "../components/templates/ChatRoomTemplate";
import Title from "../components/modules/Title";
import ChatRoomUserList from "../components/modules/ChatRoomUserList";
import ChatRoomButtonGroup from "../components/modules/ChatRoomButtonGroup";
import ChatRoomPasswordModify from "../components/modules/ChatRoomPasswordModify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import chatRoomState from "../state/ChatRoomState";
import infoState from "../state/InfoState";
import styled from "styled-components";
import Typography from "../components/atoms/Typography";
import Board from "../components/atoms/Board";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../utils/ChatSocket";
import errorState from "../state/ErrorState";
import GameSocket from "../state/GameSocket";

const TitleTypography = styled(Typography).attrs({
  fontSize: "2.5rem",
})<{ fullWidth?: boolean }>`
  background-color: ${(props) => props.theme.background.front};
  height: 90%;
  width: ${(props) => (props.fullWidth ? "89%" : "66.5%")};
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: ${(props) => props.theme.border.board};
`;

const TitleWrapper = styled(Title)`
  height: 10%;
  justify-content: start;
  gap: 0.8rem;
  padding: 0.2rem;
  font-size: 2.5rem;
`;

const TitleLabel = styled(Board).attrs({
  borderRadius: true,
})`
  background-color: ${(props) => props.theme.background.front};
  width: 10%;
  height: 90%;
`;

const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);
  const myInfo = useRecoilValue(infoState);
  const socket = useContext(SocketContext);
  const setError = useSetRecoilState(errorState);
  const gameSocket = useContext(GameSocket);

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const browserMoveRef = useRef(false);
  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);
    browserMoveRef.current = false;

    if (chatRoom.roomId === -1) {
      console.log(chatRoom);
      setError({
        isError: true,
        error: "해당 방이 없습니다",
        isChangePage: true,
      });
    }

    socket.socket.on("updateChatRoom", (title) =>
      setChatRoom({
        roomId: chatRoom.roomId,
        mastUserId: chatRoom.mastUserId,
        users: chatRoom.users,
        title: title,
        maxUserCount: chatRoom.maxUserCount,
      })
    );
    socket.socket.on("otherLogin", () => {
      setError({
        isError: true,
        error: "문제가 발생했습니다",
        isChangePage: true,
      });
    });
    return () => {
      socket.socket.off("updateChatRoom");
      socket.socket.off("otherLogin");
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  useEffect(() => {
    gameSocket.socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: err.message });
    });
    socket.socket.on("connect_unauth_error", (err) => {
      setError({ isError: true, error: err.message });
    });
    return () => {
      gameSocket.socket.off("connect_unauth_error");
      socket.socket.off("connect_unauth_error");
    };
  }, []);

  return (
    <ChatRoomTemplate>
      <TitleWrapper>
        <TitleLabel>방제목</TitleLabel>
        <TitleTypography fullWidth={myInfo.userId !== chatRoom.mastUserId}>
          {chatRoom.title}
        </TitleTypography>
      </TitleWrapper>
      {myInfo.userId === chatRoom.mastUserId && <ChatRoomPasswordModify />}
      <ChatRoomUserList browserMoveRef={browserMoveRef} />
      <ChatRoomButtonGroup browserMoveRef={browserMoveRef} />
    </ChatRoomTemplate>
  );
};

export default ChatRoom;

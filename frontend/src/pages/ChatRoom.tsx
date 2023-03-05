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
import { useContext, useEffect } from "react";
import { SocketContext } from "../utils/ChatSocket";
import errorState from "../state/ErrorState";

const TitleTypography = styled(Typography).attrs({
  fontSize: "2.5rem",
})`
  background-color: ${(props) => props.theme.background.front};
  height: 90%;
  width: 66%;
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

  useEffect(() => {
    if (chatRoom.roomId === -1) setError({ isError: true, error: "" });

    socket.socket.on("updateChatRoom", (title) =>
      setChatRoom({
        roomId: chatRoom.roomId,
        mastUserId: chatRoom.mastUserId,
        users: chatRoom.users,
        title: title,
      })
    );
    socket.socket.on("otherLogin", () => {
      console.log("otherLogin");
      setError({ isError: true, error: "" });
    });
    return () => {
      socket.socket.off("updateChatRoom");
      socket.socket.off("otherLogin");
    };
  }, []);

  return (
    <ChatRoomTemplate>
      <TitleWrapper>
        <TitleLabel>방제목</TitleLabel>
        <TitleTypography> {chatRoom.title}</TitleTypography>
      </TitleWrapper>
      {myInfo.userId === chatRoom.mastUserId && <ChatRoomPasswordModify />}
      <ChatRoomUserList />
      <ChatRoomButtonGroup />
    </ChatRoomTemplate>
  );
};

export default ChatRoom;

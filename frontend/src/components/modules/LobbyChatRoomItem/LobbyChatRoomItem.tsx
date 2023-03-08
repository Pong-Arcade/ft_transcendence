import styled from "styled-components";
import Button from "../../atoms/Button";
import { ILobbyChatRoom, IPaginationItem } from "../Pagination/Pagination";
import { ReactComponent as Logo } from "../../../assets/chat.svg";
import Board from "../../atoms/Board";
import Typography from "../../atoms/Typography";

const LobbyChatRoomItemStyled = styled(Button).attrs((props) => {
  return {
    backgroundColor: props.theme.background.front,
  };
})`
  display: grid;
  grid-template: repeat(3, 33.3%) / repeat(5, 20%);
`;

const ChatLogo = styled(Logo)`
  width: 10vw;
  height: 15vh;
  grid-row: 1 / -1;
  grid-column: 1 / span 2;
  margin: auto;
`;

const ChatRoomTitle = styled(Board).attrs((props) => {
  return {
    backgroundColor: props.theme.colors.spiroDiscoBall,
    borderRadius: true,
  };
})`
  grid-column: 3 / span 3;
  font-size: 2rem;
  overflow: hidden;
`;

const ChatRoomType = styled(Typography).attrs({
  fontSize: "1.5rem",
})`
  grid-row: 2 / span 1;
  grid-column: 3 / -1;
  align-self: center;
`;

const ChatRoomUserCount = styled(Typography).attrs({
  fontSize: "1.5rem",
})`
  grid-row: 3 / span 1;
  grid-column: 3 / -1;
  align-self: center;
`;

const LobbyChatRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const { roomId, title, mode, maxUserCount, currentCount } =
    item as ILobbyChatRoom;

  return (
    <LobbyChatRoomItemStyled
      id={roomId.toString()}
      onClick={onItemClick}
      data-mode={mode}
    >
      <ChatRoomTitle>{title}</ChatRoomTitle>
      <ChatLogo />
      <ChatRoomType>타입 : {mode}</ChatRoomType>
      <ChatRoomUserCount>
        인원 : {currentCount} / {maxUserCount}
      </ChatRoomUserCount>
    </LobbyChatRoomItemStyled>
  );
};

export default LobbyChatRoomItem;

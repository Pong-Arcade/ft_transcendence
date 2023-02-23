import styled from "styled-components";
import Button from "../../atoms/Button";
import { ILobbyChatRoom, IPaginationItem } from "../Pagination/Pagination";
import { ReactComponent as Logo } from "../../../assets/chat.svg";
import Board from "../../atoms/Board";
import Typography from "../../atoms/Typography";

const LobbyChatRoomItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})`
  display: grid;
  grid-template: repeat(2, 50%) / repeat(5, 20%);
`;

const ChatLogo = styled(Logo)`
  width: 10vw;
  height: 15vh;
  grid-row: 1 / span 2;
  grid-column: 1 / span 2;
  margin: auto;
`;

const ChatRoomTitle = styled(Board).attrs({
  width: "100%",
  height: "100%",
})`
  grid-column: 3 / span 3;
  font-size: 2rem;
`;

const ChatRoomContent = styled(Board).attrs({
  width: "100%",
  height: "100%",
  justifyContent: "space-around",
})`
  grid-column: 3 / -1;
`;

const LobbyChatRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const { roomId, title, mode, maxUserCount, currentCount } =
    item as ILobbyChatRoom;
  return (
    <LobbyChatRoomItemStyled id={roomId.toString()} onClick={onItemClick}>
      <ChatRoomTitle>{title}</ChatRoomTitle>
      <ChatLogo />
      <ChatRoomContent>
        <Typography fontSize="1.5rem">{mode}</Typography>
        <Typography fontSize="1.5rem">
          {currentCount} / {maxUserCount}
        </Typography>
      </ChatRoomContent>
    </LobbyChatRoomItemStyled>
  );
};

export default LobbyChatRoomItem;

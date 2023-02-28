import styled from "styled-components";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { IPaginationItem, IUser } from "../Pagination/Pagination";

const ChatRoomItemStyled = styled(Button).attrs((props) => {
  return {
    width: "97%",
    height: "97%",
    backgroundColor: props.theme.background.front,
  };
})`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const Nickname = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "20%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})``;

const ChatRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const { nickname, userId, avatarUrl } = item as IUser;
  return (
    <ChatRoomItemStyled id={userId?.toString()} onClick={onItemClick}>
      <Avatar width="10vw" height="10vw" src={avatarUrl} />
      <Nickname>{nickname}</Nickname>
    </ChatRoomItemStyled>
  );
};

export default ChatRoomItem;

import styled from "styled-components";
import Avatar from "../../atoms/Avatar";
import Board from "../../atoms/Board";
import Button from "../../atoms/Button";
import { IPaginationItem, IUser } from "../Pagination/Pagination";
import { userMode } from "../Pagination/Pagination";

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
  position: relative;
`;
const Nickname = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "20%",
    backgroundColor: props.theme.background.middle,
    borderRadius: true,
  };
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleEmoji = styled(Board)`
  height: 10%;
  width: 100%;
  position: absolute;
  justify-content: end;
  top: 2%;
  margin-right: 1rem;
  font-size: 2rem;
`;

const ChatRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const { nickname, userId, mode, avatarUrl } = item as IUser;
  return (
    <ChatRoomItemStyled id={userId?.toString()} onClick={onItemClick}>
      {mode === userMode.MASTER && <RoleEmoji>👑</RoleEmoji>}
      {mode === userMode.ADMIN && <RoleEmoji>👮</RoleEmoji>}
      <Avatar width="10vw" height="10vw" src={avatarUrl} />
      <Nickname>{nickname}</Nickname>
    </ChatRoomItemStyled>
  );
};

export default ChatRoomItem;

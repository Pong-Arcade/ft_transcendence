import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem, IUser } from "../Pagination/Pagination";

const ChatRoomItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})``;

const ChatRoomItem = ({ item, onItemClick }: IPaginationItem) => {
  const { nickname, userId } = item as IUser;
  return (
    <ChatRoomItemStyled id={userId?.toString()} onClick={onItemClick}>
      {nickname}
    </ChatRoomItemStyled>
  );
};

export default ChatRoomItem;

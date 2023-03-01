import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem, IUser } from "../Pagination/Pagination";

const ChatRoomInviteUserItemStyled = styled(Button).attrs({
  width: "100%",
  height: "100%",
})<{ checked?: boolean }>`
  background-color: ${(props) =>
    props.checked ? props.theme.background.back : props.theme.background.front};
`;

const ChatRoomInviteUserItem = ({
  item,
  subList,
  onItemClick,
}: IPaginationItem) => {
  const { userId, nickname } = item as IUser;
  return (
    <ChatRoomInviteUserItemStyled
      id={userId?.toString()}
      onClick={onItemClick}
      checked={subList?.includes(nickname as string)}
    >
      {nickname}
    </ChatRoomInviteUserItemStyled>
  );
};

export default ChatRoomInviteUserItem;

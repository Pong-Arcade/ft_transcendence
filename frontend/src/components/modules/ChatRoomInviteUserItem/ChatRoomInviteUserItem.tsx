import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem } from "../LobbyUserItem/LobbyUserItem";

const ChatRoomInviteUserItemStyled = styled(Button).attrs({
  width: "100%",
  height: "100%",
})<{ checked?: boolean }>`
  background-color: ${(props) =>
    props.checked ? props.theme.background.back : props.theme.background.front};
`;

const ChatRoomInviteUserItem = ({
  item: { nickname },
  subList,
  onItemClick,
}: IPaginationItem) => {
  return (
    <ChatRoomInviteUserItemStyled
      onClick={onItemClick}
      checked={subList?.includes(nickname ? nickname : "")}
    >
      {nickname}
    </ChatRoomInviteUserItemStyled>
  );
};

export default ChatRoomInviteUserItem;

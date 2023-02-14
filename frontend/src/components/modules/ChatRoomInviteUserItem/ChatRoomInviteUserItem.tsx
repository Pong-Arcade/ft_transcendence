import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem } from "../Pagination/Pagination";

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
  if (!("nickname" in item)) return <div></div>;

  const { nickname } = item;
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

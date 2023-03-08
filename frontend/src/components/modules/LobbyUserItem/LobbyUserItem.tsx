import styled from "styled-components";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import { IPaginationItem, IUser } from "../Pagination/Pagination";

const LobbyUserItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})``;

const LobbyUserItem = ({ item, onItemClick }: IPaginationItem) => {
  const { nickname, userId } = item as IUser;
  return (
    <LobbyUserItemStyled id={userId?.toString()} onClick={onItemClick}>
      <Typography fontSize="1.5rem">{nickname}</Typography>
    </LobbyUserItemStyled>
  );
};

export default LobbyUserItem;

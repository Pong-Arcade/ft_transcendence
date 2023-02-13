import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem } from "../Pagination/Pagination";

const LobbyUserItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})``;

const LobbyUserItem = ({ item, onItemClick }: IPaginationItem) => {
  if (!("nickname" in item)) return <div></div>;

  const { nickname } = item;
  return (
    <LobbyUserItemStyled onClick={onItemClick}>{nickname}</LobbyUserItemStyled>
  );
};

export default LobbyUserItem;
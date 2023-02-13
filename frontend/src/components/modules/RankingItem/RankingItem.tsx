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

const RankingItem = ({ item, onItemClick }: IPaginationItem) => {
  if (!("ranking" in item)) return <div></div>;

  const { ranking } = item;
  return (
    <LobbyUserItemStyled onClick={onItemClick}>{ranking}</LobbyUserItemStyled>
  );
};

export default RankingItem;

import styled from "styled-components";
import Button from "../../atoms/Button";
import { IPaginationItem } from "../Pagination/Pagination";

const LobbyUserItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`;

const Field = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const RankingItem = ({ item, onItemClick }: IPaginationItem) => {
  if (!("ranking" in item)) return <div></div>;

  const {
    ranking,
    userInfo: { nickname },
    ladderScore,
    winCount,
    loseCount,
    winRate,
  } = item;

  return (
    <LobbyUserItemStyled onClick={onItemClick}>
      <Field>{ranking}</Field>
      <Field>{nickname}</Field>
      <Field>{ladderScore}</Field>
      <Field>{winCount}</Field>
      <Field>{loseCount}</Field>
      <Field>{winRate}%</Field>
    </LobbyUserItemStyled>
  );
};

export default RankingItem;

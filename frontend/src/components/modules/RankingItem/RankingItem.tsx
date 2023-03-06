import styled from "styled-components";
import Button from "../../atoms/Button";
import Typography from "../../atoms/Typography";
import { IPaginationItem, IRanking } from "../Pagination/Pagination";

const LobbyUserItemStyled = styled(Button).attrs((props) => {
  return {
    width: "100%",
    height: "100%",
    backgroundColor: props.theme.background.front,
  };
})`
  display: grid;
  cursor: auto;
  grid-template-columns: repeat(6, 1fr);
  &:hover {
    box-shadow: none;
  }
`;

// const Field = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   /* text-align: center; */
// `;
const Field = styled(Typography).attrs({
  fontSize: "1.5rem",
})`
  align-self: center;
`;

const RankingItem = ({ item, onItemClick }: IPaginationItem) => {
  const {
    ranking,
    userInfo: { userId, nickname },
    ladderScore,
    winCount,
    loseCount,
    winRate,
  } = item as IRanking;

  return (
    <LobbyUserItemStyled id={userId?.toString()} onClick={onItemClick}>
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

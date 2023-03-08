import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import Board from "../Board";

export enum ERankingFilter {
  LADDER_SCORE = "ladderScore",
  WIN_COUNT = "winCount",
  LOSE_COUNT = "loseCount",
  WIN_RATE = "winRate",
}

export enum ERankingOrder {
  ASC = "ASC",
  DESC = "DESC",
}

const RankingFilterStyled = styled(Board).attrs((props) => {
  return {
    width: "22%",
    height: "9%",
    backgroundColor: props.theme.background.front,
    borderRadius: true,
  };
})`
  position: absolute;
  top: 0.5%;
  right: 12%;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 2rem;
`;

const Select = styled.select`
  font-size: 2rem;
  background-color: ${(props) => props.theme.background.back};
  cursor: pointer;
  width: 50%;
  height: 60%;
  text-align: center;
  border-radius: ${(props) => props.theme.border.board};
  transition: 0.5s;
  box-shadow: ${(props) => props.theme.box.shadow};
  appearance: none;
  outline: none;

  &:hover {
    background-color: ${(props) => props.theme.background.front};
  }
`;

interface Props {
  setFilter: Dispatch<SetStateAction<ERankingFilter>>;
  setOrder: Dispatch<SetStateAction<ERankingOrder>>;
}

const RankingFilter = ({ setFilter, setOrder }: Props) => {
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [filter, order] = e.target.value.split("&");
    setFilter(filter as ERankingFilter);
    setOrder(order as ERankingOrder);
  };

  return (
    <RankingFilterStyled>
      <Label htmlFor="filter">랭킹 필터 : </Label>
      <Select id="filter" onChange={onChange}>
        <option value={`${ERankingFilter.LADDER_SCORE}&${ERankingOrder.DESC}`}>
          점수 높은 순
        </option>
        <option value={`${ERankingFilter.LADDER_SCORE}&${ERankingOrder.ASC}`}>
          점수 낮은 순
        </option>
        <option value={`${ERankingFilter.WIN_COUNT}&${ERankingOrder.DESC}`}>
          승 많은 순
        </option>
        <option value={`${ERankingFilter.WIN_COUNT}&${ERankingOrder.ASC}`}>
          승 적은 순
        </option>
        <option value={`${ERankingFilter.LOSE_COUNT}&${ERankingOrder.DESC}`}>
          패 많은 순
        </option>
        <option value={`${ERankingFilter.LOSE_COUNT}&${ERankingOrder.ASC}`}>
          패 적은 순
        </option>
        <option value={`${ERankingFilter.WIN_RATE}&${ERankingOrder.DESC}`}>
          승률 높은 순
        </option>
        <option value={`${ERankingFilter.WIN_RATE}&${ERankingOrder.ASC}`}>
          승률 낮은 순
        </option>
      </Select>
    </RankingFilterStyled>
  );
};

export default RankingFilter;

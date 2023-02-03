import React from "react";
import styled from "styled-components";
import Board from "../Board";

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

// TODO: value 추가, 각각 api 호출
const RankingFilter = () => {
  return (
    <RankingFilterStyled>
      <Label htmlFor="filter">랭킹 필터 : </Label>
      <Select id="filter">
        <option>점수 높은 순</option>
        <option>점수 낮은 순</option>
        <option>승 많은 순</option>
        <option>승 적은 순</option>
        <option>패 많은 순</option>
        <option>패 적은 순</option>
        <option>승률 높은 순</option>
        <option>승률 낮은 순</option>
      </Select>
    </RankingFilterStyled>
  );
};

export default RankingFilter;

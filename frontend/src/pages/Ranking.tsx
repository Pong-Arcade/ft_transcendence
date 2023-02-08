import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import GridList from "../components/atoms/GridList";
import PaginationButton from "../components/atoms/PaginationButton";
import RankingFilter from "../components/atoms/RankingFilter";
import ButtonGroup from "../components/modules/ButtonGroup";
import ModalTitle from "../components/modules/ModalTitle";
import RankTemplate from "../components/templates/RankTemplate";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "89%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

// TODO: filter 버튼 클릭으로 api 요청 기능 추가
const Rank = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate("/lobby");
  };
  return (
    <RankTemplate>
      <ModalTitle fontSize="3rem" height="10%" onClose={onClose}>
        랭킹
      </ModalTitle>
      <RankingFilter />
      <Wrapper>
        <GridList
          titleList={["순위", "ID", "점수", "승", "패", "승률"]}
          contentList={[
            ["1", "인트라1", "100", "10", "0", "0%"],
            ["2", "인트라2", "90", "9", "1", "0%"],
            ["3", "인트라3", "80", "8", "2", "0%"],
            ["4", "인트라4", "70", "7", "3", "0%"],
            ["5", "인트라5", "60", "6", "4", "0%"],
            ["6", "인트라1", "100", "10", "0", "0%"],
            ["7", "인트라2", "90", "9", "1", "0%"],
            ["8", "인트라3", "80", "8", "2", "0%"],
            ["9", "인트라4", "70", "7", "3", "0%"],
            ["10", "인트라5", "60", "6", "4", "0%"],
          ]}
          width="100%"
          height="90%"
          rowCount={10}
        />
        <ButtonGroup
          width="20vw"
          height="9%"
          justifyContent="space-between"
          backgroundColor="secondary"
        >
          <PaginationButton
            direction="left"
            height="4vh"
            width="8vw"
            fontSize="1.5rem"
          />
          <PaginationButton
            direction="right"
            height="4vh"
            width="8vw"
            fontSize="1.5rem"
          />
        </ButtonGroup>
      </Wrapper>
    </RankTemplate>
  );
};

export default Rank;

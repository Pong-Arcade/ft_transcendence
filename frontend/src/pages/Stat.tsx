import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import Button from "../components/atoms/Button";
import GridList from "../components/atoms/GridList";
import PaginationButton from "../components/atoms/PaginationButton";
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

const Rank = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate("/lobby");
  };
  return (
    <RankTemplate>
      <ModalTitle fontSize="3rem" height="10%" onClose={onClose}>
        user's 최근 전적
      </ModalTitle>

      <Wrapper>
        <GridList
          titleList={["결과", "상대ID", "점수", "경기시간"]}
          contentList={[
            ["승", "상대1", "10 : 8", "3m 10s"],
            ["패", "상대2", "9 : 10", "3m 30s"],
            ["승", "상대3", "10 : 3", "2m 50s"],
            ["승", "상대4", "10 : 9", "4m 01s"],
            ["패", "상대5", "8 : 10", "3m 25s"],
            ["승", "상대1", "10 : 8", "3m 10s"],
            ["패", "상대2", "9 : 10", "3m 30s"],
            ["승", "상대3", "10 : 3", "2m 50s"],
            ["승", "상대4", "10 : 9", "4m 01s"],
            ["패", "상대5", "8 : 10", "3m 25s"],
          ]}
          width="100%"
          height="90%"
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
        <ButtonGroup height="10%" width="100%" backgroundColor="secondary">
          <Button width="25%" height="80%" fontSize="2rem" boxShadow>
            일반게임
          </Button>
          <Button width="25%" height="80%" fontSize="2rem" boxShadow>
            레더게임
          </Button>
        </ButtonGroup>
      </Wrapper>
    </RankTemplate>
  );
};

export default Rank;

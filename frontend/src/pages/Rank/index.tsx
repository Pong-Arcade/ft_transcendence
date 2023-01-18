import React from "react";
import styled from "styled-components";
import Board from "../../components/ui/boards/Board";
import Button from "../../components/ui/buttons/Button";
import List from "../../components/ui/lists/List";
import ListElement from "../../components/ui/lists/ListElement";

const RankStyled = styled(Board)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: start;
  padding: 2vh 4vh;
  gap: 1vh;
`;

const RankTitle = styled(Board)`
  background-color: ${(props) => props.theme.colors.freshAir};
  width: 100%;
  height: 8%;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
`;

// TODO: 순위 사진 아이디 승 패
const RankList = styled(List)`
  height: 85%;
  align-items: center;
`;

const RankChoiceButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const RankChoiceButton = styled(Button).attrs({
  fontSize: "1.5rem",
  width: "30vw",
  height: "6vh",
})``;

const RankElement = styled(ListElement)`
  background-color: white;
  min-height: 10vh;
  width: 99%;
`;

const RankContentGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(3, 2fr);
  column-gap: 1vw;
`;

const RankContent = styled.div`
  text-align: center;
  align-items: center;
  color: black;
`;

const rankColumns: string[] = ["순위", "아이디", "승", "패"];
const RankColumns = styled(ListElement)`
  background-color: ${(props) => props.theme.colors.chineseWhite};
  display: grid;
  grid-template-columns: 1fr repeat(3, 2fr);
  text-align: center;
  align-items: center;
  column-gap: 1vw;
  min-height: 3vh;
  width: 99%;
`;

const RankColumn = styled.div`
  color: black;
`;

let rankList: any[] = [];
const num = 30;
for (let i = 0; i < num; ++i) {
  rankList.push({
    intraId: `인트라${i}`,
    winCount: `${num - i}`,
    loseCount: `${i}`,
  });
}

// TODO: pagination 구현
const Rank = () => {
  return (
    <RankStyled>
      <RankTitle>Rank</RankTitle>

      <RankList>
        <RankColumns>
          {rankColumns.map((elem, idx) => (
            <RankColumn key={idx}>{elem}</RankColumn>
          ))}
        </RankColumns>
        {rankList.map((elem, idx) => (
          <RankElement key={idx}>
            <RankContentGroup>
              <RankContent>{idx + 1}</RankContent>
              <RankContent>{elem.intraId}</RankContent>
              <RankContent>{elem.winCount}</RankContent>
              <RankContent>{elem.loseCount}</RankContent>
            </RankContentGroup>
          </RankElement>
        ))}
      </RankList>
      <RankChoiceButtonGroup>
        <RankChoiceButton>레더게임</RankChoiceButton>
        <RankChoiceButton>일반게임</RankChoiceButton>
      </RankChoiceButtonGroup>
    </RankStyled>
  );
};

export default Rank;

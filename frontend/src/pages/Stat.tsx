import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import GridList from "../components/atoms/GridList";
import ModalTitle from "../components/modules/ModalTitle";
import RankTemplate from "../components/templates/RankingTemplate";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "89%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

// TODO: 상대 아이디 클릭시 상대 정보 모달 띄우기
const titleList = ["결과", "상대ID", "분류", "점수", "플레이시간", "시작시간"];
const contentList = [
  ["승", "상대1", "일반게임", "10 : 8", "3m 10s", "2022-01-01 00:00:00"],
  ["패", "상대2", "레더게임", "9 : 10", "3m 30s", "2022-01-01 00:00:00"],
  ["승", "상대3", "레더게임", "10 : 3", "2m 50s", "2022-01-01 00:00:00"],
  ["승", "상대4", "레더게임", "10 : 9", "4m 01s", "2022-01-01 00:00:00"],
  ["패", "상대5", "레더게임", "8 : 10", "3m 25s", "2022-01-01 00:00:00"],
  ["승", "상대1", "레더게임", "10 : 8", "3m 10s", "2022-01-01 00:00:00"],
  ["패", "상대2", "일반게임", "9 : 10", "3m 30s", "2022-01-01 00:00:00"],
  ["승", "상대3", "일반게임", "10 : 3", "2m 50s", "2022-01-01 00:00:00"],
  ["승", "상대4", "일반게임", "10 : 9", "4m 01s", "2022-01-01 00:00:00"],
  ["패", "상대5", "일반게임", "8 : 10", "3m 25s", "2022-01-01 00:00:00"],
];

const Rank = () => {
  const navigate = useNavigate();

  return (
    <RankTemplate>
      <ModalTitle
        fontSize="3rem"
        height="10%"
        onClose={() => navigate("/lobby")}
      >
        user's 최근 전적
      </ModalTitle>

      <Wrapper>
        // FIXME: 리팩토링 (GridList 제거)
        <GridList
          titleList={titleList}
          contentList={contentList}
          width="100%"
          height="98%"
          boxShadow
          isStat
          rowCount={10}
        />
      </Wrapper>
    </RankTemplate>
  );
};

export default Rank;

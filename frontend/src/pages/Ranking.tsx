import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import RankingFilter from "../components/atoms/RankingFilter";
import ModalTitle from "../components/modules/ModalTitle";
import RankingItem from "../components/modules/RankingItem";
import RankingPagination from "../components/modules/RankingPagination";
import RankingTemplate from "../components/templates/RankingTemplate";
import useRankList from "../hooks/useRankList";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "89%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

// TODO: filter 버튼 클릭으로 api 요청 기능 추가
const Ranking = () => {
  const navigate = useNavigate();
  const { rankList } = useRankList();
  const [page, setPage] = useState(0);
  return (
    <RankingTemplate>
      <ModalTitle
        fontSize="3rem"
        height="10%"
        onClose={() => navigate("/lobby")}
      >
        랭킹
      </ModalTitle>
      <RankingFilter />
      <Wrapper>
        <RankingPagination
          list={rankList}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={RankingItem}
        />
      </Wrapper>
    </RankingTemplate>
  );
};

export default Ranking;

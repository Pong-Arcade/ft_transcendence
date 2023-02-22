import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import RankingFilter from "../components/atoms/RankingFilter";
import ModalTitle from "../components/modules/ModalTitle";
import RankingItem from "../components/modules/RankingItem";
import RankingPagination from "../components/modules/RankingPagination";
import RankingTemplate from "../components/templates/RankingTemplate";
import useRanking from "../hooks/useRanking";

const Wrapper = styled(Board).attrs({
  width: "100%",
  height: "89%",
  borderRadius: true,
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const Ranking = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { rankingList, setFilter, setOrder } = useRanking();

  return (
    <RankingTemplate>
      <ModalTitle
        fontSize="3rem"
        height="10%"
        onClose={() => navigate("/lobby")}
      >
        랭킹
      </ModalTitle>
      <RankingFilter setFilter={setFilter} setOrder={setOrder} />
      <Wrapper>
        <RankingPagination
          list={rankingList}
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

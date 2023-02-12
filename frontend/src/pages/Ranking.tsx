import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Board from "../components/atoms/Board";
import RankingFilter from "../components/atoms/RankingFilter";
import LobbyUserItem from "../components/modules/LobbyUserItem";
import ModalTitle from "../components/modules/ModalTitle";
import RankingPagination from "../components/modules/RankingPagination";
import RankingTemplate from "../components/templates/RankingTemplate";
import useLobbyUserList from "../hooks/useLobbyUserList";

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
  const { onlineUsers } = useLobbyUserList();
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
          list={onlineUsers}
          attrList={["순위", "ID", "점수", "승", "패", "승률"]}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyUserItem}
        />
      </Wrapper>
    </RankingTemplate>
  );
};

export default Ranking;

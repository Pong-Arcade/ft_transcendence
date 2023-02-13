import { MouseEvent } from "react";
import styled from "styled-components";
import Pagination from "../Pagination";
import { IItem, IPaginationItem } from "../Pagination/Pagination";

interface Props {
  list: IItem[];
  PaginationItem: (arg: IPaginationItem) => JSX.Element;
  page: number;
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const RankingAttributeGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 12%;
  background-color: ${(props) => props.theme.background.front};
  border-radius: ${(props) => props.theme.border.board};
`;

const RankingAttribute = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background.front};
  width: 100%;
  height: 100%;
  font-size: 2rem;
  border-radius: 50%;
`;

const RankingPagination = ({
  list,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 10;
  const attrList = ["순위", "ID", "점수", "승", "패", "승률"];

  return (
    <>
      <RankingAttributeGroup>
        {attrList.map((attr, idx) => (
          <RankingAttribute key={idx}>{attr}</RankingAttribute>
        ))}
      </RankingAttributeGroup>
      <Pagination
        list={list.slice(page * pageLength, (page + 1) * pageLength)}
        PaginationItem={PaginationItem}
        nextPageDisabled={page === Math.floor(list.length / pageLength)}
        prevPageDisabled={page === 0}
        buttonGroupHeight="12%"
        buttonHeight="50%"
        buttonWidth="10%"
        buttonGap="2vw"
        width="100%"
        itemGap="0.3vh"
        gridTemplate="repeat(10, 1fr) / 1fr"
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onItemClick={onItemClick}
      />
    </>
  );
};

export default RankingPagination;

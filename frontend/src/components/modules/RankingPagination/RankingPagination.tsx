import { MouseEvent } from "react";
import AttributeGroup from "../AttributeGroup";
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
      <AttributeGroup attrList={attrList} />
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

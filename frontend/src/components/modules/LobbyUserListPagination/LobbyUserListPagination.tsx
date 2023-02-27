import { MouseEvent } from "react";
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

const LobbyUserListPagination = ({
  list,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 10;

  return (
    <Pagination
      list={list?.slice(page * pageLength, (page + 1) * pageLength)}
      PaginationItem={PaginationItem}
      nextPageDisabled={page === Math.floor(list?.length / pageLength)}
      prevPageDisabled={page === 0}
      buttonGroupHeight="15%"
      buttonHeight="60%"
      buttonWidth="30%"
      buttonGap="2vw"
      width="90%"
      itemGap="0.3vh"
      gridTemplate="repeat(10, 1fr) / 1fr"
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onItemClick={onItemClick}
    />
  );
};

export default LobbyUserListPagination;

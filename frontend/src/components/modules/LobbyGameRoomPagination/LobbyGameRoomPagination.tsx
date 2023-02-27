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

const LobbyGameRoomPagination = ({
  list,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 2;

  return (
    <Pagination
      list={list.slice(page * pageLength, (page + 1) * pageLength)}
      PaginationItem={PaginationItem}
      nextPageDisabled={page === Math.floor(list.length / pageLength)}
      prevPageDisabled={page === 0}
      buttonGroupHeight="15%"
      buttonHeight="70%"
      buttonWidth="15%"
      buttonGap="2vw"
      width="90%"
      height="95%"
      itemGap="0.3vh"
      gridTemplate="1fr / repeat(2, 1fr)"
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onItemClick={onItemClick}
    />
  );
};

export default LobbyGameRoomPagination;

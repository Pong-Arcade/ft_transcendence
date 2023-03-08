import { MouseEvent } from "react";
import Pagination from "../Pagination";
import { IPaginationItem } from "../Pagination/Pagination";
import { ILobbyChatRoom } from "../Pagination/Pagination";
interface Props {
  list: ILobbyChatRoom[];
  PaginationItem: (arg: IPaginationItem) => JSX.Element;
  page: number;
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const LobbyChatRoomPagination = ({
  list,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 4;
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
      height="95%"
      width="90%"
      itemGap="0.3vh"
      gridTemplate="repeat(2, 1fr) / repeat(2, 1fr)"
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onItemClick={onItemClick}
    />
  );
};

export default LobbyChatRoomPagination;

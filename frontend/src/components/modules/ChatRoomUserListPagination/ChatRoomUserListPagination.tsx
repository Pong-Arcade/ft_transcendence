import { MouseEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../utils/ChatSocket";
import Pagination from "../Pagination";
import { IItem, IPaginationItem, IUser } from "../Pagination/Pagination";

interface Props {
  list: IItem[];
  PaginationItem: (arg: IPaginationItem) => JSX.Element;
  page: number;
  onItemClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const ChatRoomUserListPagination = ({
  list,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 5;

  return (
    <Pagination
      list={list.slice(page * pageLength, (page + 1) * pageLength)}
      PaginationItem={PaginationItem}
      nextPageDisabled={page === Math.floor(list.length / pageLength)}
      prevPageDisabled={page === 0}
      buttonGroupHeight="15%"
      buttonHeight="70%"
      buttonWidth="10%"
      buttonGap="2vw"
      width="100%"
      height="44%"
      itemGap="0.3vh"
      gridTemplate="1fr / repeat(5, 1fr)"
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onItemClick={onItemClick}
    />
  );
};

export default ChatRoomUserListPagination;

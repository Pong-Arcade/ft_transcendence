import { MouseEvent, useContext, useEffect } from "react";
import { SocketContext } from "../../../utils/ChatSocket";
import Pagination from "../Pagination";
import { IItem, IPaginationItem, IUser } from "../Pagination/Pagination";

interface Props {
  list: IUser[];
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
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.socket.on("joinChatRoom", (user) => {
      console.log("joinchat", user);
      list.push(user);
    });
  });

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

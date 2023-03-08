import Pagination from "../Pagination";
import { IItem, IPaginationItem } from "../Pagination/Pagination";

interface Props {
  list: IItem[];
  subList?: string[];
  PaginationItem: (arg: IPaginationItem) => JSX.Element;
  page: number;
  onItemClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const ChatRoomInvitePagination = ({
  list,
  subList,
  PaginationItem,
  onItemClick,
  page,
  onNextPage,
  onPrevPage,
}: Props) => {
  const pageLength = 10;

  return (
    <Pagination
      list={list.slice(page * pageLength, (page + 1) * pageLength)}
      subList={subList}
      PaginationItem={PaginationItem}
      nextPageDisabled={page === Math.floor(list.length / pageLength)}
      prevPageDisabled={page === 0}
      buttonGroupHeight="12%"
      buttonHeight="60%"
      buttonWidth="30%"
      buttonGap="2vw"
      width="100%"
      height="80%"
      itemGap="0.3vh"
      gridTemplate="repeat(10, 1fr) / 1fr"
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onItemClick={onItemClick}
    />
  );
};

export default ChatRoomInvitePagination;

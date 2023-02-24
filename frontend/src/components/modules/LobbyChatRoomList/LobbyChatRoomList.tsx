import { AxiosError } from "axios";
import { MouseEvent, useState } from "react";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import Board from "../../atoms/Board";
import ErrorModal from "../ErrorModal";
import LobbyChatRoomItem from "../LobbyChatRoomItem";
import LobbyChatRoomPagination from "../LobbyChatRoomPagination";
import { ILobbyChatRoom } from "../Pagination/Pagination";

const LobbyChatRoomListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "49%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: true,
  };
})``;

interface Props {
  list: ILobbyChatRoom[];
  page: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const LobbyChatRoomList = ({ list, page, onNextPage, onPrevPage }: Props) => {
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const joinChatRoom = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      await joinChatRoomAPI(event.currentTarget.id);
      // 준표님 로직 추가하세요
    } catch (e: any | AxiosError) {
      if (e instanceof AxiosError) {
        setError(true);
        setErrorContent(e.response?.data.message);
      }
    }
  };

  return (
    <LobbyChatRoomListStyled>
      <LobbyChatRoomPagination
        list={list}
        page={page}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        PaginationItem={LobbyChatRoomItem}
        onItemClick={joinChatRoom}
      />
      {error && (
        <ErrorModal
          onClose={() => setError(false)}
          errors={errorContent}
          title="방입장 실패"
        />
      )}
    </LobbyChatRoomListStyled>
  );
};

export default LobbyChatRoomList;

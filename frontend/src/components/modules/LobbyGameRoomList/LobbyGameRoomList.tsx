import { AxiosError } from "axios";
import { MouseEvent, useState } from "react";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import Board from "../../atoms/Board";
import ErrorModal from "../ErrorModal";
import LobbyChatRoomItem from "../LobbyChatRoomItem";
import LobbyGameRoomPagination from "../LobbyGameRoomPagination";
import { ILobbyGameRoom } from "../Pagination/Pagination";

const LobbyChatRoomListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "59%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: true,
  };
})``;

interface Props {
  list: ILobbyGameRoom[];
  page: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

// TODO: game room list, 게임방 밖으로 빼기
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
      <LobbyGameRoomPagination
        list={list}
        page={page}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        PaginationItem={LobbyChatRoomItem}
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

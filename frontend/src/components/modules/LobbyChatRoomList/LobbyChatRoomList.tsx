import { AxiosError } from "axios";
import { MouseEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { joinChatRoomAPI } from "../../../api/room";
import Board from "../../atoms/Board";
import ErrorModal from "../ErrorModal";
import LobbyChatRoomItem from "../LobbyChatRoomItem";
import LobbyChatRoomPagination from "../LobbyChatRoomPagination";
import LobbyGameRoomPagination from "../LobbyGameRoomPagination";
import LobbyRoomListTypeChoiceButtonGroup from "../LobbyRoomListTypeChoiceButtonGroup";
import { EROOM_BUTTON } from "../LobbyRoomListTypeChoiceButtonGroup/LobbyRoomListTypeChoiceButtonGroup";
import { ILobbyChatRoom } from "../Pagination/Pagination";

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
  list: ILobbyChatRoom[];
}

// TODO: game room list, 게임방 밖으로 빼기
const LobbyChatRoomList = ({ list }: Props) => {
  const [page, setPage] = useState(0);
  const [currentButton, setCurrentButton] = useState(EROOM_BUTTON.CHATROOM);
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const navigate = useNavigate();

  const onChoiceButtonClick = (button: EROOM_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  const joinChatRoom = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      const id = event.currentTarget.id;
      const response = await joinChatRoomAPI(event.currentTarget.id);
      console.log("response data: ", response.data);
      await navigate("/chat-rooms/" + id, {
        state: { users: response.data.users },
      });
    } catch (e: any | AxiosError) {
      if (e instanceof AxiosError) {
        setError(true);
        setErrorContent(e.response?.data.message);
      }
    }
  };

  return (
    <LobbyChatRoomListStyled>
      <LobbyRoomListTypeChoiceButtonGroup
        onClick={onChoiceButtonClick}
        currentButton={currentButton}
      />
      {currentButton === EROOM_BUTTON.CHATROOM ? (
        <LobbyChatRoomPagination
          list={list}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyChatRoomItem}
          onItemClick={joinChatRoom}
        />
      ) : (
        <LobbyGameRoomPagination
          list={list}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyChatRoomItem} //TODO: LobbyGameRoomItem
        />
      )}
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

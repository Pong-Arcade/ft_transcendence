import { MouseEvent, useState } from "react";
import styled from "styled-components";
import Board from "../../atoms/Board";
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

// TODO: game room list
const LobbyChatRoomList = ({ list }: Props) => {
  const [page, setPage] = useState(0);
  const [currentButton, setCurrentButton] = useState(EROOM_BUTTON.CHATROOM);

  const onChoiceButtonClick = (button: EROOM_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  const joinChatRoom = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(event);
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
    </LobbyChatRoomListStyled>
  );
};

export default LobbyChatRoomList;

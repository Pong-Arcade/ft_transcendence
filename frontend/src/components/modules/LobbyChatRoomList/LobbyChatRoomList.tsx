import { useState } from "react";
import styled from "styled-components";
import useLobbyUserList from "../../../hooks/useLobbyUserList";
import Board from "../../atoms/Board";
import LobbyChatRoomPagination from "../LobbyChatRoomPagination";
import LobbyGameRoomPagination from "../LobbyGameRoomPagination";
import LobbyRoomListTypeChoiceButtonGroup from "../LobbyRoomListTypeChoiceButtonGroup";
import { EROOM_BUTTON } from "../LobbyRoomListTypeChoiceButtonGroup/LobbyRoomListTypeChoiceButtonGroup";
import LobbyUserItem from "../LobbyUserItem";

const LobbyChatRoomListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "55%",
    backgroundColor: props.theme.background.middle,
    flexDirection: "column",
    justifyContent: "space-evenly",
    borderRadius: true,
  };
})``;

// TODO: chat room list, game room list
const LobbyChatRoomList = () => {
  const { onlineUsers, friendUsers } = useLobbyUserList();
  const [page, setPage] = useState(0);
  const [currentButton, setCurrentButton] = useState(EROOM_BUTTON.CHATROOM);

  const onChoiceButtonClick = (button: EROOM_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  return (
    <LobbyChatRoomListStyled>
      <LobbyRoomListTypeChoiceButtonGroup
        onClick={onChoiceButtonClick}
        currentButton={currentButton}
      />
      {currentButton === EROOM_BUTTON.CHATROOM ? (
        <LobbyChatRoomPagination
          list={onlineUsers}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyUserItem} //TODO: LobbyChatRoomItem
        />
      ) : (
        <LobbyGameRoomPagination
          list={friendUsers}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyUserItem} //TODO: LobbyGameRoomItem
        />
      )}
    </LobbyChatRoomListStyled>
  );
};

export default LobbyChatRoomList;

import { useState } from "react";
import styled from "styled-components";
import useLobbyUserList from "../../../hooks/useLobbyUserList";
import useMenu from "../../../hooks/useMenu";
import Board from "../../atoms/Board";
import GeneralMenu from "../GeneralMenu";
import LobbyUserItem from "../LobbyUserItem";
import LobbyUserListPagination from "../LobbyUserListPagination";
import UserListTypeChoiceButtonGroup from "../UserListTypeChoiceButtonGroup";
import { EUSER_BUTTON } from "../UserListTypeChoiceButtonGroup/UserListTypeChoiceButtonGroup";

const LobbyUserListStyled = styled(Board).attrs((props) => {
  return {
    width: "100%",
    height: "74%",
    borderRadius: true,
    backgroundColor: props.theme.background.middle,
    boxShadow: true,
    flexDirection: "column",
    justifyContent: "space-around",
  };
})``;

const LobbyUserList = () => {
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY, id } =
    useMenu();

  const [currentButton, setCurrentButton] = useState(EUSER_BUTTON.ONLINE_USERS);
  const { onlineUsers, friendUsers, blockUsers } = useLobbyUserList();
  const [page, setPage] = useState(0);
  const onChoiceButtonClick = (button: EUSER_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  return (
    <>
      <LobbyUserListStyled>
        <UserListTypeChoiceButtonGroup
          onClick={onChoiceButtonClick}
          currentButton={currentButton}
        />
        <LobbyUserListPagination
          list={
            currentButton === "접속중인유저"
              ? onlineUsers
              : currentButton === "친구목록"
              ? friendUsers
              : blockUsers
          }
          onItemClick={onOpenMenu}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          PaginationItem={LobbyUserItem}
        />
      </LobbyUserListStyled>
      <GeneralMenu
        userId={id}
        isOpenMenu={isOpenMenu}
        onClose={onCloseMenu}
        top={positionY}
        left={positionX}
      />
    </>
  );
};

export default LobbyUserList;

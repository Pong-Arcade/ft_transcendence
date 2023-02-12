import { useState } from "react";
import styled from "styled-components";
import useLobbyUserList from "../../../hooks/useLobbyUserList";
import useMenu from "../../../hooks/useMenu";
import useModal from "../../../hooks/useModal";
import Board from "../../atoms/Board";
import LobbyUserItem from "../LobbyUserItem";
import LobbyUserListPagination from "../LobbyUserListPagination";
import Menu from "../Menu";
import UserInfoModal from "../UserInfoModal";
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
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY } =
    useMenu();
  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onCloseMenu();
    },
  });
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
      {isOpenMenu && ( // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        <Menu
          list={["정보보기", "귓속말", "친구추가", "차단하기"]}
          top={positionY}
          left={positionX}
          onOpen={onUserInfoOpen}
          onClose={onCloseMenu}
        />
      )}
      {isUserInfoOpen && (
        <UserInfoModal onClose={onUserInfoClose} width="50%" height="90%" />
      )}
    </>
  );
};

export default LobbyUserList;

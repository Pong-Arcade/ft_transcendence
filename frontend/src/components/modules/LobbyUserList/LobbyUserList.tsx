import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getFriendUsersAPI } from "../../../api/users";
import useMenu from "../../../hooks/useMenu";
import errorState from "../../../state/ErrorState";
import friendUsersState from "../../../state/FriendUsersState";
import Board from "../../atoms/Board";
import GeneralMenu from "../GeneralMenu";
import LobbyUserItem from "../LobbyUserItem";
import LobbyUserListPagination from "../LobbyUserListPagination";
import { IUser } from "../Pagination/Pagination";
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

interface Props {
  onlineUsers: IUser[];
  friendUsers: IUser[];
  blockUsers: IUser[];
}
const LobbyUserList = ({ onlineUsers, friendUsers, blockUsers }: Props) => {
  const {
    isOpenMenu,
    onOpenMenu,
    onCloseMenu,
    positionX,
    positionY,
    id,
    name,
  } = useMenu();

  const [currentButton, setCurrentButton] = useState(EUSER_BUTTON.ONLINE_USERS);
  const setFriendUsers = useSetRecoilState(friendUsersState);
  const [page, setPage] = useState(0);
  const setError = useSetRecoilState(errorState);
  const onGetFriendUsers = async () => {
    try {
      setFriendUsers(await getFriendUsersAPI());
    } catch (error) {
      setError({ isError: true, error });
    }
  };
  const onChoiceButtonClick = (button: EUSER_BUTTON) => {
    if (button == "친구목록") {
      onGetFriendUsers();
    }
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
        name={name}
        isOpenMenu={isOpenMenu}
        onClose={onCloseMenu}
        top={positionY}
        left={positionX}
      />
    </>
  );
};

export default LobbyUserList;

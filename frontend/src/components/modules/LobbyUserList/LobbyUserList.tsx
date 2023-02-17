import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import useLobbyUserList from "../../../hooks/useLobbyUserList";
import useMenu from "../../../hooks/useMenu";
import { blockUsersState } from "../../../state/BlockUsersState";
import { friendUsersState } from "../../../state/FriendUsersState";
import { onlineUsersState } from "../../../state/OnlineUsersState";
import ChatSocket from "../../../utils/ChatSocket";
import Board from "../../atoms/Board";
import GeneralMenu from "../GeneralMenu";
import LobbyUserItem from "../LobbyUserItem";
import LobbyUserListPagination from "../LobbyUserListPagination";
import { IUser } from "../Pagination/Pagination";
import UserListTypeChoiceButtonGroup from "../UserListTypeChoiceButtonGroup";
import { EUSER_BUTTON } from "../UserListTypeChoiceButtonGroup/UserListTypeChoiceButtonGroup";
import { chatSocket } from "../../..";
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
  // const LobbyUserList = ({ socket }: { socket: ChatSocket }) => {
  const {
    isOpenMenu,
    onOpenMenu,
    onCloseMenu,
    positionX,
    positionY,
    id,
    name,
  } = useMenu();

  const [socket, setSocket] = useRecoilState(chatSocket);

  const [currentButton, setCurrentButton] = useState(EUSER_BUTTON.ONLINE_USERS);
  // const {
  //   onlineUsers,
  //   friendUsers,
  //   blockUsers,
  //   setOnlineUsers,
  //   setFriendUsers,
  //   setBlockUsers,
  // } = useLobbyUserList();

  const [onlineUsers, setOnlineUsers] = useRecoilState(onlineUsersState);
  const [friendUsers, setFriendUsers] = useRecoilState(friendUsersState);
  const [blockUsers, setBlockUsers] = useRecoilState(blockUsersState);
  const [page, setPage] = useState(0);
  const onChoiceButtonClick = (button: EUSER_BUTTON) => {
    setCurrentButton(button);
    setPage(0);
  };

  const addOnlineUser = (user: IUser) => {
    setOnlineUsers((prev) => [...prev, user]);
  };
  const deleteOnlineUser = (userId: string) => {
    setOnlineUsers((prev) => {
      let users = new Array<IUser>();
      prev.forEach((user) => {
        if (user.userId != userId) users.push(user);
      });
      return users;
    });
  };
  useEffect(() => {
    let newSocket = socket;
    newSocket.socket.on("addOnlineUser", (user) => addOnlineUser(user));
    newSocket.socket.on("deleteOnlineUser", (userId) =>
      deleteOnlineUser(userId)
    );
    setSocket(newSocket);
    // socket.socket.on("addOnlineUser", (user) => addOnlineUser(user));
    // socket.socket.on("deleteOnlineUser", (userId) => deleteOnlineUser(userId));
  }, []);
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

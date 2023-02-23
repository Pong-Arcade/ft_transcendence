import { useContext, useEffect, useState } from "react";
// import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useMenu from "../../../hooks/useMenu";
import useModal from "../../../hooks/useModal";
// import chatRoomState from "../../../state/ChatRoomState";
import Board from "../../atoms/Board";
import Chat from "../Chat";
import ChatRoomItem from "../ChatRoomItem";
import ChatRoomUserListPagination from "../ChatRoomUserListPagination";
// import Menu from "../ChatRoomMenu";
import UserInfoModal from "../UserInfoModal";
import ChatRoomMenu from "../ChatRoomMenu";
import { IUser } from "../Pagination/Pagination";
import { SocketContext } from "../../../utils/ChatSocket";
import { useLocation, useNavigate } from "react-router-dom";
import { userMode } from "../Pagination/Pagination";

const ChatRoomUserListStyled = styled(Board).attrs({
  width: "100%",
  height: "81%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const ChatRoomUserList = () => {
  const {
    isOpenMenu,
    onOpenMenu,
    onCloseMenu,
    positionX,
    positionY,
    id,
    name,
  } = useMenu();
  // const chatRoomInfo = useRecoilValue(chatRoomState);

  const {
    isModalOpen: isUserInfoOpen,
    // onModalOpen: onUserInfoOpen,
    onModalClose: onUserInfoClose,
  } = useModal({
    afterOpen: () => {
      onCloseMenu();
    },
  });
  // TODO: chat room user list
  const socket = useContext(SocketContext);
  const [page, setPage] = useState(0);
  const [userList, setUserList] = useState<IUser[]>();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state) {
      const users: IUser[] = location.state.users;
      console.log("users: ", users);
      async () => {
        if (users) await setUserList(users);
        console.log(userList);
      };
    }
    socket.socket.off("joinChatRoom");
    socket.socket.off("leaveChatRoom");
    socket.socket.off("destructChatRoom");
    socket.socket.off("banChatRoom");
    socket.socket.off("addAdmin");
    socket.socket.off("deleteAdmin");
    socket.socket.on("joinChatRoom", (user: IUser) => {
      setUserList((prev) => (prev ? [...prev, user] : new Array<IUser>(user)));
    });
    socket.socket.on("leaveChatRoom", (userId: number) => {
      const newList = new Array<IUser>();
      if (userList) {
        for (const user of userList) {
          if (user.userId !== userId) newList.push(user);
        }
        setUserList(newList);
      }
    });
    socket.socket.on("destructChatRoom", () => {
      navigate(`/lobby`);
    });
    socket.socket.on("banChatRoom", () => {
      console.log("banchat");
      navigate(`/lobby`);
    });
    socket.socket.on("addAdmin", (userId) => {
      console.log("addadmin", userId);
      setUserList(
        userList?.map((user) =>
          user.userId == userId ? { ...user, mode: userMode.ADMIN } : user
        )
      );
    });
    socket.socket.on("deleteAdmin", (userId) => {
      console.log("deleteadmin", userId);
      setUserList(
        userList?.map((user) =>
          user.userId == userId ? { ...user, mode: userMode.NORMAL } : user
        )
      );
    });
  }, [userList]);

  return (
    <>
      <ChatRoomUserListStyled>
        <ChatRoomUserListPagination
          list={userList ? userList : new Array<IUser>()}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          onItemClick={onOpenMenu}
          PaginationItem={ChatRoomItem}
        />
        <Chat width="100%" height="55%" />
      </ChatRoomUserListStyled>
      <ChatRoomMenu
        list={userList ? userList : new Array<IUser>()}
        top={positionY}
        left={positionX}
        isOpenMenu={isOpenMenu}
        onClose={onCloseMenu}
        userId={id}
        name={name}
      />
      {isUserInfoOpen && (
        <UserInfoModal userId={id} onClose={onUserInfoClose} />
      )}
    </>
  );
};

export default ChatRoomUserList;

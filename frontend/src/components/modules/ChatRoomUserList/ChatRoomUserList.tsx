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
import { useNavigate } from "react-router-dom";
import { userMode } from "../Pagination/Pagination";
import { useRecoilValue } from "recoil";
import infoState from "../../../state/InfoState";
import chatRoomState from "../../../state/ChatRoomState";

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
  const navigate = useNavigate();
  const myInfo = useRecoilValue(infoState);
  const chatRoom = useRecoilValue(chatRoomState);
  useEffect(() => {
    setUserList(chatRoom.users);
  }, [chatRoom]);
  useEffect(() => {
    if (!userList) {
      const users: IUser[] = chatRoom.users;
      setUserList(users);
    }

    socket.socket.on("joinChatRoom", (user: IUser) => {
      setUserList((prev) => (prev ? [...prev, user] : new Array<IUser>(user)));
    });
    socket.socket.on("leaveChatRoom", (userId: number) => {
      if (userList) {
        setUserList(userList.filter((user) => user.userId !== userId));
      }
    });
    socket.socket.on("destructChatRoom", () => {
      navigate(`/lobby`);
    });
    socket.socket.on("banChatRoom", () => {
      navigate(`/lobby`);
    });
    socket.socket.on("addAdmin", (userId: number) => {
      setUserList(
        userList?.map((user) =>
          user.userId == userId ? { ...user, mode: userMode.ADMIN } : user
        )
      );
    });
    socket.socket.on("deleteAdmin", (userId: number) => {
      setUserList(
        userList?.map((user) =>
          user.userId == userId ? { ...user, mode: userMode.NORMAL } : user
        )
      );
    });
    return () => {
      socket.socket.off("joinChatRoom");
      socket.socket.off("leaveChatRoom");
      socket.socket.off("destructChatRoom");
      socket.socket.off("banChatRoom");
      socket.socket.off("addAdmin");
      socket.socket.off("deleteAdmin");
    };
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
      {myInfo.userId !== id && (
        <ChatRoomMenu
          list={userList ? userList : new Array<IUser>()}
          top={positionY}
          left={positionX}
          isOpenMenu={isOpenMenu}
          onClose={onCloseMenu}
          userId={id}
          name={name}
        />
      )}

      {isUserInfoOpen && (
        <UserInfoModal userId={id} onClose={onUserInfoClose} />
      )}
    </>
  );
};

export default ChatRoomUserList;

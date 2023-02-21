import { useState } from "react";
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

  const [page, setPage] = useState(0);

  return (
    <>
      <ChatRoomUserListStyled>
        <ChatRoomUserListPagination
          // list={chatRoomInfo.users}
          list={[
            {
              userId: 1,
              nickname: "test",
              avatarUrl: "example.com",
            },
            {
              userId: 2,
              nickname: "test",
              avatarUrl: "example.com",
            },
            {
              userId: 3,
              nickname: "test",
              avatarUrl: "example.com",
            },
            {
              userId: 1,
              nickname: "test",
              avatarUrl: "example.com",
            },
            {
              userId: 1,
              nickname: "test",
              avatarUrl: "example.com",
            },
          ]}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          onItemClick={onOpenMenu}
          PaginationItem={ChatRoomItem}
        />
        <Chat width="100%" height="55%" />
      </ChatRoomUserListStyled>
      <ChatRoomMenu
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

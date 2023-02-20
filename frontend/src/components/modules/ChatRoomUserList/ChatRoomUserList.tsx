import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useMenu from "../../../hooks/useMenu";
import useModal from "../../../hooks/useModal";
import chatRoomState from "../../../state/ChatRoomState";
import Board from "../../atoms/Board";
import Chat from "../Chat";
import ChatRoomUserListPagination from "../ChatRoomUserListPagination";
import LobbyUserItem from "../LobbyUserItem";
import Menu from "../Menu";
import UserInfoModal from "../UserInfoModal";

const ChatRoomUserListStyled = styled(Board).attrs({
  width: "100%",
  height: "81%",
  flexDirection: "column",
  justifyContent: "space-between",
})``;

const ChatRoomUserList = () => {
  const { isOpenMenu, onOpenMenu, onCloseMenu, positionX, positionY, id } =
    useMenu();
  const chatRoomInfo = useRecoilValue(chatRoomState);

  const {
    isModalOpen: isUserInfoOpen,
    onModalOpen: onUserInfoOpen,
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
          list={chatRoomInfo.users}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          onItemClick={onOpenMenu}
          PaginationItem={LobbyUserItem} //TODO: LobbyChatRoomItem
        />
        <Chat width="100%" height="55%" />
      </ChatRoomUserListStyled>
      {isOpenMenu && ( // TODO: 정보보기 제외 다른 기능 추가 시 리팩토링 필요
        <Menu
          list={["정보보기", "강퇴하기", "채팅금지", "관리자부여", "게임신청"]}
          top={positionY}
          left={positionX}
          onOpen={onUserInfoOpen}
          onClose={onCloseMenu}
        />
      )}
      {isUserInfoOpen && (
        <UserInfoModal
          userId={id}
          onClose={onUserInfoClose}
          width="50%"
          height="90%"
        />
      )}
    </>
  );
};

export default ChatRoomUserList;
